
import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const data = await apiFetch<{ user: User }>("/users/me");
      setUser(data.user);
    } catch (err) {
      console.error("Auth check failed:", err);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setLoading(false);
      return;
    }
    fetchProfile();
  }, [fetchProfile]);

  const login = async (email: string, password: string) => {
    const data = await apiFetch<{ token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    
    await fetchProfile();
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await apiFetch<{ token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    if (data.token) {
      localStorage.setItem("token", data.token);
      await fetchProfile();
    }
  };

  const logout = async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  return { user, loading, login, register, logout };
}
