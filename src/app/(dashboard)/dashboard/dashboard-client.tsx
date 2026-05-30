'use client'

import React from 'react'
import { motion, Variants } from 'framer-motion'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Activity, DollarSign, CheckCircle2, Star, Clock,
    Inbox, Plus, Bell
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
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
}

export function DashboardClient({
    isBuyer, companyId, totalValue, activeCount, successCount,
    tableData, alerts, rfqsByStatus, monthlyData, trustScoreBadge
}: DashboardClientProps) {
    return (
        <motion.div 
            className="flex-1 p-6 md:p-10 xl:p-14 max-w-[1600px] w-full mx-auto space-y-10"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {/* Editorial Header */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pb-2">
                <div className="space-y-2">
                    <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none font-outfit">
                        Resumen Operativo
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-base font-medium leading-relaxed max-w-2xl">
                        Gestiona tus indicadores estratégicos y visualiza el estado de tus procesos en tiempo real.
                    </p>
                </div>
                {isBuyer && (
                    <Link href="/rfq/create">
                        <Button className="cursor-pointer bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-xl shadow-blue-600/20 border-0 h-11 px-7 rounded-xl font-bold text-sm tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98]">
                            <Plus className="w-[18px] h-[18px] mr-2" /> Nueva Licitación
                        </Button>
                    </Link>
                )}
            </motion.div>

            {/* Metrics Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <MetricCard
                    title={isBuyer ? "Total Adjudicado" : "Pipeline Ganado"}
                    value={`Q ${totalValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
                    icon={DollarSign}
                    color="blue"
                />
                <MetricCard
                    title={isBuyer ? "Licitaciones Abiertas" : "Ofertas Enviadas"}
                    value={activeCount.toString()}
                    icon={Activity}
                    color="indigo"
                />
                <MetricCard
                    title={isBuyer ? "Acuerdos Cerrados" : "Contratos Ganados"}
                    value={successCount.toString()}
                    icon={CheckCircle2}
                    color="emerald"
                />
                <div className="bg-white/80 dark:bg-[#0a0f1c]/50 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-slate-200/50 dark:border-white/10 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-start mb-5 relative z-10">
                        <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">Índice de Confianza</h3>
                        <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl shadow-inner"><Star className="w-5 h-5" /></div>
                    </div>
                    <div className="flex-1 max-w-full overflow-hidden flex items-end relative z-10">
                        {trustScoreBadge}
                    </div>
                </div>
            </motion.div>

            {/* Main Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 leading-relaxed">
                {/* Table */}
                <div className="bg-white/80 dark:bg-[#0a0f1c]/50 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/50 dark:border-white/10 overflow-hidden flex flex-col transition-all relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none" />
                    <div className="px-7 py-5 flex justify-between items-center bg-slate-50/50 dark:bg-white/5 border-b border-slate-200/50 dark:border-white/10 relative z-10">
                        <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight font-outfit">{isBuyer ? 'Licitaciones Recientes' : 'Mercado: Oportunidades'}</h2>
                        <Link href="/rfq">
                            <Button variant="ghost" className="cursor-pointer text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-sm font-bold h-9 px-4 rounded-xl transition-all">
                                Ver todo
                            </Button>
                        </Link>
                    </div>

                    {tableData.length === 0 ? (
                        <div className="p-16 text-center flex flex-col items-center justify-center relative z-10">
                            <div className="w-20 h-20 bg-white dark:bg-white/5 shadow-xl border border-slate-200 dark:border-white/10 rounded-3xl flex items-center justify-center mb-5 backdrop-blur-md">
                                <Inbox className="w-10 h-10 text-slate-300 dark:text-slate-500" />
                            </div>
                            <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white font-outfit">Sin actividad</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm font-medium leading-relaxed">
                                {isBuyer ? 'Inicia un nuevo proceso para cotizar.' : 'Revisa más tarde para nuevas oportunidades.'}
                            </p>
                        </div>
                    ) : (
                        <div className="w-full overflow-x-auto custom-scrollbar relative z-10">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 dark:bg-white/5 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
                                        <th className="px-7 py-4 border-b border-slate-200/50 dark:border-white/10">Referencia</th>
                                        <th className="px-7 py-4 border-b border-slate-200/50 dark:border-white/10">Fecha Límite</th>
                                        <th className="px-7 py-4 border-b border-slate-200/50 dark:border-white/10">Estado</th>
                                        <th className="px-7 py-4 border-b border-slate-200/50 dark:border-white/10 text-right">{isBuyer ? 'Ofertas' : ''}</th>
                                        <th className="px-7 py-4 border-b border-slate-200/50 dark:border-white/10"></th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-slate-100/50 dark:divide-white/5">
                                    {tableData.map((row) => {
                                        const isPastDeadline = row.deadline && new Date() > new Date(row.deadline)
                                        const effectiveStatus = row.status === 'OPEN' && isPastDeadline ? 'EVALUATING' : row.status
                                        const statusInfo = STATUS_LABELS[effectiveStatus] || { label: effectiveStatus, class: '' }
                                        return (
                                            <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-white/5 transition-all group cursor-pointer">
                                                <td className="px-7 py-5">
                                                    <p className="font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm">{row.title}</p>
                                                    {!isBuyer && <p className="text-[0.7rem] font-bold text-slate-500 dark:text-slate-400 mt-1">{row.companyName}</p>}
                                                </td>
                                                <td className="px-7 py-5 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-xl shadow-inner ${isPastDeadline ? 'bg-red-100 dark:bg-red-500/10 text-red-600' : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-300'}`}>
                                                            <Clock className="w-4 h-4" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className={`font-bold text-sm ${isPastDeadline ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                                                                {new Date(row.deadline).toLocaleDateString('es-GT', { month: 'short', day: 'numeric' })}
                                                            </span>
                                                            <span className="text-[0.65rem] font-bold text-slate-400 dark:text-slate-500">
                                                                {new Date(row.deadline).toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-7 py-5 whitespace-nowrap">
                                                    <Badge variant="outline" className={`px-3 py-1 font-black text-[0.65rem] shadow-sm backdrop-blur-sm ${statusInfo.class}`}>
                                                        {statusInfo.label}
                                                    </Badge>
                                                </td>
                                                <td className="px-7 py-5 text-right font-black text-slate-900 dark:text-white whitespace-nowrap tabular-nums text-sm">
                                                    {row.metric}
                                                </td>
                                                <td className="px-7 py-5 text-right whitespace-nowrap">
                                                    <Link href={row.link}>
                                                        <Button variant="ghost" size="sm" className="cursor-pointer h-8 px-3 font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all text-xs">
                                                            Ver detalles
                                                        </Button>
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
                <div className="flex flex-col gap-6">
                    {/* Real Charts */}
                    <div className="bg-white/80 dark:bg-[#0a0f1c]/50 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/50 dark:border-white/10 p-1 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none" />
                        <div className="relative z-10">
                            <DashboardCharts
                                rfqsByStatus={rfqsByStatus}
                                monthlyData={monthlyData}
                                isBuyer={isBuyer}
                            />
                        </div>
                    </div>

                    {/* Alerts */}
                    <div className="bg-white/80 dark:bg-[#0a0f1c]/50 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/50 dark:border-white/10 p-7 flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none" />
                        
                        <h2 className="text-sm font-black text-slate-900 dark:text-white mb-5 flex items-center gap-2 uppercase tracking-widest relative z-10 font-outfit">
                            <Bell className="w-4 h-4 text-blue-500" /> Tareas Hoy
                        </h2>
                        <div className="space-y-3 relative z-10">
                            {alerts.length > 0 ? (
                                alerts.map((alert, i) => (
                                    <AlertItem key={i} title={alert.text} time={alert.time} type={alert.type} />
                                ))
                            ) : (
                                <div className="text-center p-6 bg-slate-50/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-2xl backdrop-blur-sm">
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">No tienes tareas pendientes.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

function MetricCard({ title, value, icon: Icon, color = "blue" }: { title: string, value: string, icon: any, color?: string }) {
    const colorVariants: any = {
        blue: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10",
        emerald: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10",
        indigo: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10",
    }
    return (
        <div className="bg-white/80 dark:bg-[#0a0f1c]/50 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-slate-200/50 dark:border-white/10 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-start mb-5 relative z-10">
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">{title}</p>
                <div className={`p-3 rounded-2xl shadow-inner backdrop-blur-md ${colorVariants[color] || colorVariants.blue}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter relative z-10 font-outfit">{value}</h3>
        </div>
    )
}

function AlertItem({ title, time, type }: { title: string, time: string, type: string }) {
    const isNew = type === 'danger'
    return (
        <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white dark:hover:bg-white/5 border border-transparent hover:border-slate-200/50 dark:hover:border-white/10 transition-all group cursor-pointer shadow-sm hover:shadow-md">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${isNew ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-300'}`}>
                {isNew ? <Bell className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{title}</p>
                <p className="text-[0.65rem] font-bold text-slate-400 dark:text-slate-500 uppercase mt-0.5">{time}</p>
            </div>
        </div>
    )
}
