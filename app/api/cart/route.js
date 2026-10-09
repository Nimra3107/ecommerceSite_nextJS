import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request) {
  try {
    const item = await request.json();
    const userId = parseInt(item.user_id, 10);
    const productId = parseInt(item.product_id, 10);
    const cartQuantity = parseInt(item.cart_quantity || 1, 10);

    if (!userId || !productId || cartQuantity < 1) {
      return NextResponse.json(
        { message: "Invalid cart data" },
        { status: 400 }
      );
    }

    // 1. Check product stock
    const { data: product, error: prodErr } = await supabase
      // .table("products")
      .from("products")
      .select("quantity")
      .eq("id", productId)
      .maybeSingle();

    if (prodErr || !product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    const currentQuantity = product.quantity;
    const newStock = currentQuantity - cartQuantity;

    if (newStock < 0) {
      return NextResponse.json(
        { message: "Not enough stock" },
        { status: 400 }
      );
    }

    // 2. Check if item already exists in user's cart
    const { data: existingItems } = await supabase
      // .table("cart_items")
      .from("cart_items")
      .select("*")
      .eq("user_id", userId)
      .eq("product_id", productId);

    let cartResponseData = null;

    if (existingItems && existingItems.length > 0) {
      const existing = existingItems[0];
      const newQuantity = existing.cart_quantity + cartQuantity;

      const { data: updateData, error: updateErr } = await supabase
        // .table("cart_items")
        .from("cart_items")
        .update({ cart_quantity: newQuantity })
        .eq("id", existing.id)
        .eq("user_id", userId)
        .select();

      if (updateErr) {
        return NextResponse.json(
          { message: "Failed to update cart" },
          { status: 500 }
        );
      }
      cartResponseData = updateData;
    } else {
      const { data: insertData, error: insertErr } = await supabase
        // .table("cart_items")
        .from("cart_items")
        .insert({
          user_id: userId,
          product_id: productId,
          product_name: item.product_name,
          price: item.price,
          image: item.image,
          cart_quantity: cartQuantity,
        })
        .select();

      if (insertErr) {
        return NextResponse.json(
          { message: "Failed to add to cart" },
          { status: 500 }
        );
      }
      cartResponseData = insertData;
    }

    // 3. Decrement product stock
    await supabase
      // .table("products")
      .from("products")
      .update({ quantity: newStock })
      .eq("id", productId);

    return NextResponse.json({
      message: "Product added to cart",
      cart: cartResponseData,
    });
  } catch (err) {
    console.error("Cart POST error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
