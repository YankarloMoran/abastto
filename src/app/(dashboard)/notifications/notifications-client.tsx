'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    BellRing, CheckCircle2, AlertTriangle, Clock,
    ChevronDown, ExternalLink, Inbox
} from 'lucide-react'
import Link from 'next/link'

interface NotificationItem {
    id: string
    title: string
    description: string
    time: string
    type: 'info' | 'success' | 'warning' | 'danger'
    link?: string
    read: boolean
}

interface NotificationsClientProps {
    notifications: NotificationItem[]
}

const TYPE_CONFIG = {
    success: {
        icon: CheckCircle2,
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
        text: 'text-emerald-600 dark:text-emerald-400',
        border: 'border-emerald-200 dark:border-emerald-800/60',
        dot: 'bg-emerald-500',
        label: 'Confirmado',
        labelClass: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60',
    },
    danger: {
        icon: AlertTriangle,
        bg: 'bg-rose-50 dark:bg-rose-900/20',
        text: 'text-rose-600 dark:text-rose-400',
        border: 'border-rose-200 dark:border-rose-800/60',
        dot: 'bg-rose-500',
        label: 'Urgente',
        labelClass: 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60',
    },
    warning: {
        icon: Clock,
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        text: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-800/60',
        dot: 'bg-amber-500',
        label: 'Atención',
        labelClass: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60',
    },
    info: {
        icon: BellRing,
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        text: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-800/60',
        dot: 'bg-blue-500',
        label: 'Nuevo',
        labelClass: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/60',
    },
}

export function NotificationsClient({ notifications }: NotificationsClientProps) {
    const [openId, setOpenId] = useState<string | null>(
        // Auto-open first danger notification if exists
        notifications.find(n => n.type === 'danger')?.id ?? null
    )

    if (notifications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800/60 rounded-2xl flex items-center justify-center mb-5 border border-slate-200 dark:border-slate-700">
                    <Inbox className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Estás al día</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xs font-medium leading-relaxed">
                    No tienes notificaciones pendientes. Aquí verás alertas, actualizaciones y mensajes.
                </p>
            </div>
        )
    }

    const toggle = (id: string) => setOpenId(prev => prev === id ? null : id)

    return (
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {notifications.map((notif, index) => {
                const cfg = TYPE_CONFIG[notif.type]
                const Icon = cfg.icon
                const isOpen = openId === notif.id

                return (
                    <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04, duration: 0.25 }}
                    >
                        {/* Row header — clickable to expand */}
                        <button
                            onClick={() => toggle(notif.id)}
                            className="w-full flex items-start gap-4 px-5 py-4 sm:px-6 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors text-left group"
                        >
                            {/* Icon */}
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${cfg.bg} ${cfg.text}`}>
                                <Icon className="w-4 h-4" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-3 mb-0.5">
                                    <p className={`text-sm font-bold text-slate-900 dark:text-white truncate transition-colors ${isOpen ? 'text-blue-600 dark:text-blue-400' : 'group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
                                        {notif.title}
                                    </p>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className={`text-[0.6rem] font-bold px-2 py-0.5 rounded-full border ${cfg.labelClass}`}>
                                            {notif.time === 'Urgente' ? 'Urgente' : notif.time}
                                        </span>
                                        <ChevronDown
                                            className={`w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                        />
                                    </div>
                                </div>
                                {/* Preview when collapsed */}
                                {!isOpen && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                                        {notif.description}
                                    </p>
                                )}
                            </div>
                        </button>

                        {/* Expandable body */}
                        <AnimatePresence initial={false}>
                            {isOpen && (
                                <motion.div
                                    key="content"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                                    className="overflow-hidden"
                                >
                                    <div className={`mx-5 sm:mx-6 mb-4 p-4 rounded-xl border ${cfg.bg} ${cfg.border}`}>
                                        <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                                            {notif.description}
                                        </p>
                                        {notif.link && (
                                            <Link
                                                href={notif.link}
                                                className={`inline-flex items-center gap-1.5 mt-3 text-xs font-bold ${cfg.text} hover:underline`}
                                            >
                                                Ver detalle <ExternalLink className="w-3.5 h-3.5" />
                                            </Link>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )
            })}
        </div>
    )
}
