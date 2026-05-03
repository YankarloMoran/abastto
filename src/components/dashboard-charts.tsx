'use client'

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'

const COLORS = ['#3b82f6', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

interface DashboardChartsProps {
    rfqsByStatus: { name: string; value: number; color: string }[]
    monthlyData: { month: string; value: number }[]
    isBuyer: boolean
}

export function DashboardCharts({ rfqsByStatus, monthlyData, isBuyer }: DashboardChartsProps) {
    const hasStatusData = rfqsByStatus.some(s => s.value > 0)
    const hasMonthlyData = monthlyData.some(m => m.value > 0)

    return (
        <div className="flex flex-col gap-6">
            {/* Activity Chart */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5 p-6 flex flex-col">
                <h2 className="text-[0.65rem] font-black text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-[0.15em]">
                    {isBuyer ? 'Gasto Mensual (Q)' : 'Ofertas por Mes'}
                </h2>
                {hasMonthlyData ? (
                    <div className="h-[160px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #f1f5f9)" vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--chart-text, #94a3b8)' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--chart-text, #94a3b8)' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--chart-tooltip-bg, #fff)',
                                        border: '1px solid var(--chart-tooltip-border, #e2e8f0)',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        fontWeight: 700,
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                        color: 'var(--chart-tooltip-text, #0f172a)'
                                    }}
                                    formatter={(value) => [isBuyer ? `Q ${Number(value ?? 0).toLocaleString()}` : `${value ?? 0} ofertas`, '']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#3b82f6"
                                    strokeWidth={2.5}
                                    fill="url(#colorValue)"
                                    dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }}
                                    activeDot={{ r: 5, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-[160px] flex items-center justify-center">
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500">Sin datos históricos aún</p>
                    </div>
                )}
            </div>

            {/* Status Donut */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5 p-6 flex flex-col">
                <h2 className="text-[0.65rem] font-black text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-[0.15em]">
                    {isBuyer ? 'Licitaciones por Estado' : 'Ofertas por Estado'}
                </h2>
                {hasStatusData ? (
                    <div className="flex items-center gap-4">
                        <div className="w-[120px] h-[120px] shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={rfqsByStatus.filter(s => s.value > 0)}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={32}
                                        outerRadius={55}
                                        dataKey="value"
                                        strokeWidth={2}
                                        stroke="var(--chart-pie-stroke, #fff)"
                                    >
                                        {rfqsByStatus.filter(s => s.value > 0).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'var(--chart-tooltip-bg, #fff)',
                                            border: '1px solid var(--chart-tooltip-border, #e2e8f0)',
                                            borderRadius: '12px',
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                            color: 'var(--chart-tooltip-text, #0f172a)'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex-1 space-y-2">
                            {rfqsByStatus.filter(s => s.value > 0).map((status, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: status.color }} />
                                    <span className="text-[0.65rem] font-bold text-slate-600 dark:text-slate-400 flex-1 truncate">{status.name}</span>
                                    <span className="text-[0.7rem] font-black text-slate-900 dark:text-white tabular-nums">{status.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="h-[120px] flex items-center justify-center">
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500">Sin datos aún</p>
                    </div>
                )}
            </div>
        </div>
    )
}
