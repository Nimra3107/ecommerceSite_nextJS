"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthProvider";
import { getApiUrl } from "../../lib/api";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login } = useAuth();
  const API_URL = getApiUrl();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.id) {
        alert(data.detail || data.message || "Invalid email or password");
        return;
      }

      login(data.id);
      router.push("/");
    } catch (error) {
      console.log("Login error:", error);
      alert("Unable to connect to server");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h1>Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>

        <p>
          Don&apos;t have an account?{" "}
          <span onClick={() => router.push("/register")}>Register</span>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
