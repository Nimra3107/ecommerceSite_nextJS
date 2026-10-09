import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PATCH(request, { params }) {
  try {
    const { orderId: orderIdStr } = await params;
    const orderId = parseInt(orderIdStr, 10);
    const { status } = await request.json();

    const allowedStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { message: "Invalid order status" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      // .table("orders")
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .select();

    if (error || !data || data.length === 0) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Order status updated successfully",
      order: data[0],
    });
  } catch (err) {
    console.error("Order status update error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
