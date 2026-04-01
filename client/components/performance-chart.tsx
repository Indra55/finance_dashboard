"use client"

import { useEffect, useState, useCallback } from "react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { apiFetch } from "@/lib/api"

export function PerformanceChart() {
  const [trends, setTrends] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('1M')

  const fetchTrends = useCallback(async (selectedPeriod: string) => {
    setLoading(true)
    try {
      const data = await apiFetch<{ trends: any[] }>(`/dashboard/trends?period=${selectedPeriod}`)
      if (!data || !data.trends) {
        setTrends([])
        return
      }
      
      const mappedData = data.trends.map(t => ({
        date: t.month,
        total: typeof t.net === 'string' ? parseFloat(t.net) : t.net
      }))
      setTrends(mappedData)
    } catch (err) {
      console.error("Failed to fetch trends:", err)
      setTrends([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTrends(period)
  }, [period, fetchTrends])

  return (
    <div className="flex flex-col gap-6 p-6 bg-[#0D0D0D] rounded-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-medium text-white">Vault Velocity</h2>
          <div className="flex items-center gap-2 px-3 py-1 bg-[#1A1A1A] rounded-full border border-[#333]">
            <div className="w-4 h-4 rounded-full bg-[#86efac] flex items-center justify-center">
              <span className="text-[10px] font-bold text-black">V</span>
            </div>
            <span className="text-sm font-medium text-white">TOTAL VALUE</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-[#1A1A1A] rounded-lg p-1">
            {['1D', '1M', '3M', '6M', '1Y'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-sm rounded-md transition-all duration-300 ${
                  period === p 
                    ? 'bg-[#86efac] text-black shadow-sm font-bold' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-[400px] w-full">
        {loading ? (
          <div className="h-full w-full flex items-center justify-center bg-[#111]/50 rounded-xl border border-white/5">
             <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-2 border-[#86efac]/30 border-t-[#86efac] rounded-full animate-spin" />
                <span className="text-[10px] uppercase tracking-widest text-gray-500">Recalibrating...</span>
             </div>
          </div>
        ) : (
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
                formatter={(value: any) => [`$${value}`, 'Net Position']}
              />
              
              <Area 
                type="monotone" 
                dataKey="total" 
                stroke="#86efac" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorTotal)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
