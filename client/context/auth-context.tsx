
"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { apiFetch } from "@/lib/api"
import { useRouter } from "next/navigation"

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const refreshUser = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) {
        setUser(null)
        setLoading(false)
        return
    }

    try {
      const data = await apiFetch<{ user: User }>("/users/me")
      setUser(data.user)
    } catch (err) {
      console.error("Auth check failed:", err)
      localStorage.removeItem("token")
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = async (email: string, password: string) => {
    const data = await apiFetch<{ token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
    
    if (data.token) {
      localStorage.setItem("token", data.token)
      await refreshUser()
      router.push("/dashboard")
    }
  }

  const register = async (name: string, email: string, password: string) => {
    const data = await apiFetch<{ token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    })

    if (data.token) {
      localStorage.setItem("token", data.token)
      await refreshUser()
      router.push("/dashboard")
    }
  }

  const logout = async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" })
    } catch (err) {
      console.warn("Logout error:", err)
    } finally {
      localStorage.removeItem("token")
      setUser(null)
      router.push("/login")
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
