'use client'

import React from 'react'
import { motion, Variants } from 'framer-motion'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Activity, DollarSign, CheckCircle2, Star, Clock,
    Inbox, Plus, AlertTriangle, ArrowRight, TrendingUp
} from 'lucide-react'
import { STATUS_LABELS } from "@/lib/constants"
import { DashboardCharts } from "@/components/dashboard-charts"

interface DashboardClientProps {
    isBuyer: boolean
    companyId: string
    totalValue: number
    activeCount: number
    successCount: number
    tableData: any[]
    alerts: { text: string; time: string; type: string }[]
    rfqsByStatus: { name: string; value: number; color: string }[]
    monthlyData: { month: string; value: number }[]
    trustScoreBadge: React.ReactNode
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.07 } }
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } }
}

export function DashboardClient({
    isBuyer, companyId, totalValue, activeCount, successCount,
    tableData, alerts, rfqsByStatus, monthlyData, trustScoreBadge
}: DashboardClientProps) {

    const fmt = (n: number) => `Q ${n.toLocaleString('es-GT', { maximumFractionDigits: 0 })}`

    return (
        <motion.div
            className="flex-1 p-5 md:p-8 max-w-[1500px] w-full mx-auto space-y-7"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {/* ── Page header ── */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <p className="text-[0.7rem] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-[0.12em] mb-1">
                        {isBuyer ? 'Panel de Compras' : 'Panel de Ventas'}
                    </p>
                    <h1 className="text-[1.6rem] font-bold tracking-tight text-slate-900 dark:text-white leading-none font-outfit">
                        Resumen operativo
                    </h1>
                </div>
                {isBuyer && (
                    <Link href="/rfq/create">
                        <Button className="cursor-pointer bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white border-0 h-9 px-4 rounded-lg font-semibold text-[0.8rem] transition-all shadow-sm">
                            <Plus className="w-3.5 h-3.5 mr-1.5" />
                            Nueva licitación
                        </Button>
                    </Link>
                )}
            </motion.div>

            {/* ── KPI strip ── */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatBlock
                    label={isBuyer ? "Total adjudicado" : "Pipeline ganado"}
                    value={fmt(totalValue)}
                    icon={<DollarSign className="w-3.5 h-3.5" />}
                    accent="blue"
                />
                <StatBlock
                    label={isBuyer ? "Licitaciones activas" : "Ofertas enviadas"}
                    value={activeCount.toString()}
                    icon={<Activity className="w-3.5 h-3.5" />}
                    accent="violet"
                />
                <StatBlock
                    label={isBuyer ? "Cierres completados" : "Contratos ganados"}
                    value={successCount.toString()}
                    icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                    accent="emerald"
                />
                <div className="bg-white dark:bg-[#0c1020] rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[0.68rem] text-slate-500 dark:text-slate-400 font-medium">Calificación</span>
                        <Star className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div className="flex-1 flex items-end overflow-hidden">
                        {trustScoreBadge}
                    </div>
                </div>
            </motion.div>

            {/* ── Main content ── */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5">

                {/* Left: table */}
                <div className="bg-white dark:bg-[#0c1020] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="px-5 py-3.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                            {isBuyer ? 'Licitaciones recientes' : 'Oportunidades disponibles'}
                        </h2>
                        <Link href="/rfq" className="text-[0.72rem] font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors">
                            Ver todo <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    {tableData.length === 0 ? (
                        <div className="py-16 text-center flex flex-col items-center">
                            <Inbox className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-3" />
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Sin actividad reciente</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                {isBuyer ? 'Crea un requerimiento para empezar.' : 'Aquí aparecerán las oportunidades activas.'}
                            </p>
                        </div>
                    ) : (
                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-left min-w-[580px]">
                                <thead>
                                    <tr className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/60">
                                        <th className="px-5 py-2.5">Referencia</th>
                                        <th className="px-5 py-2.5">Cierre</th>
                                        <th className="px-5 py-2.5">Estado</th>
                                        <th className="px-5 py-2.5 text-right">{isBuyer ? 'Ofertas' : 'Valor'}</th>
                                        <th className="px-4 py-2.5 w-8" />
                                    </tr>
                                </thead>
                                <tbody className="text-xs">
                                    {tableData.map((row) => {
                                        const isPast = row.deadline && new Date() > new Date(row.deadline)
                                        const effStatus = row.status === 'OPEN' && isPast ? 'EVALUATING' : row.status
                                        const statusInfo = STATUS_LABELS[effStatus] || { label: effStatus, class: '' }
                                        return (
                                            <tr key={row.id} className="border-b border-slate-50 dark:border-slate-800/40 hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors group">
                                                <td className="px-5 py-3">
                                                    <p className="font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors max-w-[200px] truncate">
                                                        {row.title}
                                                    </p>
                                                    {!isBuyer && (
                                                        <p className="text-[0.65rem] text-slate-400 mt-0.5 truncate max-w-[180px]">{row.companyName}</p>
                                                    )}
                                                </td>
                                                <td className="px-5 py-3 whitespace-nowrap">
                                                    <span className={`font-medium ${isPast ? 'text-rose-500 dark:text-rose-400' : 'text-slate-600 dark:text-slate-300'}`}>
                                                        {new Date(row.deadline).toLocaleDateString('es-GT', { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3 whitespace-nowrap">
                                                    <Badge variant="outline" className={`text-[0.62rem] font-semibold px-2 py-px ${statusInfo.class}`}>
                                                        {statusInfo.label}
                                                    </Badge>
                                                </td>
                                                <td className="px-5 py-3 text-right font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap tabular-nums">
                                                    {row.metric}
                                                </td>
                                                <td className="px-4 py-3 text-right whitespace-nowrap">
                                                    <Link href={row.link}>
                                                        <button className="cursor-pointer text-[0.7rem] font-semibold text-blue-600 dark:text-blue-400 hover:underline underline-offset-2">
                                                            Ver
                                                        </button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Right column */}
                <div className="flex flex-col gap-5">
                    {/* Charts */}
                    <div className="bg-white dark:bg-[#0c1020] rounded-xl border border-slate-200 dark:border-slate-800">
                        <DashboardCharts
                            rfqsByStatus={rfqsByStatus}
                            monthlyData={monthlyData}
                            isBuyer={isBuyer}
                        />
                    </div>

                    {/* Activity feed */}
                    <div className="bg-white dark:bg-[#0c1020] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Actividad</h2>
                            <Link href="/notifications" className="text-[0.72rem] text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                Ver todas
                            </Link>
                        </div>
                        <div className="divide-y divide-slate-50 dark:divide-slate-800/40">
                            {alerts.length > 0 ? (
                                alerts.map((alert, i) => (
                                    <FeedItem key={i} text={alert.text} time={alert.time} type={alert.type} />
                                ))
                            ) : (
                                <div className="px-4 py-6 text-center">
                                    <p className="text-xs text-slate-400 dark:text-slate-500">Sin actividad pendiente.</p>
                                </div>
                            )}
                        </div>

                        {/* Nexus IA nudge — subtle, not a banner */}
                        {isBuyer && (
                            <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 min-w-0">
                                    <TrendingUp className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                    <p className="text-[0.7rem] font-medium text-slate-500 dark:text-slate-400 truncate">
                                        Nexus IA sugiere revisar inventario
                                    </p>
                                </div>
                                <Link href="/rfq/create">
                                    <button className="cursor-pointer text-[0.7rem] font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap hover:underline underline-offset-2">
                                        Crear
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

// ── Stat block — clean, minimal ──────────────────────────────────────────────

function StatBlock({ label, value, icon, accent }: {
    label: string
    value: string
    icon: React.ReactNode
    accent: 'blue' | 'violet' | 'emerald'
}) {
    const dotColor = {
        blue: 'bg-blue-500',
        violet: 'bg-violet-500',
        emerald: 'bg-emerald-500',
    }[accent]

    return (
        <div className="bg-white dark:bg-[#0c1020] rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <span className="text-[0.68rem] text-slate-500 dark:text-slate-400 font-medium leading-none">{label}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
            </div>
            <p className="text-[1.45rem] font-bold text-slate-900 dark:text-white tracking-tight font-outfit leading-none">
                {value}
            </p>
        </div>
    )
}

// ── Feed item — timeline style ───────────────────────────────────────────────

function FeedItem({ text, time, type }: { text: string; time: string; type: string }) {
    const isDanger = type === 'danger'
    return (
        <div className="flex items-start gap-3 px-4 py-3">
            <div className="mt-1 shrink-0">
                {isDanger
                    ? <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    : <CheckCircle2 className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                }
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-snug">{text}</p>
                <p className="text-[0.65rem] text-slate-400 dark:text-slate-500 mt-0.5">{time}</p>
            </div>
        </div>
    )
}
