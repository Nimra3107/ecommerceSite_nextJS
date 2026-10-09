"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../components/AuthProvider";
import { getApiUrl } from "../../lib/api";

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId, ready, isLoggedIn } = useAuth();
  const API_URL = getApiUrl();

  useEffect(() => {
    if (!ready) {
      return;
    }

    const getOrders = async () => {
      if (!userId || isNaN(Number(userId))) {
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/orders/user/${userId}`);
        const data = await response.json();

        if (!response.ok) {
          console.log("Error:", data);
          setOrders([]);
          return;
        }

        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log("Unable to connect with server:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, [API_URL, ready, userId]);

  if (!ready || loading) {
    return <h2 className="orders-message">Loading orders...</h2>;
  }

  if (!isLoggedIn) {
    return (
      <h2 className="orders-message">Please login to see your orders.</h2>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-message">
        <h2>No orders yet</h2>
        <p>You have not placed any orders.</p>
      </div>
    );
  }

  return (
    <div className="my-orders">
      <h1>My Orders</h1>

      {orders.map((order) => (
        <div className="order-card" key={order.id}>
          <div className="order-header">
            <div>
              <h2>Order #{order.id}</h2>
              <p>Date: {order.created_at ? new Date(order.created_at).toLocaleDateString() : "N/A"}</p>
            </div>
            <span className="order-status">{order.status}</span>
          </div>

          <div className="customer-info">
            <p>
              <strong>Name:</strong> {order.customer_name}
            </p>
            <p>
              <strong>Phone:</strong> {order.phone}
            </p>
            <p>
              <strong>Address:</strong> {order.address}
            </p>
            <p>
              <strong>Payment:</strong> {order.payment_method}
            </p>
          </div>

          <div className="order-items">
            <h3>Products</h3>

            {(order.items || []).map((item) => (
              <div className="order-item" key={item.id}>
                <div>
                  <h4>{item.product_name}</h4>
                  <p>Quantity: {item.quantity}</p>
                </div>

                <div className="item-price">
                  <p>Rs. {item.price}</p>
                  <strong>Rs. {item.total_price}</strong>
                </div>
              </div>
            ))}
          </div>

          <div className="order-total">
            <strong>Total:</strong>
            <strong>Rs. {order.total_price}</strong>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyOrdersPage;
