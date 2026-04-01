"use client"

import { Blocks, Users, Banknote, Settings, User } from 'lucide-react'
import { useAuth } from "@/context/auth-context"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function MobileNav() {
  const { user } = useAuth()
  const pathname = usePathname()

  const navItems = [
    { name: 'Home', icon: Blocks, href: '/dashboard' },
    { name: 'Records', icon: Banknote, href: '/dashboard/records' },
  ]

  if (user?.role === 'admin') {
    navItems.push({ name: 'Users', icon: Users, href: '/dashboard/users' })
  }

  // Add a simple profile/settings icon for mobile
  navItems.push({ name: 'Settings', icon: Settings, href: '#' })

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-auto">
      <nav className="flex items-center gap-2 p-2 bg-[#0D0D0D]/80 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl shadow-[#86efac]/5">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link 
              key={item.href + item.name}
              href={item.href}
              className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                isActive 
                  ? 'bg-[#86efac] text-black shadow-[0_0_15px_rgba(134,239,172,0.4)]' 
                  : 'text-[#919191] hover:text-[#E7E7E7]'
              }`}
            >
              <item.icon className="h-5 w-5" />
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
