"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="navbar">
      <h2>My Ecommerce</h2>

      <div className="nav-links">
        <Link href="/">Products</Link>
        <Link href="/my-orders">My Orders</Link>
        <Link href="/cart">Cart</Link>

        {isLoggedIn ? (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
