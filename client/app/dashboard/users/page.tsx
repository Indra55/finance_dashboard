"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/context/auth-context"
import { apiFetch } from "@/lib/api"
import { toast } from "sonner"
import { ShieldCheck, UserCog, Ban } from 'lucide-react'
import { format } from "date-fns"
import { useRouter } from "next/navigation"

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'analyst' | 'viewer';
  status: 'active' | 'inactive';
  created_at: string;
}

export default function UsersPage() {
  const { user, loading: authLoading } = useAuth()
  const [users, setUsers] = useState<UserRecord[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const loadUsers = useCallback(async () => {
    try {
      const data = await apiFetch<{ users: UserRecord[] }>("/users")
      setUsers(data.users || [])
    } catch (err: any) {
      toast.error(err.message || "Failed to load entities")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'admin') {
        router.push("/dashboard")
        return
      }
      loadUsers()
    }
  }, [authLoading, user, loadUsers, router])

  const handleUpdateRole = async (id: string, newRole: string) => {
    try {
      await apiFetch(`/users/${id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: newRole }),
      })
      toast.success("Identity role mutated")
      loadUsers()
    } catch (err: any) {
      toast.error(err.message || "Mutation failed")
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await apiFetch(`/users/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      })
      toast.success(`Identity ${newStatus === 'active' ? 'authorized' : 'restricted'}`)
      loadUsers()
    } catch (err: any) {
      toast.error(err.message || "Status shift failed")
    }
  }

  if (authLoading || !user || user.role !== 'admin') return null

  return (
    <>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#e5e2e1]">Identity Registry</h1>
          <p className="mt-2 text-[#919191] text-[10px] md:text-xs uppercase tracking-[0.2em]">High-Level Custodian Management</p>
        </div>
      </header>

      <div className="bg-[#0D0D0D] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="text-[#919191] text-[10px] uppercase tracking-[0.3em] border-b border-[#222222]">
                <th className="pb-6 pt-6 pl-6 font-medium">Manifest Date</th>
                <th className="pb-6 pt-6 font-medium">Soul Signature</th>
                <th className="pb-6 pt-6 font-medium">Clearance Level</th>
                <th className="pb-6 pt-6 font-medium">Status</th>
                <th className="pb-6 pt-6 text-right font-medium pr-6">Mutate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]/30">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="py-8 px-6 text-center text-xs opacity-20">Scanning registry...</td>
                  </tr>
                ))
              ) : users.map((u) => (
                <tr key={u.id} className="group hover:bg-[#1A1A1A]/50 transition-all duration-300">
                  <td className="py-6 pl-6 text-[11px] font-mono text-[#919191]">
                    {format(new Date(u.created_at), 'yyyy-MM-dd')}
                  </td>
                  <td className="py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#e5e2e1] group-hover:text-[#86efac] transition-colors uppercase tracking-tight">
                        {u.name}
                      </span>
                      <span className="text-[10px] text-[#666]">{u.email}</span>
                    </div>
                  </td>
                  <td className="py-6">
                    <select 
                      value={u.role}
                      disabled={u.id === user?.id}
                      onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                      className="bg-transparent border border-white/10 rounded px-2 py-1 text-[9px] uppercase font-bold tracking-widest text-[#86efac] focus:border-[#86efac] outline-none disabled:opacity-50 cursor-pointer"
                    >
                      <option value="viewer" className="bg-[#0D0D0D]">Viewer</option>
                      <option value="analyst" className="bg-[#0D0D0D]">Analyst</option>
                      <option value="admin" className="bg-[#0D0D0D]">Admin</option>
                    </select>
                  </td>
                  <td className="py-6">
                    <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-widest border ${
                      u.status === 'active' 
                        ? 'bg-[#86efac]/5 text-[#86efac] border-[#86efac]/20' 
                        : 'bg-red-400/5 text-red-400 border-red-400/20'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-6 text-right pr-6">
                    {u.id !== user?.id && (
                      <button 
                        onClick={() => handleUpdateStatus(u.id, u.status === 'active' ? 'inactive' : 'active')}
                        className={`p-2 transition-colors ${u.status === 'active' ? 'text-[#919191] hover:text-red-400' : 'text-red-400 hover:text-[#86efac]'}`}
                        title={u.status === 'active' ? 'Restrict Access' : 'Authorize Identity'}
                      >
                        {u.status === 'active' ? <Ban className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
