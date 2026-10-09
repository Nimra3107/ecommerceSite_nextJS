import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { detail: "Email and password are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("users")
      .select("id, username, email")
      .eq("email", email.trim())
      .eq("password", password)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json(
        { detail: "Invalid email or password" },
        { status: 401 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Login route error:", err);
    return NextResponse.json(
      { detail: "Internal server error" },
      { status: 500 }
    );
  }
}
