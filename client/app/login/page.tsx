
"use client"

import React, { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { ZorvynLogo } from "@/components/zorvyn-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isLogin) {
        await login(form.email, form.password)
        toast.success("Welcome back!")
      } else {
        await register(form.name, form.email, form.password)
        toast.success("Successfully registered! You're logged in.")
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0a] text-[#e5e2e1] selection:bg-[#86efac]/30 selection:text-[#86efac]">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[15%] w-96 h-96 bg-[#86efac]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-[#86efac]/5 rounded-full blur-[150px]"></div>
      </div>

      <div className="relative w-full max-w-md z-10">
        <div className="bg-[#111111]/80 backdrop-blur-3xl p-10 border border-white/5 rounded-2xl shadow-2xl">
          <header className="flex flex-col items-center mb-10">
            <div className="mb-6 relative">
              <ZorvynLogo className="h-10 w-10 text-[#86efac]" />
              <div className="absolute inset-0 bg-[#86efac]/20 blur-xl rounded-full"></div>
            </div>
            <h1 className="text-2xl font-bold tracking-[0.3em] uppercase text-[#e5e2e1]">ZORVYN</h1>
            <p className="text-[0.6875rem] text-[#919191] tracking-[0.2em] uppercase mt-2">Luminescent Vault</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[0.6875rem] text-[#919191] tracking-[0.2em] uppercase">Identity Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="YOUR NAME"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="bg-transparent border-0 border-b border-[#222222] rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#86efac] transition-all duration-500 placeholder:text-[#919191]/30"
                  required={!isLogin}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[0.6875rem] text-[#919191] tracking-[0.2em] uppercase">Soul Signature</Label>
              <Input
                id="email"
                type="email"
                placeholder="EMAIL ADDRESS"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="bg-transparent border-0 border-b border-[#222222] rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#86efac] transition-all duration-500 placeholder:text-[#919191]/30"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[0.6875rem] text-[#919191] tracking-[0.2em] uppercase">Ethereal Key</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="bg-transparent border-0 border-b border-[#222222] rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#86efac] transition-all duration-500 placeholder:text-[#919191]/30"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#86efac]/10 hover:bg-[#86efac]/20 text-[#86efac] border border-[#86efac]/30 py-6 text-[0.75rem] uppercase tracking-[0.2em] font-bold mt-4"
            >
              {loading ? "Initializing..." : isLogin ? "Evoke Passage" : "Forge Identity"}
            </Button>

            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-[0.625rem] text-[#919191] tracking-[0.2em] uppercase hover:text-[#86efac] transition-colors"
              >
                {isLogin ? "New seeker? Manifest Identity" : "Returning entity? Recall Access"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
