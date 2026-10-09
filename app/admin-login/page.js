"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setAdminLoggedIn } from "../../lib/auth";

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const ADMIN_EMAIL = "admin@gmail.com";
  const ADMIN_PASSWORD = "admin123";

  const handleAdminLogin = (e) => {
    e.preventDefault();

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setAdminLoggedIn();
      router.push("/admin/orders");
    } else {
      alert("Invalid admin email or password");
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h1>Admin Login</h1>

        <form onSubmit={handleAdminLogin}>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Admin Login</button>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginPage;
