"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clearAdminLoggedIn } from "../lib/auth";

function AdminSidebar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleAdminLogout = () => {
    clearAdminLoggedIn();
    window.location.href = "/admin-login";
  };

  const linkClass = (href) =>
    `admin-nav-link${pathname === href ? " active" : ""}`;

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}

      {!menuOpen && (
        <button
          className="mobile-menu-button"
          onClick={() => setMenuOpen(true)}
        >
          ☰
        </button>
      )}


      {/* Overlay */}

      {menuOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeMenu}
        ></div>
      )}


      {/* Sidebar */}

      <aside
        className={`admin-sidebar ${
          menuOpen ? "mobile-open" : ""
        }`}
      >

        {/* Sidebar Header */}

        <div className="admin-sidebar-header">

          <div className="admin-logo">
            Admin Panel
          </div>

          {/* Close Button */}

          {menuOpen && (
            <button
              className="mobile-close-button"
              onClick={closeMenu}
            >
              ×
            </button>
          )}

        </div>


        {/* Navigation */}

        <nav className="admin-nav">

          <Link
            href="/admin"
            className={linkClass("/admin")}
            onClick={closeMenu}
          >
            Dashboard
          </Link>

          <Link
            href="/admin/products"
            className={linkClass("/admin/products")}
            onClick={closeMenu}
          >
            Products
          </Link>

          <Link
            href="/admin/orders"
            className={linkClass("/admin/orders")}
            onClick={closeMenu}
          >
            Orders
          </Link>

        </nav>


        {/* Logout */}

        <button
          className="admin-logout"
          onClick={handleAdminLogout}
        >
          Logout
        </button>

      </aside>
    </>
  );
}

export default AdminSidebar;
