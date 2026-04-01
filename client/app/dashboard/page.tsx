"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { DashboardMetrics } from "@/components/dashboard-metrics"
import { PerformanceChart } from "@/components/performance-chart"
import { TickerList } from "@/components/ticker-list"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#86efac]/30 border-t-[#86efac] rounded-full animate-spin" />
          <p className="text-[#86efac] text-xs uppercase tracking-[0.3em] font-medium">Validating Identity...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-screen w-full bg-black text-white overflow-hidden">
      <Header />

      {/* Main Scrollable Area */}
      <div className="h-full overflow-y-auto no-scrollbar">
        <main className="flex gap-6 p-6 pt-24 min-h-full">
          <Sidebar />

          {/* Main Content Container */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            <DashboardMetrics />
            <PerformanceChart />
            <TickerList />
            
            {/* Status Indicator */}
            <div className="flex items-center justify-end gap-2 mt-4">
              <div className="w-[13px] h-[13px] rounded-full bg-[#86efac]" />
              <span className="text-sm text-[#919191]">Safe Connection Established</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
