"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthProvider";
import { getApiUrl } from "../../lib/api";

function CheckoutPage() {
  const [cartProducts, setCartProducts] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const { userId, ready, isLoggedIn } = useAuth();
  const API_URL = getApiUrl();

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (!userId || isNaN(Number(userId))) {
      setLoading(false);
      router.push("/login");
      return;
    }

    const getCart = async () => {
      try {
        const response = await fetch(`${API_URL}/cart/${userId}`);
        const data = await response.json();

        if (!response.ok) {
          setCartProducts([]);
          return;
        }

        setCartProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log("Get checkout cart error:", error);
        setCartProducts([]);
      } finally {
        setLoading(false);
      }
    };

    getCart();
  }, [API_URL, ready, router, userId]);

  const totalPrice = cartProducts.reduce((total, product) => {
    return total + product.price * product.cart_quantity;
  }, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!userId || isNaN(Number(userId))) {
      alert("Please login first");
      router.push("/login");
      return;
    }

    if (cartProducts.length === 0) {
      alert("Your cart is empty");
      router.push("/cart");
      return;
    }

    const orderItems = cartProducts.map((product) => ({
      product_id: product.product_id,
      product_name: product.product_name,
      price: Number(product.price),
      quantity: Number(product.cart_quantity),
      total_price: Number(product.price) * Number(product.cart_quantity),
    }));

    const orderData = {
      user_id: Number(userId),
      customer_name: name.trim(),
      address: address.trim(),
      phone: phone.trim(),
      payment_method: paymentMethod,
      total_price: Number(totalPrice),
      items: orderItems,
    };

    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok || data.message !== "Order placed successfully") {
        alert(data.detail || data.message || "Order failed");
        return;
      }

      setCartProducts([]);
      alert("Order placed successfully!");
      router.push("/my-orders");
    } catch (error) {
      console.log("Order error:", error);
      alert("Unable to connect to server");
    } finally {
      setSubmitting(false);
    }
  };

  if (!ready || loading) {
    return (
      <div className="checkout-container">
        <div className="checkout-box">
          <h1>Loading checkout...</h1>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="checkout-container">
        <div className="checkout-box">
          <h1>Please login to checkout</h1>
        </div>
      </div>
    );
  }

  if (cartProducts.length === 0) {
    return (
      <div className="checkout-container">
        <div className="checkout-box">
          <h1>Your cart is empty</h1>
          <p style={{ margin: "20px 0" }}>Please add some products to your cart before checking out.</p>
          <button type="button" className="place-order-btn" onClick={() => router.push("/")}>
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-box">
        <h1>Checkout</h1>

        <h2>Order Summary</h2>

        {cartProducts.map((product) => (
          <div className="checkout-product" key={product.id}>
            <p>
              <strong>{product.product_name}</strong>
            </p>

            <p>Quantity: {product.cart_quantity}</p>

            <p>Price: Rs. {product.price * product.cart_quantity}</p>
          </div>
        ))}

        <h2>Total: Rs. {totalPrice}</h2>

        <form onSubmit={handlePlaceOrder}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="Card">Card</option>
            </select>
          </div>

          <button type="submit" className="place-order-btn" disabled={submitting}>
            Place Order
          </button>

          <button
            type="button"
            className="back-btn"
            onClick={() => router.push("/cart")}
          >
            Back to Cart
          </button>
        </form>
      </div>
    </div>
  );
}

export default CheckoutPage;
