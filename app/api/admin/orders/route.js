import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: orders, error } = await supabase
      // .table("orders")
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !orders) {
      return NextResponse.json([], { status: 200 });
    }

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
    console.error("Admin orders GET error:", err);
    return NextResponse.json([], { status: 200 });
  }
}
