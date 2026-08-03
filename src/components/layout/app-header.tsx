'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Bell, ArrowRight, CheckCircle2, AlertTriangle, Clock, BellRing } from 'lucide-react'
import { SearchCommand } from '@/components/search-command'

interface AppHeaderProps {
    userName: string
    userRole: string
}

export function AppHeader({ userName, userRole }: AppHeaderProps) {
    const [notifOpen, setNotifOpen] = useState(false)
    const notifRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setNotifOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const quickNotifications = userRole === 'BUYER' ? [
        { id: '1', title: 'Licitación por cerrar', desc: 'Revisa las ofertas de la licitación de tecnología', time: 'Hoy', type: 'danger', link: '/rfq' },
        { id: '2', title: 'Nueva oferta recibida', desc: 'Suministros GT envió una cotización', time: 'Hace 2h', type: 'info', link: '/rfq' },
        { id: '3', title: 'Evaluación pendiente', desc: '3 licitaciones listas para adjudicar', time: 'Ayer', type: 'warning', link: '/rfq' },
    ] : [
        { id: '1', title: '¡Oferta Adjudicada!', desc: 'Tu propuesta de equipo fue seleccionada', time: 'Hace 1h', type: 'success', link: '/rfq' },
        { id: '2', title: 'Nueva oportunidad', desc: 'Publicado nuevo requerimiento de servicios', time: 'Hace 4h', type: 'info', link: '/rfq' },
    ]

    return (
        <header className="h-[56px] bg-white/95 dark:bg-[#0b0f19]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/70 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20 shrink-0 transition-colors">
            {/* Left: Search */}
            <div className="flex items-center gap-3 flex-1 max-w-[380px] ml-10 md:ml-0">
                <SearchCommand />
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
                {/* Notifications bell dropdown */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setNotifOpen(!notifOpen)}
                        className="cursor-pointer relative p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/8 transition-colors"
                        aria-label="Notificaciones"
                    >
                        <Bell className="w-[17px] h-[17px]" />
                        {/* Live indicator dot */}
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 border-2 border-white dark:border-[#0b0f19] rounded-full animate-pulse" />
                    </button>

                    {/* Popover Dropdown */}
                    {notifOpen && (
                        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-outfit">Notificaciones Recientes</h3>
                                <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/40">
                                    En tiempo real
                                </span>
                            </div>

                            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[320px] overflow-y-auto custom-scrollbar">
                                {quickNotifications.map(item => (
                                    <Link
                                        key={item.id}
                                        href={item.link}
                                        onClick={() => setNotifOpen(false)}
                                        className="flex items-start gap-3 p-3.5 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors group cursor-pointer"
                                    >
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                                            item.type === 'danger' ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/40' :
                                            item.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/40' :
                                            item.type === 'warning' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/40' :
                                            'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/40'
                                        }`}>
                                            {item.type === 'danger' && <AlertTriangle className="w-4 h-4" />}
                                            {item.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
                                            {item.type === 'warning' && <Clock className="w-4 h-4" />}
                                            {item.type === 'info' && <BellRing className="w-4 h-4" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.title}</p>
                                                <span className="text-[0.65rem] text-slate-400 shrink-0 ml-2">{item.time}</span>
                                            </div>
                                            <p className="text-[0.7rem] text-slate-500 dark:text-slate-400 truncate">{item.desc}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            <Link
                                href="/notifications"
                                onClick={() => setNotifOpen(false)}
                                className="p-3 bg-slate-50/80 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                            >
                                Ver todas las notificaciones <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                            </Link>
                        </div>
                    )}
                </div>

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
