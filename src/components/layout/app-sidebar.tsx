'use client'

import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard, FileText, BarChart2, Users, Settings,
    LogOut, Menu, X, Bell, UserCog
} from 'lucide-react'

interface AppSidebarProps {
    userName: string
    userRole: string
    isBuyer: boolean
}

const NAV_ITEMS = (isBuyer: boolean) => [
    { icon: LayoutDashboard, label: 'Inicio', href: '/dashboard' },
    { icon: FileText, label: isBuyer ? 'Mis Licitaciones' : 'Oportunidades', href: '/rfq' },
    ...(isBuyer ? [{ icon: BarChart2, label: 'Analíticas', href: '/analytics' }] : []),
    { icon: Users, label: 'Red de Empresas', href: '/network' },
    { icon: Bell, label: 'Notificaciones', href: '/notifications' },
]

const BOTTOM_ITEMS = [
    { icon: Settings, label: 'Configuración', href: '/settings' },
    { icon: UserCog, label: 'Equipo', href: '/settings/team' },
]

export function AppSidebar({ userName, userRole, isBuyer }: AppSidebarProps) {
    const pathname = usePathname()
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        setMobileOpen(false)
    }, [pathname])

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

    const NavLink = ({ item }: { item: { icon: any; label: string; href: string } }) => {
        const active = isActive(item.href)
        return (
            <Link
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[0.8125rem] font-medium transition-all ${
                    active
                        ? 'bg-slate-100 dark:bg-white/8 text-slate-900 dark:text-white'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
            >
                <item.icon className={`w-[17px] h-[17px] shrink-0 ${active ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'}`} />
                {item.label}
                {active && <span className="ml-auto w-1 h-1 rounded-full bg-blue-500" />}
            </Link>
        )
    }

    const sidebarContent = (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="px-5 pt-5 pb-6">
                <Link href="/dashboard" className="flex items-center gap-2.5 group">
                    <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                        <span className="text-white dark:text-slate-900 text-xs font-black tracking-tighter">AB</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white text-[0.95rem] tracking-tight group-hover:opacity-70 transition-opacity">
                        Abastto
                    </span>
                </Link>
            </div>

            {/* Main nav */}
            <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
                {NAV_ITEMS(isBuyer).map(item => <NavLink key={item.href} item={item} />)}

                {/* Divider + settings */}
                <div className="pt-5 pb-1">
                    <p className="px-3 text-[0.6rem] font-semibold tracking-widest uppercase text-slate-400 dark:text-slate-600 mb-2">
                        Cuenta
                    </p>
                    {BOTTOM_ITEMS.map(item => <NavLink key={item.href} item={item} />)}
                </div>
            </nav>

            {/* User footer */}
            <div className="mt-auto px-3 pb-4 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                <Link href="/settings" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                    <div className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-slate-200 text-white dark:text-slate-900 flex items-center justify-center font-bold text-xs shrink-0">
                        {userName?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[0.8rem] font-semibold text-slate-800 dark:text-slate-200 truncate leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {userName}
                        </p>
                        <p className="text-[0.65rem] text-slate-400 dark:text-slate-500 leading-tight">
                            {userRole === 'BUYER' ? 'Comprador' : 'Proveedor'}
                        </p>
                    </div>
                </Link>
                <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="mt-1 w-full cursor-pointer flex items-center gap-2.5 px-3 py-2 rounded-lg text-[0.8125rem] font-medium text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                >
                    <LogOut className="w-[15px] h-[15px]" />
                    Cerrar sesión
                </button>
            </div>
        </div>
    )

    return (
        <>
            {/* Mobile toggle */}
            <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-600 dark:text-slate-300 cursor-pointer"
                aria-label="Abrir menú"
            >
                <Menu className="w-4.5 h-4.5 w-[18px] h-[18px]" />
            </button>

            {/* Desktop sidebar */}
            <aside className="w-[240px] bg-white dark:bg-[#0b0f19] border-r border-slate-200 dark:border-slate-800/70 flex-shrink-0 hidden md:flex flex-col h-screen sticky top-0 z-30 transition-colors">
                {sidebarContent}
            </aside>

            {/* Mobile backdrop */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile sidebar */}
            <aside
                className={`fixed top-0 left-0 bottom-0 w-[240px] z-50 md:hidden bg-white dark:bg-[#0b0f19] border-r border-slate-200 dark:border-slate-800 shadow-xl transition-transform duration-250 ease-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <button
                    onClick={() => setMobileOpen(false)}
                    className="absolute top-4 right-3 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Cerrar menú"
                >
                    <X className="w-4 h-4" />
                </button>
                {sidebarContent}
            </aside>
        </>
    )
}
