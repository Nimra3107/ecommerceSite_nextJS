import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request) {
  try {
    const order = await request.json();
    const userId = parseInt(order.user_id, 10);

    if (!userId || isNaN(userId) || userId <= 0) {
      return NextResponse.json(
        { detail: "Invalid user ID" },
        { status: 400 }
      );
    }

    if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
      return NextResponse.json(
        { detail: "Cannot place an order with an empty cart" },
        { status: 400 }
      );
    }

    // 1. Create main order in orders table
    const { data: orderData, error: orderErr } = await supabase
      // .table("orders")
      .from("orders")
      .insert({
        user_id: userId,
        customer_name: (order.customer_name || "").trim(),
        address: (order.address || "").trim(),
        phone: (order.phone || "").trim(),
        payment_method: order.payment_method || "Cash on Delivery",
        total_price: parseFloat(order.total_price),
        status: "Pending",
      })
      .select()
      .single();

    if (orderErr || !orderData) {
      console.error("Order creation error:", orderErr);
      return NextResponse.json(
        { detail: "Order could not be created" },
        { status: 500 }
      );
    }

    const orderId = orderData.id;

    // 2. Prepare order items
    const orderItems = order.items.map((item) => ({
      order_id: orderId,
      product_id: parseInt(item.product_id, 10),
      product_name: item.product_name,
      price: parseFloat(item.price),
      quantity: parseInt(item.quantity, 10),
      total_price: parseFloat(item.total_price),
    }));

    // 3. Insert into order_items table
    const { error: itemsErr } = await supabase
      // .table("order_items")
      .from("order_items")
      .insert(orderItems);

    if (itemsErr) {
      console.error("Order items error:", itemsErr);
      // Roll back created order
      await supabase.table("orders").delete().eq("id", orderId);
      return NextResponse.json(
        { detail: "Order items could not be saved" },
        { status: 500 }
      );
    }

    // 4. Clear current user's cart in Supabase
    try {
      await supabase.table("cart_items").delete().eq("user_id", userId);
    } catch (clearErr) {
      console.error("Warning: Cart clearing error:", clearErr);
    }

    return NextResponse.json({
      message: "Order placed successfully",
      order_id: orderId,
    });
  } catch (err) {
    console.error("Orders POST error:", err);
    return NextResponse.json(
      { detail: "Internal server error" },
      { status: 500 }
    );
  }
}
