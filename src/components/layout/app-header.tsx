'use client'

import Link from 'next/link'
import { Bell } from 'lucide-react'
import { SearchCommand } from '@/components/search-command'

interface AppHeaderProps {
    userName: string
    userRole: string
}

export function AppHeader({ userName, userRole }: AppHeaderProps) {
    return (
        <header className="h-[64px] bg-white/60 dark:bg-[#020617]/50 backdrop-blur-2xl border-b border-slate-200/50 dark:border-white/5 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20 shrink-0 transition-colors">
            {/* Left: Search */}
            <div className="flex items-center gap-3 flex-1 max-w-[420px] ml-12 md:ml-0">
                <SearchCommand />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <Link href="/notifications">
                    <button className="cursor-pointer relative text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-all p-2.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-[#020617] rounded-full animate-pulse" />
                    </button>
                </Link>

                <div className="w-px h-7 bg-slate-200 dark:bg-white/10 hidden sm:block" />

                {/* User Avatar */}
                <Link href="/settings" className="flex items-center gap-3 group">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight font-outfit">{userName}</p>
                        <p className="text-[0.6rem] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.1em]">
                            {userRole === 'BUYER' ? 'Comprador' : 'Proveedor'}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-blue-600/20 transition-transform group-hover:scale-105 border border-white/10">
                        {userName?.[0]?.toUpperCase() || '?'}
                    </div>
                </Link>
            </div>
        </header>
    )
}
