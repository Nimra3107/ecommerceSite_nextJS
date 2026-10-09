"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../components/AuthProvider";
import { getApiUrl } from "../lib/api";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const router = useRouter();
  const { userId } = useAuth();
  const API_URL = getApiUrl();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        const productsWithSelection = data.map((product) => ({
          ...product,
          selectedQuantity: product.quantity > 0 ? 1 : 0,
        }));

        setProducts(productsWithSelection);
      } catch (error) {
        console.log("Products error:", error);
      }
    };

    getProducts();
  }, [API_URL]);

  const increaseQuantity = (product) => {
    if (product.quantity <= 0 || product.selectedQuantity >= product.quantity) {
      return;
    }

    setProducts(
      products.map((item) =>
        item.id === product.id
          ? {
              ...item,
              selectedQuantity: item.selectedQuantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (product) => {
    if (product.selectedQuantity <= 1) {
      return;
    }

    setProducts(
      products.map((item) =>
        item.id === product.id
          ? {
              ...item,
              selectedQuantity: item.selectedQuantity - 1,
            }
          : item
      )
    );
  };

  const addToCart = async (product) => {
    if (!userId || isNaN(Number(userId))) {
      alert("Please login first");
      router.push("/login");
      return;
    }

    if (product.quantity <= 0 || product.selectedQuantity <= 0) {
      alert("This product is currently out of stock");
      return;
    }

    const quantityToAdd = product.selectedQuantity;

    try {
      const response = await fetch(`${API_URL}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: Number(userId),
          product_id: product.id,
          product_name: product.name,
          price: product.price,
          image: product.image,
          cart_quantity: quantityToAdd,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || data.message || "Unable to add to cart");
        return;
      }

      if (data.message && data.message !== "Product added to cart") {
        alert(data.message);
        return;
      }

      router.push("/cart");
    } catch (error) {
      console.log("Add to cart error:", error);
      alert("Unable to connect to server");
    }
  };

  return (
    <div className="products-container">
      <h1>Our Products</h1>

      <div className="products">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            increaseQuantity={increaseQuantity}
            decreaseQuantity={decreaseQuantity}
            addToCart={addToCart}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductsPage;
