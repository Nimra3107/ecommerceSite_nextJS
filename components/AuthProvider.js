"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  USER_ID_KEY,
  clearLoggedInUserId,
  getLoggedInUserId,
  setLoggedInUserId,
} from "../lib/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUserId(getLoggedInUserId());
    setReady(true);
  }, []);

  useEffect(() => {
    const syncAuth = (event) => {
      if (event.key === USER_ID_KEY) {
        const val = event.newValue;
        if (!val || val === "null" || val === "undefined" || val === "NaN" || val.trim() === "") {
          setUserId(null);
        } else {
          setUserId(val);
        }
      }
    };

    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  const login = (id) => {
    if (!id || String(id) === "null" || String(id) === "undefined" || String(id) === "NaN") {
      return;
    }
    setLoggedInUserId(id);
    setUserId(String(id));
  };

  const logout = () => {
    clearLoggedInUserId();
    setUserId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        userId,
        ready,
        login,
        logout,
        isLoggedIn: Boolean(userId),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
