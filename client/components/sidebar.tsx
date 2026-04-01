"use client"

import { Blocks, Users, Banknote, LogOut, Settings } from 'lucide-react'
import { useAuth } from "@/context/auth-context"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Sidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const navItems = [
    { name: 'DASHBOARD', icon: Blocks, href: '/dashboard' },
    { name: 'RECORDS', icon: Banknote, href: '/dashboard/records' },
  ]

  if (user?.role === 'admin') {
    navItems.push({ name: 'USERS', icon: Users, href: '/dashboard/users' })
  }

  return (
    <aside className="sticky top-24 h-[calc(100vh-8rem)] md:w-48 lg:w-64 bg-[#0D0D0D] rounded-2xl hidden md:flex flex-col p-8 overflow-y-auto">
      <nav className="flex flex-col gap-8">
        {navItems.map((item) => (
          <Link 
            key={item.name}
            href={item.href}
            className={`flex items-center gap-4 transition-colors cursor-pointer ${
              pathname === item.href ? 'text-[#86efac]' : 'text-[#919191] hover:text-[#E7E7E7]'
            }`}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-[10px] font-bold tracking-widest uppercase">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-8 border-t border-[#1F1F1F] flex flex-col gap-8">
        <div className="flex items-center gap-4 text-[#919191] hover:text-[#E7E7E7] transition-colors cursor-pointer">
          <Settings className="h-6 w-6" />
          <span className="text-[10px] font-bold tracking-widest uppercase">SETTINGS</span>
        </div>
        <div 
          onClick={logout}
          className="flex items-center gap-4 text-[#919191] hover:text-red-400 transition-colors cursor-pointer"
        >
          <LogOut className="h-6 w-6" />
          <span className="text-[10px] font-bold tracking-widest uppercase">LOGOUT</span>
        </div>
      </div>
    </aside>
  )
}
