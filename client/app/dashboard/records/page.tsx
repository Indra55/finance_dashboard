
"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/context/auth-context"
import { apiFetch } from "@/lib/api"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Plus, Trash2, Edit2, X, Filter, Download } from 'lucide-react'
import { format } from "date-fns"

interface Record {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
}

export default function RecordsPage() {
  const { user, loading: authLoading } = useAuth()
  const [records, setRecords] = useState<Record[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<Record | null>(null)
  const [form, setForm] = useState({
    amount: "",
    type: "income" as "income" | "expense",
    category: "",
    description: "",
    date: format(new Date(), "yyyy-MM-dd"),
  })

  const loadRecords = useCallback(async () => {
    try {
      const data = await apiFetch<{ records: Record[] }>("/records")
      setRecords(data.records || [])
    } catch (err: any) {
      toast.error(err.message || "Failed to load records")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!authLoading && user) {
      loadRecords()
    }
  }, [authLoading, user, loadRecords])

  const openModal = (record: Record | null = null) => {
    if (record) {
      setEditingRecord(record)
      setForm({
        amount: record.amount.toString(),
        type: record.type,
        category: record.category,
        description: record.description || "",
        date: record.date.split("T")[0],
      })
    } else {
      setEditingRecord(null)
      setForm({
        amount: "",
        type: "income",
        category: "",
        description: "",
        date: format(new Date(), "yyyy-MM-dd"),
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingRecord(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        ...form,
        amount: parseFloat(form.amount),
      }

      if (editingRecord) {
        await apiFetch(`/records/${editingRecord.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        })
        toast.success("Record updated successfully")
      } else {
        await apiFetch("/records", {
          method: "POST",
          body: JSON.stringify(payload),
        })
        toast.success("Record created successfully")
      }
      closeModal()
      loadRecords()
    } catch (err: any) {
      toast.error(err.message || "Failed to save record")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return
    try {
      await apiFetch(`/records/${id}`, { method: "DELETE" })
      toast.success("Record deleted")
      loadRecords()
    } catch (err: any) {
      toast.error(err.message || "Failed to delete record")
    }
  }

  if (authLoading) return null

  return (
    <div className="relative h-screen w-full bg-black text-white overflow-hidden">
      <Header />
      
      <div className="h-full overflow-y-auto no-scrollbar">
        <main className="flex gap-6 p-6 pt-24 min-h-full">
          <Sidebar />

          <div className="flex-1 flex flex-col gap-8 min-w-0">
            <header className="flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-[#e5e2e1]">Luminescent Records</h1>
                <p className="mt-2 text-[#919191] text-xs uppercase tracking-[0.2em]">Historical Financial Flow Analysis</p>
              </div>
              
              <div className="flex gap-4">
                {(user?.role === 'admin' || user?.role === 'analyst') && (
                  <Button onClick={() => openModal()} className="bg-[#86efac]/10 hover:bg-[#86efac]/20 text-[#86efac] border border-[#86efac]/30 uppercase tracking-widest text-[10px] h-11 px-6">
                    <Plus className="mr-2 h-4 w-4" /> Manifest New
                  </Button>
                )}
                <Button variant="outline" size="icon" className="border-[#222] bg-[#111] text-[#919191] hover:text-white">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="border-[#222] bg-[#111] text-[#919191] hover:text-white">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </header>

            <div className="bg-[#0D0D0D] rounded-2xl p-6 border border-white/5">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-[#919191] text-[10px] uppercase tracking-[0.3em] border-b border-[#222222]">
                      <th className="pb-6 text-left font-medium pl-4">Origin Date</th>
                      <th className="pb-6 text-left font-medium">Entity / Category</th>
                      <th className="pb-6 text-left font-medium">Description</th>
                      <th className="pb-6 text-left font-medium">Classification</th>
                      <th className="pb-6 text-right font-medium">Magnitude</th>
                      <th className="pb-6 text-right font-medium pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222222]/30">
                    {loading ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td colSpan={6} className="py-8 px-4 h-16 bg-[#1A1A1A]/20 rounded-lg mb-2" />
                        </tr>
                      ))
                    ) : records.map((record) => (
                      <tr key={record.id} className="group hover:bg-[#1A1A1A]/50 transition-all duration-300">
                        <td className="py-6 pl-4 text-sm font-mono text-[#919191]">
                          {format(new Date(record.date), 'yyyy-MM-dd')}
                        </td>
                        <td className="py-6">
                          <span className="text-lg font-medium text-[#e5e2e1] group-hover:text-[#86efac] transition-colors uppercase tracking-tight">
                            {record.category}
                          </span>
                        </td>
                        <td className="py-6 text-sm text-[#919191] max-w-[200px] truncate">
                          {record.description || "—"}
                        </td>
                        <td className="py-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest border ${
                            record.type === 'income' 
                              ? 'bg-[#86efac]/5 text-[#86efac] border-[#86efac]/20' 
                              : 'bg-red-400/5 text-red-400 border-red-400/20'
                          }`}>
                            {record.type}
                          </span>
                        </td>
                        <td className={`py-6 text-right font-bold text-lg ${
                          record.type === 'income' ? 'text-[#86efac]' : 'text-red-400'
                        }`}>
                          {record.type === 'income' ? '+' : '-'}${Number(record.amount).toLocaleString()}
                        </td>
                        <td className="py-6 text-right pr-4">
                          <div className="flex justify-end gap-2">
                            {(user?.role === 'admin' || user?.role === 'analyst') && (
                              <button onClick={() => openModal(record)} className="p-2 text-[#919191] hover:text-[#86efac] transition-colors">
                                <Edit2 className="h-4 w-4" />
                              </button>
                            )}
                            {user?.role === 'admin' && (
                              <button onClick={() => handleDelete(record.id)} className="p-2 text-[#919191] hover:text-red-400 transition-colors">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {!loading && records.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-20 text-center text-[#919191] uppercase tracking-[0.2em] text-sm italic">
                          No historical artifacts detected in the bank.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal / Sidebar for adding/editing */}
      <div className={`fixed inset-0 z-[100] transition-opacity duration-500 ${isModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
        <div className={`absolute top-0 right-0 h-screen w-full max-w-md bg-[#0D0D0D] border-l border-white/5 p-10 transform transition-transform duration-500 ease-out ${isModalOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-2xl font-bold uppercase tracking-widest text-[#e5e2e1]">
                {editingRecord ? 'Modify Artifact' : 'Manifest New'}
              </h2>
              <p className="text-[10px] text-[#919191] uppercase mt-2 tracking-widest">Commitment to Ledger</p>
            </div>
            <button onClick={closeModal} className="text-[#919191] hover:text-white transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <Label className="text-[10px] text-[#919191] uppercase tracking-[0.2em]">Category</Label>
              <Input 
                value={form.category}
                onChange={e => setForm({...form, category: e.target.value})}
                className="bg-transparent border-0 border-b border-[#222] rounded-none px-0 h-12 text-lg focus-visible:ring-0 focus-visible:border-[#86efac] transition-all placeholder:text-[#333]"
                placeholder="RECIPIENT / ORIGIN"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] text-[#919191] uppercase tracking-[0.2em]">Magnitude (USD)</Label>
              <Input 
                type="number"
                step="0.01"
                value={form.amount}
                onChange={e => setForm({...form, amount: e.target.value})}
                className="bg-transparent border-0 border-b border-[#222] rounded-none px-0 h-16 text-4xl font-bold focus-visible:ring-0 focus-visible:border-[#86efac] transition-all placeholder:text-[#333]"
                placeholder="0.00"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-[10px] text-[#919191] uppercase tracking-[0.2em]">Classification</Label>
                <select 
                  className="w-full bg-transparent border-0 border-b border-[#222] rounded-none py-3 text-sm uppercase tracking-widest focus:ring-0 focus:border-[#86efac] appearance-none cursor-pointer"
                  value={form.type}
                  onChange={e => setForm({...form, type: e.target.value as "income" | "expense"})}
                >
                  <option value="income" className="bg-[#0D0D0D] text-[#86efac]">Income</option>
                  <option value="expense" className="bg-[#0D0D0D] text-red-400">Expense</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] text-[#919191] uppercase tracking-[0.2em]">Occurrence Date</Label>
                <Input 
                  type="date"
                  value={form.date}
                  onChange={e => setForm({...form, date: e.target.value})}
                  className="bg-transparent border-0 border-b border-[#222] rounded-none px-0 py-3 text-sm focus-visible:ring-0 focus-visible:border-[#86efac] transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] text-[#919191] uppercase tracking-[0.2em]">Narrative Notes</Label>
              <textarea 
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
                className="w-full bg-transparent border-b border-[#222] focus:border-[#86efac] transition-all py-3 text-sm focus:ring-0 resize-none min-h-[100px] placeholder:text-[#333]"
                placeholder="APPEND ETHEREAL NOTES..."
              />
            </div>

            <Button type="submit" className="w-full h-14 bg-[#86efac] text-black font-bold uppercase tracking-[0.3em] hover:bg-[#86efac]/90 transition-all shadow-[0_0_20px_rgba(134,239,172,0.2)]">
              Commit to Vault
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
