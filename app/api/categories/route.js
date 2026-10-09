import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      // .table("categories")
      .from("categories")
      .select("*")
      .order("id");

    if (error) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(data || []);
  } catch (err) {
    console.error("Categories route error:", err);
    return NextResponse.json([], { status: 200 });
  }
}
