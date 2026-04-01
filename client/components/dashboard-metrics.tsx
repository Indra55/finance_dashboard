"use client"

import { useEffect, useState } from "react"
import { Wallet } from 'lucide-react'
import { apiFetch } from "@/lib/api"

interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  totalRecords: number;
}

export function DashboardMetrics() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSummary() {
      try {
        const data = await apiFetch<{ summary: DashboardSummary }>("/dashboard/summary")
        setSummary(data.summary)
      } catch (err) {
        console.error("Failed to fetch summary:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchSummary()
  }, [])

  if (loading) {
    return <div className="h-40 bg-[#0D0D0D] rounded-2xl animate-pulse" />
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="flex flex-col xl:flex-row gap-8 xl:items-center justify-between p-6 bg-[#0D0D0D] rounded-2xl">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-gray-400">
          <Wallet className="h-5 w-5" />
          <span className="text-lg">Current Balance</span>
        </div>
        <div className="text-5xl md:text-4xl lg:text-5xl font-bold text-white">
          {summary ? formatCurrency(summary.netBalance) : "$0"}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 xl:gap-16">
        <div className="flex flex-col gap-1">
          <span className="text-gray-400 text-sm">Total Income</span>
          <span className="text-2xl md:text-xl lg:text-2xl font-semibold text-[#86efac]">
            {summary ? formatCurrency(summary.totalIncome) : "$0"}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-gray-400 text-sm">Total Expenses</span>
          <span className="text-2xl md:text-xl lg:text-2xl font-semibold text-red-400">
            {summary ? formatCurrency(summary.totalExpenses) : "$0"}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-gray-400 text-sm">Records</span>
          <span className="text-2xl md:text-xl lg:text-2xl font-semibold text-white">
            {summary?.totalRecords || 0}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-gray-400 text-sm">Net Savings</span>
          <span className="text-2xl md:text-xl lg:text-2xl font-semibold text-[#86efac]">
            {summary ? formatCurrency(summary.netBalance) : "$0"}
          </span>
        </div>
      </div>
    </div>
  )
}
