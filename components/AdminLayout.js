"use client";

import React from "react";
import AdminSidebar from "./AdminSidebar";

function AdminLayout({ children }) {
  return (
    <div className="admin-layout">

      <AdminSidebar />

      <main className="admin-main-content">
        {children}
      </main>

    </div>
  );
}

export default AdminLayout;