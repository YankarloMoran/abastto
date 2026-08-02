'use client'

import React from 'react'
import { motion, Variants } from 'framer-motion'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Activity, DollarSign, CheckCircle2, Star, Clock,
    Inbox, Plus, Bell, ArrowRight
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
        transition: { staggerChildren: 0.08 }
    }
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
}

export function DashboardClient({
    isBuyer, companyId, totalValue, activeCount, successCount,
    tableData, alerts, rfqsByStatus, monthlyData, trustScoreBadge
}: DashboardClientProps) {
    return (
        <motion.div 
            className="flex-1 p-5 md:p-8 xl:p-10 max-w-[1600px] w-full mx-auto space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-1">
                <div className="space-y-1">
                    <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none font-outfit">
                        Resumen Operativo
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                        Indicadores clave y actividad en tiempo real de su organización.
                    </p>
                </div>
                {isBuyer && (
                    <Link href="/rfq/create">
                        <Button className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 border-0 h-10 px-5 rounded-xl font-bold text-xs tracking-wide transition-all cursor-pointer">
                            <Plus className="w-4 h-4 mr-2" /> Nueva Licitación
                        </Button>
                    </Link>
                )}
            </motion.div>

            {/* Metrics Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <div className="bg-white dark:bg-[#0b0f19] rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:shadow-md transition-all duration-200">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-[0.7rem] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Calificación Comercial</h3>
                        <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl border border-amber-200/60 dark:border-amber-900/40">
                            <Star className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex-1 max-w-full overflow-hidden flex items-end">
                        {trustScoreBadge}
                    </div>
                </div>
            </motion.div>

            {/* Main Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
                {/* Table Card */}
                <div className="bg-white dark:bg-[#0b0f19] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col transition-all">
                    <div className="px-5 py-4 flex justify-between items-center bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
                        <h2 className="text-base font-bold text-slate-900 dark:text-white font-outfit">
                            {isBuyer ? 'Licitaciones Recientes' : 'Oportunidades Disponibles'}
                        </h2>
                        <Link href="/rfq">
                            <Button variant="ghost" className="cursor-pointer text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs font-bold h-8 px-3 rounded-lg transition-all">
                                Ver todo <ArrowRight className="w-3.5 h-3.5 ml-1" />
                            </Button>
                        </Link>
                    </div>

                    {tableData.length === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center justify-center">
                            <div className="w-14 h-14 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center mb-4">
                                <Inbox className="w-7 h-7 text-slate-400 dark:text-slate-500" />
                            </div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit">Sin actividad reciente</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs font-medium">
                                {isBuyer ? 'Cree un requerimiento para recibir propuestas.' : 'No hay oportunidades abiertas actualmente.'}
                            </p>
                        </div>
                    ) : (
                        <div className="w-full overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse min-w-[620px]">
                                <thead>
                                    <tr className="bg-slate-50/50 dark:bg-slate-900/20 text-[0.7rem] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                                        <th className="px-5 py-3.5">Referencia</th>
                                        <th className="px-5 py-3.5">Fecha Límite</th>
                                        <th className="px-5 py-3.5">Estado</th>
                                        <th className="px-5 py-3.5 text-right">{isBuyer ? 'Ofertas' : 'Detalles'}</th>
                                        <th className="px-4 py-3.5 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="text-xs divide-y divide-slate-100 dark:divide-slate-800/60">
                                    {tableData.map((row) => {
                                        const isPastDeadline = row.deadline && new Date() > new Date(row.deadline)
                                        const effectiveStatus = row.status === 'OPEN' && isPastDeadline ? 'EVALUATING' : row.status
                                        const statusInfo = STATUS_LABELS[effectiveStatus] || { label: effectiveStatus, class: '' }
                                        return (
                                            <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors group cursor-pointer">
                                                <td className="px-5 py-3.5">
                                                    <p className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-xs max-w-[180px] sm:max-w-[240px] xl:max-w-[280px] truncate">
                                                        {row.title}
                                                    </p>
                                                    {!isBuyer && <p className="text-[0.65rem] font-medium text-slate-400 mt-0.5 truncate max-w-[180px]">{row.companyName}</p>}
                                                </td>
                                                <td className="px-5 py-3.5 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className={`w-3.5 h-3.5 ${isPastDeadline ? 'text-rose-500' : 'text-slate-400'}`} />
                                                        <span className={`font-semibold ${isPastDeadline ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                                            {new Date(row.deadline).toLocaleDateString('es-GT', { month: 'short', day: 'numeric' })}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5 whitespace-nowrap">
                                                    <Badge variant="outline" className={`px-2.5 py-0.5 font-bold text-[0.65rem] ${statusInfo.class}`}>
                                                        {statusInfo.label}
                                                    </Badge>
                                                </td>
                                                <td className="px-5 py-3.5 text-right font-bold text-slate-900 dark:text-white whitespace-nowrap tabular-nums">
                                                    {row.metric}
                                                </td>
                                                <td className="px-4 py-3.5 text-right whitespace-nowrap">
                                                    <Link href={row.link}>
                                                        <Button variant="ghost" size="sm" className="cursor-pointer h-7 px-2.5 font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg text-[0.7rem]">
                                                            Ver
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
                    {/* Charts */}
                    <div className="bg-white dark:bg-[#0b0f19] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
                        <DashboardCharts
                            rfqsByStatus={rfqsByStatus}
                            monthlyData={monthlyData}
                            isBuyer={isBuyer}
                        />
                    </div>

                    {/* Alerts Card */}
                    <div className="bg-white dark:bg-[#0b0f19] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-5">
                        <h2 className="text-xs font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-wider font-outfit">
                            <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Alertas Operativas
                        </h2>
                        <div className="space-y-2.5">
                            {alerts.length > 0 ? (
                                alerts.map((alert, i) => (
                                    <AlertItem key={i} title={alert.text} time={alert.time} type={alert.type} />
                                ))
                            ) : (
                                <div className="text-center p-4 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800 rounded-xl">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">No tiene tareas pendientes actualmente.</p>
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
        blue: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/40",
        emerald: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/40",
        indigo: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/40",
    }
    return (
        <div className="bg-white dark:bg-[#0b0f19] rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
                <p className="text-[0.7rem] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
                <div className={`p-2.5 rounded-xl border ${colorVariants[color] || colorVariants.blue}`}>
                    <Icon className="w-4 h-4" />
                </div>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-outfit">{value}</h3>
        </div>
    )
}

function AlertItem({ title, time, type }: { title: string, time: string, type: string }) {
    const isNew = type === 'danger'
    return (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 text-xs">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isNew ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400' : 'bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                {isNew ? <Bell className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 dark:text-white truncate">{title}</p>
                <p className="text-[0.65rem] font-medium text-slate-400 uppercase mt-0.5">{time}</p>
            </div>
        </div>
    )
}
