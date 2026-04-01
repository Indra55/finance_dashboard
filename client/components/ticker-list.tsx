"use client"

import { useEffect, useState } from "react"
import { ArrowUp, ArrowDown, ChevronsUpDown, MoreHorizontal } from 'lucide-react'
import { apiFetch } from "@/lib/api"
import { format } from "date-fns"
import Link from "next/link"

interface Record {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
}

export function TickerList() {
  const [records, setRecords] = useState<Record[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecentActivity() {
      try {
        const data = await apiFetch<{ recentActivity: Record[] }>("/dashboard/recent")
        setRecords(data.recentActivity)
      } catch (err) {
        console.error("Failed to fetch records:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchRecentActivity()
  }, [])

  if (loading) {
    return <div className="h-64 bg-[#0D0D0D] rounded-2xl animate-pulse" />
  }

  return (
    <div className="bg-[#0D0D0D] rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">Recent Artifacts</h3>
        <Link 
          href="/dashboard/records"
          className="text-[#919191] hover:text-[#86efac] transition-colors text-[10px] uppercase tracking-widest font-bold flex items-center gap-2"
        >
          View Full Ledger <MoreHorizontal className="h-4 w-4" />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-[#919191] text-xs uppercase tracking-widest border-b border-[#222222]">
              <th className="pb-4 text-left font-medium pl-2">Description</th>
              <th className="pb-4 text-left font-medium">Category</th>
              <th className="pb-4 text-right font-medium">Date</th>
              <th className="pb-4 text-right font-medium pr-2">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222222]/30">
            {records.map((record) => (
              <tr 
                key={record.id} 
                className="group hover:bg-[#1A1A1A] transition-colors"
              >
                <td className="py-4 pl-2 rounded-l-xl">
                  <div className="flex flex-col">
                    <span className="font-medium text-white group-hover:text-[#86efac] transition-colors">
                      {record.description || record.category}
                    </span>
                  </div>
                </td>
                <td className="py-4">
                  <span className="px-2 py-1 rounded-full bg-[#1A1A1A] text-[10px] text-[#919191] uppercase tracking-wider border border-white/5">
                    {record.category}
                  </span>
                </td>
                <td className="py-4 text-right text-[#919191] text-sm font-mono">
                  {format(new Date(record.date), 'MMM dd, yyyy')}
                </td>
                <td className={`py-4 text-right font-bold pr-2 rounded-r-xl ${record.type === 'income' ? 'text-[#86efac]' : 'text-red-400'}`}>
                  <div className="flex items-center justify-end gap-1">
                    {record.type === 'income' ? '+' : '-'}
                    ${Number(record.amount).toLocaleString()}
                  </div>
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan={4} className="py-12 text-center text-[#919191] italic text-xs uppercase tracking-[0.2em]">
                  No artifacts found in the vault.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
