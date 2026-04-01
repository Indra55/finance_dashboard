"use client"

import { ZorvynLogo } from "@/components/zorvyn-logo"
import { Settings2, LogOut, User } from 'lucide-react'
import { useAuth } from "@/context/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-6 bg-black/10 backdrop-blur-[120px]">
      <div className="flex items-center gap-3">
        <ZorvynLogo className="text-white h-8 w-auto" />
        <span className="text-[#919191] text-xs tracking-[0.2em] uppercase hidden sm:inline-block">
          {user ? `Welcome, ${user.name}` : 'Initializing Protocol'}
        </span>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-10 w-10 rounded-full bg-gradient-to-br from-[#86efac] to-[#4ADE80] hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#86efac]/20 flex items-center justify-center text-black">
            <User className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-[#0D0D0D] border-[#1F1F1F] text-white p-2">
          <div className="px-2 py-3 border-b border-[#1F1F1F] mb-2">
            <p className="text-xs text-[#919191] uppercase tracking-widest mb-1">Identity</p>
            <p className="text-sm font-semibold text-[#86efac] truncate">{user?.email}</p>
            <p className="text-[10px] text-[#919191] uppercase mt-1">{user?.role} Access</p>
          </div>
          <DropdownMenuItem className="focus:bg-[#1F1F1F] focus:text-[#86efac] cursor-pointer text-[#919191] py-3">
            <Settings2 className="mr-3 h-4 w-4" />
            <span>Archive Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={logout}
            className="focus:bg-red-500/10 focus:text-red-400 cursor-pointer text-[#919191] py-3"
          >
            <LogOut className="mr-3 h-4 w-4" />
            <span>Sever Connection</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
