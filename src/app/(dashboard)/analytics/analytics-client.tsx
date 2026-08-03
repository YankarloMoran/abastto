'use client'

import React, { useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'
import {
    DollarSign, TrendingUp, TrendingDown, Percent, ShoppingCart,
    Building2, BrainCircuit, Loader2, ArrowLeft, Star
} from 'lucide-react'
import Link from 'next/link'
import { generateSpendAnalytics } from '@/actions/ai'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// ─── Types ──────────────────────────────────────────────────────

interface MonthlyComparison {
    month: string
    budget: number
    spent: number
}

interface CategoryBreakdown {
    name: string
    value: number
    color: string
}

interface TopSupplier {
    name: string
    totalAwarded: number
    bidCount: number
    avgRating: number | null
}

interface SavingsTrend {
    month: string
    savingsPercent: number
}

export interface AnalyticsClientProps {
    totalAwarded: number
    totalBudget: number
    savingsAmount: number
    savingsPercent: number
    awardRate: number
    avgBidsPerRfq: number
    closedCount: number
    totalRfqCount: number
    monthlyComparison: MonthlyComparison[]
    categoryBreakdown: CategoryBreakdown[]
    topSuppliers: TopSupplier[]
    savingsTrend: SavingsTrend[]
}

// ─── Animation Variants ─────────────────────────────────────────

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } }
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
}

// ─── Color Palette ──────────────────────────────────────────────

const CATEGORY_COLORS = ['#3b82f6', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

// ─── Custom Tooltip ─────────────────────────────────────────────

const tooltipStyle = {
    backgroundColor: 'var(--chart-tooltip-bg, #0f172a)',
    border: '1px solid var(--chart-tooltip-border, rgba(255,255,255,0.08))',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 700,
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    color: 'var(--chart-tooltip-text, #f8fafc)',
    padding: '10px 14px',
}

// ─── Main Component ─────────────────────────────────────────────

export function AnalyticsClient(props: AnalyticsClientProps) {
    const {
        totalAwarded, totalBudget, savingsAmount, savingsPercent,
        awardRate, avgBidsPerRfq, closedCount, totalRfqCount,
        monthlyComparison, categoryBreakdown, topSuppliers, savingsTrend
    } = props

    const [aiLoading, setAiLoading] = useState(false)
    const [aiReport, setAiReport] = useState<string | null>(null)
    const [aiError, setAiError] = useState<string | null>(null)

    const handleAiAnalysis = async () => {
        setAiLoading(true)
        setAiError(null)
        const result = await generateSpendAnalytics()
        if (result.success) {
            setAiReport((result as any).analysis)
        } else {
            setAiError(result.message || 'Error al generar análisis.')
        }
        setAiLoading(false)
    }

    const fmt = (n: number) => `Q ${n.toLocaleString('es-GT', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    const hasData = closedCount > 0

    return (
        <motion.div
            className="flex-1 p-5 md:p-8 xl:p-10 max-w-[1400px] w-full mx-auto space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-1">
                <div className="space-y-1">
                    <Link href="/dashboard" className="text-xs font-bold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 mb-3">
                        <ArrowLeft className="w-3.5 h-3.5" /> Volver al Resumen
                    </Link>
                    <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none font-outfit">
                        Inteligencia Financiera
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                        Métricas de rendimiento y ahorro basadas en {totalRfqCount} licitación{totalRfqCount !== 1 ? 'es' : ''} registrada{totalRfqCount !== 1 ? 's' : ''}.
                    </p>
                </div>
                <Button
                    onClick={handleAiAnalysis}
                    disabled={aiLoading || !hasData}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold h-10 px-5 rounded-xl shadow-md shadow-blue-600/20 border-0 text-xs tracking-wide transition-all cursor-pointer disabled:opacity-50"
                >
                    {aiLoading ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analizando...</>
                    ) : (
                        <><BrainCircuit className="w-4 h-4 mr-2" /> Recomendaciones con Nexus IA</>
                    )}
                </Button>
            </motion.div>

            {/* 4 KPI Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard
                    title="Total Adjudicado"
                    value={fmt(totalAwarded)}
                    subtitle={`de ${fmt(totalBudget)} presupuestado`}
                    icon={DollarSign}
                    color="blue"
                />
                <KpiCard
                    title="Ahorro Acumulado"
                    value={fmt(savingsAmount)}
                    subtitle={`${savingsPercent.toFixed(1)}% de eficiencia`}
                    icon={savingsAmount >= 0 ? TrendingUp : TrendingDown}
                    color="emerald"
                    trend={savingsPercent >= 0 ? 'up' : 'down'}
                />
                <KpiCard
                    title="Tasa de Adjudicación"
                    value={`${awardRate.toFixed(0)}%`}
                    subtitle={`${closedCount} de ${totalRfqCount} cerradas`}
                    icon={Percent}
                    color="indigo"
                />
                <KpiCard
                    title="Ofertas Promedio"
                    value={avgBidsPerRfq.toFixed(1)}
                    subtitle="ofertas por licitación"
                    icon={ShoppingCart}
                    color="amber"
                />
            </motion.div>

            {!hasData && (
                <motion.div variants={itemVariants} className="p-12 text-center bg-white dark:bg-[#0b0f19] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <ShoppingCart className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-outfit">Sin datos históricos</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto font-medium">
                        Las métricas se generarán automáticamente cuando cierres tu primera licitación. Publica un requerimiento para empezar.
                    </p>
                    <Link href="/rfq/create">
                        <Button className="mt-5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 h-10 rounded-xl cursor-pointer">
                            Crear Licitación
                        </Button>
                    </Link>
                </motion.div>
            )}

            {hasData && (
                <>
                    {/* Charts Row: Bar + Pie */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
                        {/* Monthly Comparison Bar Chart */}
                        <div className="bg-white dark:bg-[#0b0f19] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-5 font-outfit">
                                Presupuesto vs. Gasto Mensual
                            </h2>
                            {monthlyComparison.length > 0 ? (
                                <div className="h-[260px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={monthlyComparison} margin={{ top: 5, right: 5, left: -10, bottom: 0 }} barGap={4}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #334155)" opacity={0.15} vertical={false} />
                                            <XAxis
                                                dataKey="month"
                                                tick={{ fontSize: 11, fontWeight: 700, fill: 'var(--chart-text, #94a3b8)' }}
                                                axisLine={false} tickLine={false}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--chart-text, #94a3b8)' }}
                                                axisLine={false} tickLine={false}
                                                tickFormatter={(v) => `Q${(v / 1000).toFixed(0)}k`}
                                            />
                                            <Tooltip
                                                contentStyle={tooltipStyle}
                                                formatter={(value: any, name: any) => [
                                                    fmt(Number(value ?? 0)),
                                                    name === 'budget' ? 'Presupuesto' : 'Adjudicado'
                                                ]}
                                                labelStyle={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, marginBottom: 4 }}
                                            />
                                            <Bar dataKey="budget" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={32} name="budget" opacity={0.35} />
                                            <Bar dataKey="spent" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={32} name="spent" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <EmptyChart />
                            )}
                            <div className="flex items-center gap-5 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded bg-indigo-500 opacity-40" />
                                    <span className="text-[0.65rem] font-bold text-slate-500 dark:text-slate-400">Presupuesto</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded bg-blue-500" />
                                    <span className="text-[0.65rem] font-bold text-slate-500 dark:text-slate-400">Adjudicado</span>
                                </div>
                            </div>
                        </div>

                        {/* Category Pie Chart */}
                        <div className="bg-white dark:bg-[#0b0f19] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-5 font-outfit">
                                Distribución por Categoría
                            </h2>
                            {categoryBreakdown.length > 0 ? (
                                <div className="flex flex-col items-center">
                                    <div className="w-[200px] h-[200px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={categoryBreakdown}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={55}
                                                    outerRadius={90}
                                                    dataKey="value"
                                                    strokeWidth={2}
                                                    stroke="var(--chart-pie-stroke, transparent)"
                                                >
                                                    {categoryBreakdown.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={tooltipStyle}
                                                    formatter={(value: any) => [fmt(Number(value ?? 0)), '']}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="w-full space-y-2 mt-4">
                                        {categoryBreakdown.map((cat, i) => (
                                            <div key={i} className="flex items-center gap-2.5">
                                                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                                                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex-1 truncate">{cat.name}</span>
                                                <span className="text-xs font-black text-slate-900 dark:text-white tabular-nums">{fmt(cat.value)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <EmptyChart />
                            )}
                        </div>
                    </motion.div>

                    {/* Bottom Row: Savings Trend + Top Suppliers */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* Savings Trend Area Chart */}
                        <div className="bg-white dark:bg-[#0b0f19] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-5 font-outfit">
                                Tendencia de Ahorro Mensual
                            </h2>
                            {savingsTrend.length > 0 ? (
                                <div className="h-[220px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={savingsTrend} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #334155)" opacity={0.15} vertical={false} />
                                            <XAxis
                                                dataKey="month"
                                                tick={{ fontSize: 11, fontWeight: 700, fill: 'var(--chart-text, #94a3b8)' }}
                                                axisLine={false} tickLine={false}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--chart-text, #94a3b8)' }}
                                                axisLine={false} tickLine={false}
                                                tickFormatter={(v) => `${v}%`}
                                            />
                                            <Tooltip
                                                contentStyle={tooltipStyle}
                                                formatter={(value: any) => [`${Number(value ?? 0).toFixed(1)}%`, 'Ahorro']}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="savingsPercent"
                                                stroke="#10b981"
                                                strokeWidth={2.5}
                                                fill="url(#savingsGrad)"
                                                dot={{ r: 3.5, fill: '#10b981', strokeWidth: 0 }}
                                                activeDot={{ r: 5, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <EmptyChart />
                            )}
                        </div>

                        {/* Top Suppliers Table */}
                        <div className="bg-white dark:bg-[#0b0f19] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
                            <div className="px-6 py-4 bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
                                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-outfit">
                                    Proveedores Principales
                                </h2>
                            </div>
                            {topSuppliers.length > 0 ? (
                                <div className="flex-1">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                                                <th className="px-6 py-3">Empresa</th>
                                                <th className="px-6 py-3 text-right">Monto Total</th>
                                                <th className="px-6 py-3 text-center">Contratos</th>
                                                <th className="px-6 py-3 text-center">Calificación</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                            {topSuppliers.map((supplier, i) => (
                                                <tr key={i} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors text-xs">
                                                    <td className="px-6 py-3.5">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                                                <Building2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                                            </div>
                                                            <span className="font-bold text-slate-900 dark:text-white truncate max-w-[160px]">{supplier.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-3.5 text-right font-black text-slate-900 dark:text-white tabular-nums">
                                                        {fmt(supplier.totalAwarded)}
                                                    </td>
                                                    <td className="px-6 py-3.5 text-center">
                                                        <Badge variant="outline" className="text-[0.6rem] font-bold px-2 py-0.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/40">
                                                            {supplier.bidCount}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-3.5 text-center">
                                                        {supplier.avgRating !== null ? (
                                                            <div className="flex items-center justify-center gap-1">
                                                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                                                <span className="font-bold text-slate-900 dark:text-white">{supplier.avgRating.toFixed(1)}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-slate-400 dark:text-slate-500 font-medium">--</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="flex-1 flex items-center justify-center p-8">
                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500">Sin proveedores adjudicados</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* AI Report Section */}
                    {aiError && (
                        <motion.div variants={itemVariants} className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-5 rounded-2xl text-sm font-medium">
                            {aiError}
                        </motion.div>
                    )}
                    {aiReport && (
                        <motion.div variants={itemVariants} className="bg-white dark:bg-[#0b0f19] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                                <BrainCircuit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Análisis de Nexus IA</h2>
                                <Badge className="bg-blue-600 text-white text-[0.55rem] font-bold px-2 py-0.5 ml-1">Generado por IA</Badge>
                            </div>
                            <div className="p-6 md:p-8">
                                <div className="prose prose-sm prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed prose-strong:text-slate-900 dark:prose-strong:text-white prose-li:marker:text-blue-600">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {aiReport}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </>
            )}
        </motion.div>
    )
}

// ─── Sub-Components ─────────────────────────────────────────────

function KpiCard({ title, value, subtitle, icon: Icon, color, trend }: {
    title: string
    value: string
    subtitle: string
    icon: any
    color: string
    trend?: 'up' | 'down'
}) {
    const colorMap: Record<string, string> = {
        blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/40',
        emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/40',
        indigo: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/40',
        amber: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/40',
    }
    return (
        <div className="bg-white dark:bg-[#0b0f19] rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-start mb-3">
                <p className="text-[0.7rem] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
                <div className={`p-2.5 rounded-xl border ${colorMap[color] || colorMap.blue}`}>
                    <Icon className="w-4 h-4" />
                </div>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-outfit">{value}</h3>
            <p className="text-[0.7rem] font-semibold text-slate-400 dark:text-slate-500 mt-1">{subtitle}</p>
        </div>
    )
}

function EmptyChart() {
    return (
        <div className="h-[200px] flex items-center justify-center bg-slate-50/50 dark:bg-white/5 rounded-2xl border border-slate-200/50 dark:border-white/5">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500">Sin datos suficientes</p>
        </div>
    )
}
