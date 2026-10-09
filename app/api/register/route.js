import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { detail: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const { data: existingUser } = await supabase
      .table("users")
      .select("id")
      .eq("email", email.trim())
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json(
        { detail: "Email is already registered" },
        { status: 400 }
      );
    }

    // Insert user
    const { data, error } = await supabase
      .table("users")
      .insert({
        username: username.trim(),
        email: email.trim(),
        password: password,
      })
      .select("id, username, email")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { detail: "Registration failed" },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Register route error:", err);
    return NextResponse.json(
      { detail: "Registration failed" },
      { status: 500 }
    );
  }
}
