import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/cart/[userId] -> get cart items for a user
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const userId = parseInt(id, 10);

    if (!userId || isNaN(userId) || userId <= 0) {
      return NextResponse.json([], { status: 200 });
    }

    const { data, error } = await supabase
      // .table("cart_items")
      .from("cart_items")
      .select("*")
      .eq("user_id", userId)
      .order("id", { ascending: true });

    if (error) {
      console.error("Cart GET error:", error);
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(data || []);
  } catch (err) {
    console.error("Cart GET error:", err);
    return NextResponse.json([], { status: 200 });
  }
}

// DELETE /api/cart/[cartId]?user_id=[userId] -> delete a cart item
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const cartId = parseInt(id, 10);

    const { searchParams } = new URL(request.url);
    const userIdParam = searchParams.get("user_id");
    const userId = userIdParam ? parseInt(userIdParam, 10) : null;

    if (!cartId || isNaN(cartId)) {
      return NextResponse.json(
        { message: "Invalid cart item ID" },
        { status: 400 }
      );
    }

    // 1. Find cart item
    const { data: cartItem, error: findErr } = await supabase
      // .table("cart_items")
      .from("cart_items")
      .select("*")
      .eq("id", cartId)
      .maybeSingle();

    if (findErr || !cartItem) {
      return NextResponse.json(
        { message: "Cart item not found" },
        { status: 404 }
      );
    }

    // Check ownership if user_id is provided
    if (userId && cartItem.user_id !== userId) {
      return NextResponse.json(
        { detail: "You are not authorized to delete this cart item" },
        { status: 403 }
      );
    }

    // 2. Restore product stock if product exists
    const productId = cartItem.product_id;
    const cartQuantity = cartItem.cart_quantity;

    const { data: product } = await supabase
      // .table("products")
      .from("products")
      .select("quantity")
      .eq("id", productId)
      .maybeSingle();

    let newStock = null;
    if (product && typeof product.quantity === "number") {
      newStock = product.quantity + cartQuantity;
      await supabase
        // .table("products")
        .from("products")
        .update({ quantity: newStock })
        .eq("id", productId);
    }

    // 3. Delete cart item
    // await supabase.table("cart_items").delete().eq("id", cartId);
    await supabase.from("cart_items").delete().eq("id", cartId);

    return NextResponse.json({
      message: "Cart item deleted and stock restored",
      product_id: productId,
      restored_quantity: cartQuantity,
      new_stock: newStock,
    });
  } catch (err) {
    console.error("Cart DELETE error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
