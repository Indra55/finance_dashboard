"use client"

import { useEffect, useState } from "react"
import { Calendar, Download } from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { apiFetch } from "@/lib/api"

interface TrendData {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

export function PerformanceChart() {
  const [trends, setTrends] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTrends() {
      try {
        const data = await apiFetch<{ trends: any[] }>("/dashboard/trends")
        if (!data || !data.trends) {
            setTrends([]);
            return;
        }
        // Map server response to what Recharts expects: month -> date, net -> total
        const mappedData = data.trends.map(t => ({
            date: t.month,
            total: typeof t.net === 'string' ? parseFloat(t.net) : t.net
        }))
        setTrends(mappedData)
      } catch (err) {
        console.error("Failed to fetch trends:", err)
        setTrends([]);
      } finally {
        setLoading(false)
      }
    }
    fetchTrends()
  }, [])

  if (loading) {
    return <div className="h-[400px] bg-[#0D0D0D] rounded-2xl animate-pulse" />
  }

  return (
    <div className="flex flex-col gap-6 p-6 bg-[#0D0D0D] rounded-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 md:gap-2 lg:gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-medium text-white">Vault Velocity</h2>
          <div className="flex items-center gap-2 px-3 py-1 bg-[#1A1A1A] rounded-full border border-[#333]">
            <div className="w-4 h-4 rounded-full bg-[#86efac] flex items-center justify-center">
              <span className="text-[10px] font-bold text-black">V</span>
            </div>
            <span className="text-sm font-medium text-white">TOTAL VALUE</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 md:gap-2 lg:gap-4">
          <div className="flex items-center bg-[#1A1A1A] rounded-lg p-1">
            {['1D', '1M', '3M', '6M', '1Y'].map((period) => (
              <button
                key={period}
                className={`px-3 md:px-2 lg:px-3 py-1 text-sm md:text-xs lg:text-sm rounded-md transition-colors ${
                  period === '1M' 
                    ? 'bg-[#2A2A2A] text-white shadow-sm' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trends}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#86efac" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#86efac" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" vertical={false} />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#666', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              orientation="left" 
              tick={{ fill: '#666', fontSize: 10 }} 
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', color: '#fff' }}
              itemStyle={{ color: '#86efac' }}
              formatter={(value: any) => [`$${value}`, 'Total']}
            />
            
            <Area 
              type="monotone" 
              dataKey="total" 
              stroke="#86efac" 
              strokeWidth={2} 
              fillOpacity={1} 
              fill="url(#colorTotal)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

