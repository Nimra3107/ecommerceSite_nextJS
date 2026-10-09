"use client";

import React, { useEffect, useState } from "react";
import { getApiUrl } from "../lib/api";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // =========================
  // GET ALL ORDERS
  // =========================

  const API_URL = getApiUrl();

  const getOrders = async () => {
    try {
      const response = await fetch(
        `${API_URL}/admin/orders`
      );

      const data = await response.json();

      if (!response.ok) {
        console.log("Error:", data);
        return;
      }

      setOrders(data);
    } catch (error) {
      console.log("Unable to connect with server:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  // =========================
  // UPDATE ORDER STATUS
  // =========================

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);

    try {
      const response = await fetch(
        `${API_URL}/admin/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            status: newStatus
          })
        }
      );

      const data = await response.json();

      console.log("Status update response:", data);

      if (!response.ok) {
        alert(data.message || "Unable to update status");
        return;
      }

      setOrders((oldOrders) =>
        oldOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus
              }
            : order
        )
      );

      setSelectedOrder((oldOrder) => {
        if (!oldOrder || oldOrder.id !== orderId) {
          return oldOrder;
        }

        return {
          ...oldOrder,
          status: newStatus
        };
      });
    } catch (error) {
      console.log("Status update error:", error);
      alert("Unable to connect with server");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // =========================
  // SEARCH
  // =========================

  const filteredOrders = orders.filter((order) => {
    const searchText = search.toLowerCase();

    return (
      String(order.id).includes(searchText) ||
      order.customer_name
        ?.toLowerCase()
        .includes(searchText) ||
      order.phone
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  // =========================
  // ORDER COUNTS
  // =========================

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const processingOrders = orders.filter(
    (order) => order.status === "Processing"
  ).length;

  // const shippedOrders = orders.filter(
  //   (order) => order.status === "Shipped"
  // ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  // =========================
  // DATE FORMAT
  // =========================

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="admin-orders-page">
        <div className="admin-loading">
          Loading orders...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-orders-page">

      {/* TOP HEADER */}

      <header className="admin-topbar">

        <div>
          <p className="breadcrumb">
            Admin / Orders
          </p>

          <h1>
            Orders
          </h1>

          <p className="page-description">
            Manage and track customer orders.
          </p>
        </div>

        <div className="admin-profile">

          <div className="profile-avatar">
            A
          </div>

          <div className="profile-info">
            <strong>
              Admin
            </strong>

            <span>
              Administrator
            </span>
          </div>

        </div>

      </header>

      {/* SUMMARY CARDS */}

      <section className="summary-grid">

        <div className="summary-card">

          <div className="summary-card-top">
            <span>
              Total Orders
            </span>

            <div className="summary-icon total">
              #
            </div>
          </div>

          <strong>
            {orders.length}
          </strong>

          <p>
            All customer orders
          </p>

        </div>


        <div className="summary-card">

          <div className="summary-card-top">
            <span>
              Pending
            </span>

            <div className="summary-icon pending">
              !
            </div>
          </div>

          <strong>
            {pendingOrders}
          </strong>

          <p>
            Waiting for processing
          </p>

        </div>


        <div className="summary-card">

          <div className="summary-card-top">
            <span>
              Processing
            </span>

            <div className="summary-icon processing">
              ↻
            </div>
          </div>

          <strong>
            {processingOrders}
          </strong>

          <p>
            Currently processing
          </p>

        </div>


        <div className="summary-card">

          <div className="summary-card-top">
            <span>
              Delivered
            </span>

            <div className="summary-icon delivered">
              ✓
            </div>
          </div>

          <strong>
            {deliveredOrders}
          </strong>

          <p>
            Successfully delivered
          </p>

        </div>

      </section>

      {/* ORDERS TABLE */}

      <section className="orders-panel">

        <div className="orders-panel-header">

          <div>

            <h2>
              All Orders
            </h2>

            <p>
              {filteredOrders.length} orders found
            </p>

          </div>


          <div className="search-box">

            <span>
              /
            </span>

            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

        </div>


        {filteredOrders.length === 0 ? (

          <div className="empty-table">

            <h3>
              No orders found
            </h3>

            <p>
              Try searching with another order ID or customer name.
            </p>

          </div>

        ) : (

          <div className="table-wrapper">

            <table className="orders-table">

              <thead>

                <tr>

                  <th>
                    ORDER
                  </th>

                  <th>
                    CUSTOMER
                  </th>

                  <th>
                    DATE
                  </th>

                  <th>
                    ITEMS
                  </th>

                  <th>
                    TOTAL
                  </th>

                  <th>
                    STATUS
                  </th>

                  <th>
                    ACTION
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredOrders.map((order) => (

                  <tr key={order.id}>

                    <td>

                      <strong className="order-id">
                        #{order.id}
                      </strong>

                    </td>


                    <td>

                      <div className="customer-cell">

                        <div className="customer-avatar">

                          {order.customer_name
                            ?.charAt(0)
                            .toUpperCase()}

                        </div>

                        <div>

                          <strong>
                            {order.customer_name}
                          </strong>

                          <span>
                            {order.phone}
                          </span>

                        </div>

                      </div>

                    </td>


                    <td>
                      {formatDate(order.created_at)}
                    </td>


                    <td>
                      {order.items?.length || 0}
                    </td>


                    <td>

                      <strong>
                        Rs. {order.total_price}
                      </strong>

                    </td>


                    <td>

                      <span
                        className={`status-badge ${order.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {order.status}
                      </span>

                    </td>


                    <td>

                      <button
                        className="view-button"
                        onClick={() =>
                          setSelectedOrder(order)
                        }
                      >
                        View
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </section>


      {/* ORDER DETAILS OVERLAY */}

      {selectedOrder && (

        <div
          className="details-overlay"
          onClick={() =>
            setSelectedOrder(null)
          }
        >

          <div
            className="details-panel"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* DETAILS HEADER */}

            <div className="details-header">

              <div>

                <span>
                  ORDER DETAILS
                </span>

                <h2>
                  #{selectedOrder.id}
                </h2>

              </div>


              <button
                className="close-button"
                onClick={() =>
                  setSelectedOrder(null)
                }
              >
                ×
              </button>

            </div>


            {/* CUSTOMER */}

            <div className="details-section">

              <h3>
                Customer
              </h3>


              <div className="detail-customer">

                <div className="large-avatar">

                  {selectedOrder.customer_name
                    ?.charAt(0)
                    .toUpperCase()}

                </div>


                <div>

                  <strong>
                    {selectedOrder.customer_name}
                  </strong>

                  <span>
                    {selectedOrder.phone}
                  </span>

                </div>

              </div>


              <div className="detail-row">

                <span>
                  Address
                </span>

                <strong>
                  {selectedOrder.address}
                </strong>

              </div>


              <div className="detail-row">

                <span>
                  Payment
                </span>

                <strong>
                  {selectedOrder.payment_method}
                </strong>

              </div>


              <div className="detail-row">

                <span>
                  Order Date
                </span>

                <strong>
                  {formatDate(
                    selectedOrder.created_at
                  )}
                </strong>

              </div>

            </div>


            {/* PRODUCTS */}

            <div className="details-section">

              <h3>
                Products
              </h3>


              <div className="detail-products">

                {selectedOrder.items?.map((item) => (

                  <div
                    className="detail-product"
                    key={item.id}
                  >

                    <div>

                      <strong>
                        {item.product_name}
                      </strong>

                      <span>
                        {item.quantity} × Rs.{" "}
                        {item.price}
                      </span>

                    </div>


                    <strong>
                      Rs. {item.total_price}
                    </strong>

                  </div>

                ))}

              </div>

            </div>


            {/* TOTAL */}

            <div className="detail-total">

              <span>
                Total
              </span>

              <strong>
                Rs. {selectedOrder.total_price}
              </strong>

            </div>


            {/* STATUS */}

            <div className="details-status">

              <label>
                Update Order Status
              </label>


              <select
                value={selectedOrder.status}
                disabled={
                  updatingOrderId === selectedOrder.id
                }
                onChange={(e) =>
                  updateOrderStatus(
                    selectedOrder.id,
                    e.target.value
                  )
                }
              >

                <option value="Pending">
                  Pending
                </option>

                <option value="Processing">
                  Processing
                </option>

                <option value="Shipped">
                  Shipped
                </option>

                <option value="Delivered">
                  Delivered
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>

              </select>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminOrders;