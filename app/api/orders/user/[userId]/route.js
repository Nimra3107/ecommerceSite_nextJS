import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request, { params }) {
  try {
    const { userId: userIdStr } = await params;
    const userId = parseInt(userIdStr, 10);

    if (!userId || isNaN(userId) || userId <= 0) {
      return NextResponse.json([], { status: 200 });
    }

    // 1. Get all orders for this user
    const { data: orders, error: ordersErr } = await supabase
      // .table("orders")
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (ordersErr || !orders || orders.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // 2. Fetch items for each order
    const result = [];
    for (const order of orders) {
      const { data: items } = await supabase
        // .table("order_items")
        .from("order_items")
        .select("*")
        .eq("order_id", order.id);

      result.push({
        ...order,
        items: items || [],
      });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("User orders GET error:", err);
    return NextResponse.json([], { status: 200 });
  }
}
