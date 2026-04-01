"use client"

import { DashboardMetrics } from "@/components/dashboard-metrics"
import { PerformanceChart } from "@/components/performance-chart"
import { TickerList } from "@/components/ticker-list"

export default function Dashboard() {
  return (
    <>
      <DashboardMetrics />
      <div className="grid grid-cols-1 gap-6">
        <PerformanceChart />
        <TickerList />
      </div>
    </>
  )
}
