'use client'

import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard, FileText, Activity, Users, Settings,
    LogOut, BoxIcon, Menu, X, Bell
} from 'lucide-react'

interface AppSidebarProps {
    userName: string
    userRole: string
    isBuyer: boolean
}

const NAV_ITEMS = (isBuyer: boolean) => [
    { icon: LayoutDashboard, label: 'Inicio', href: '/dashboard' },
    { icon: FileText, label: isBuyer ? 'Mis Licitaciones' : 'Oportunidades', href: '/rfq' },
    ...(isBuyer ? [{ icon: Activity, label: 'Analíticas', href: '/analytics' }] : []),
    { icon: Users, label: 'Red de Empresas', href: '/network' },
    { icon: Bell, label: 'Notificaciones', href: '/notifications' },
]

const ADMIN_ITEMS = [
    { icon: Settings, label: 'Configuración', href: '/settings' },
    { icon: Users, label: 'Equipo', href: '/settings/team' },
]

export function AppSidebar({ userName, userRole, isBuyer }: AppSidebarProps) {
    const pathname = usePathname()
    const [mobileOpen, setMobileOpen] = useState(false)

    // Close on route change
    useEffect(() => {
        if (mobileOpen) {
            setMobileOpen(false)
        }
    }, [pathname, mobileOpen])

    // Prevent body scroll when mobile sidebar is open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [mobileOpen])

    const isActive = (href: string) => {
        if (href === '/dashboard') return pathname === '/dashboard'
        if (href === '/settings/team') return pathname === '/settings/team'
        if (href === '/settings') return pathname.startsWith('/settings') && pathname !== '/settings/team'
        return pathname.startsWith(href)
    }

    const sidebarContent = (
        <div className="flex flex-col h-full relative z-10">
            {/* Logo */}
            <div className="p-6 pb-8 border-b border-slate-200/50 dark:border-white/5">
                <Link href="/dashboard" className="flex items-center gap-3 text-blue-600 dark:text-white font-black text-2xl tracking-tighter hover:opacity-80 transition-all font-outfit">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                        <BoxIcon className="w-6 h-6 text-white" />
                    </div>
                    ABASTTO
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                {NAV_ITEMS(isBuyer).map((item) => {
                    const active = isActive(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                group flex items-center gap-3 px-4 py-3 text-[0.8125rem] font-bold rounded-xl transition-all relative overflow-hidden
                                ${active
                                    ? 'text-blue-700 dark:text-white bg-blue-50/80 dark:bg-white/10 border border-blue-100/60 dark:border-white/10 shadow-sm'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent'
                                }
                            `}
                        >
                            {active && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-blue-400 to-blue-600" />}
                            <item.icon className={`w-[18px] h-[18px] shrink-0 ${active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400'} transition-colors relative z-10`} />
                            <span className="truncate relative z-10">{item.label}</span>
                        </Link>
                    )
                })}

                {/* Admin Section */}
                <div className="pt-8 pb-2 px-4 flex items-center gap-2">
                    <div className="h-[1px] flex-1 bg-slate-200 dark:bg-white/5" />
                    <p className="text-[0.6rem] font-bold tracking-[0.15em] text-slate-400 dark:text-slate-500 uppercase">
                        Admin
                    </p>
                    <div className="h-[1px] flex-1 bg-slate-200 dark:bg-white/5" />
                </div>
                {ADMIN_ITEMS.map((item) => {
                    const active = isActive(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                group flex items-center gap-3 px-4 py-3 text-[0.8125rem] font-bold rounded-xl transition-all relative overflow-hidden
                                ${active
                                    ? 'text-blue-700 dark:text-white bg-blue-50/80 dark:bg-white/10 border border-blue-100/60 dark:border-white/10 shadow-sm'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent'
                                }
                            `}
                        >
                            {active && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-blue-400 to-blue-600" />}
                            <item.icon className={`w-[18px] h-[18px] shrink-0 ${active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400'} transition-colors relative z-10`} />
                            <span className="truncate relative z-10">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* User Footer */}
            <div className="p-4 border-t border-slate-200/50 dark:border-white/5 bg-slate-50/50 dark:bg-transparent">
                <Link href="/settings" className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white dark:hover:bg-white/5 transition-colors group border border-transparent hover:border-slate-200 dark:hover:border-white/10 hover:shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-blue-600/20 shrink-0 border border-white/10">
                        {userName?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{userName}</p>
                        <p className="text-[0.6rem] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.1em]">
                            {userRole === 'BUYER' ? 'Comprador' : 'Proveedor'}
                        </p>
                    </div>
                </Link>
                <button onClick={() => signOut({ callbackUrl: '/login' })} className="mt-2 cursor-pointer flex items-center w-full gap-3 px-4 py-2.5 text-sm font-bold text-red-500 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-all group">
                    <LogOut className="w-[18px] h-[18px] group-hover:-translate-x-1 transition-transform" />
                    Cerrar Sesión
                </button>
            </div>
        </div>
    )

    return (
        <>
            {/* Mobile toggle */}
            <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden fixed top-4 left-4 z-40 p-2.5 rounded-xl bg-white dark:bg-[#020617]/80 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                aria-label="Abrir menú"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Desktop sidebar */}
            <aside className="w-[280px] bg-white dark:bg-[#0b0f19] border-r border-slate-200 dark:border-slate-800/80 flex-shrink-0 hidden md:flex flex-col h-screen sticky top-0 z-30 transition-colors relative overflow-hidden">
                {sidebarContent}
            </aside>

            {/* Mobile backdrop */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 bottom-0 w-[280px] z-50 md:hidden
                    bg-white dark:bg-[#0b0f19]
                    border-r border-slate-200 dark:border-slate-800 shadow-2xl
                    transition-transform duration-300 ease-out overflow-hidden
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* Close button */}
                <button
                    onClick={() => setMobileOpen(false)}
                    className="absolute top-4 right-4 p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer z-20"
                    aria-label="Cerrar menú"
                >
                    <X className="w-5 h-5" />
                </button>
                {sidebarContent}
            </aside>
        </>
    )
}

