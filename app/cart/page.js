"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthProvider";
import { getApiUrl } from "../../lib/api";

function CartPage() {
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { userId, ready, isLoggedIn } = useAuth();
  const API_URL = getApiUrl();

  useEffect(() => {
    if (!ready) {
      return;
    }

    const getCart = async () => {
      if (!userId || isNaN(Number(userId))) {
        setCartProducts([]);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/cart/${userId}`);
        const data = await response.json();

        if (!response.ok) {
          alert(data.detail || "Unable to get cart");
          setCartProducts([]);
          setLoading(false);
          return;
        }

        setCartProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log("Get cart error:", error);
        alert("Unable to connect to server");
      } finally {
        setLoading(false);
      }
    };

    getCart();
  }, [API_URL, ready, userId]);

  const deleteFromCart = async (cartId) => {
    try {
      const response = await fetch(`${API_URL}/cart/${cartId}?user_id=${userId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || data.message || "Unable to delete item");
        return;
      }

      setCartProducts((previousCart) =>
        previousCart.filter((item) => item.id !== cartId)
      );
    } catch (error) {
      console.log("Delete cart error:", error);
      alert("Unable to connect to server");
    }
  };

  const totalQuantity = cartProducts.reduce((total, product) => {
    return total + product.cart_quantity;
  }, 0);

  const totalPrice = cartProducts.reduce((total, product) => {
    return total + product.price * product.cart_quantity;
  }, 0);

  const handleCheckout = () => {
    router.push("/checkout");
  };

  if (!ready || loading) {
    return (
      <div className="cart-container empty-cart">
        <h1>Loading cart...</h1>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="cart-container empty-cart">
        <h1>Please login to see your cart</h1>
        <button onClick={() => router.push("/login")}>Login</button>
      </div>
    );
  }

  if (cartProducts.length === 0) {
    return (
      <div className="cart-container empty-cart">
        <h1>Your Cart is Empty</h1>
        <button onClick={() => router.push("/")}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>

      <div className="cart-content">
        <div className="cart-items">
          {cartProducts.map((product) => (
            <div className="cart-product" key={product.id}>
              <img src={product.image} alt={product.product_name} />

              <div className="cart-details">
                <h2>{product.product_name}</h2>

                {product.description && <p className="description">{product.description}</p>}

                <p>
                  <strong>Price:</strong> Rs. {product.price}
                </p>

                <p>
                  <strong>Quantity:</strong> {product.cart_quantity}
                </p>

                <p className="product-total">
                  <strong>Product Total:</strong> Rs.{" "}
                  {product.price * product.cart_quantity}
                </p>

                <button
                  className="delete-cart-btn"
                  onClick={() => deleteFromCart(product.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Total Products</span>
            <span>{cartProducts.length}</span>
          </div>

          <div className="summary-row">
            <span>Total Quantity</span>
            <span>{totalQuantity}</span>
          </div>

          <div className="summary-row total-price">
            <span>Total Price</span>
            <span>Rs. {totalPrice}</span>
          </div>

          <button className="checkout-btn" onClick={handleCheckout}>
            Checkout
          </button>

          <button
            className="continue-shopping-btn"
            onClick={() => router.push("/")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
