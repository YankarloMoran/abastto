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
        <header className="h-[56px] bg-white/95 dark:bg-[#0b0f19]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/70 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20 shrink-0 transition-colors">
            {/* Left: Search */}
            <div className="flex items-center gap-3 flex-1 max-w-[380px] ml-10 md:ml-0">
                <SearchCommand />
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
                {/* Notifications bell */}
                <Link href="/notifications">
                    <button className="cursor-pointer relative p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/8 transition-colors">
                        <Bell className="w-[17px] h-[17px]" />
                        {/* Live indicator dot */}
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 border-2 border-white dark:border-[#0b0f19] rounded-full" />
                    </button>
                </Link>

                <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 hidden sm:block mx-1" />

                {/* User avatar chip */}
                <Link href="/settings" className="flex items-center gap-2 group">
                    <div className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-slate-200 text-white dark:text-slate-900 flex items-center justify-center font-bold text-[0.7rem] transition-opacity group-hover:opacity-70">
                        {userName?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-[0.78rem] font-semibold text-slate-800 dark:text-slate-200 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {userName}
                        </p>
                        <p className="text-[0.6rem] text-slate-400 dark:text-slate-500 leading-tight uppercase tracking-wide">
                            {userRole === 'BUYER' ? 'Comprador' : 'Proveedor'}
                        </p>
                    </div>
                </Link>
            </div>
        </header>
    )
}
