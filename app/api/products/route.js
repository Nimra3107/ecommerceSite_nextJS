import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: products, error: prodErr } = await supabase
      // .table("products")
      .from("products")
      .select("*")
      .order("id", { ascending: true });

    if (prodErr) {
      console.error("Products fetch error:", prodErr);
      return NextResponse.json([], { status: 200 });
    }

    const { data: categories } = await supabase
      // .table("categories")
      .from("categories")
      .select("*");

    const categoriesList = categories || [];

    const productsWithCategory = (products || []).map((prod) => {
      const cat = categoriesList.find((c) => c.id === prod.category_id);
      return {
        ...prod,
        category_name: cat ? cat.category : "No Category",
      };
    });

    return NextResponse.json(productsWithCategory);
  } catch (err) {
    console.error("Products route error:", err);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const category_id = formData.get("category_id");
    const price = parseFloat(formData.get("price"));
    const quantity = parseInt(formData.get("quantity"), 10);
    const image = formData.get("image");

    if (!name || isNaN(price) || isNaN(quantity)) {
      return NextResponse.json(
        { message: "Invalid product information" },
        { status: 400 }
      );
    }

    let imageUrl = "";

    // If an image file was uploaded
    if (image && typeof image === "object" && image.name) {
      const fileName = `${Date.now()}-${image.name}`;
      const buffer = Buffer.from(await image.arrayBuffer());

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, buffer, {
          contentType: image.type || "image/jpeg",
        });

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);
        imageUrl = publicUrlData?.publicUrl || "";
      } else {
        console.error("Storage upload error:", uploadError);
      }
    } else if (typeof image === "string") {
      imageUrl = image;
    }

    const { data, error } = await supabase
      // .table("products")
      .from("products")
      .insert({
        name,
        description,
        category_id: category_id ? parseInt(category_id, 10) : null,
        price,
        quantity,
        image: imageUrl,
      })
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json(
        { message: error?.message || "Product could not be added" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Product added successfully",
      product: data,
    });
  } catch (err) {
    console.error("Add product error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
