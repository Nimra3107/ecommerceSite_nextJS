"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthProvider";
import { getApiUrl } from "../../lib/api";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login } = useAuth();
  const API_URL = getApiUrl();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.id) {
        alert(data.detail || "Registration failed");
        return;
      }

      login(data.id);
      router.push("/");
    } catch (error) {
      console.log("Register error:", error);
      alert("Unable to connect to server");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleRegister}>
        <h1>Register</h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

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

        <button type="submit">Register</button>

        <p>
          Already have an account?{" "}
          <span onClick={() => router.push("/login")}>Login</span>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
