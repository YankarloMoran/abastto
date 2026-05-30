import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { DashboardClient } from "./dashboard-client"
import { TrustScoreBadge } from "@/components/trust-score-badge"

/**
 * Página principal del Dashboard (Resumen Operativo).
 * Componente de servidor que consulta la base de datos para obtener métricas clave:
 * total gastado/ganado, estado de las cotizaciones (RFQs), alertas y datos para gráficos.
 * Dependiendo del rol del usuario (Comprador o Proveedor), carga información diferente
 * y la pasa al componente cliente `DashboardClient` para su renderizado.
 */
export default async function DashboardPage() {
    const session = await auth()
    if (!session?.user || !session.user.companyId) {
        redirect("/login")
    }

    const { role, name, companyId } = session.user
    const isBuyer = role === 'BUYER'
    const now = new Date()

    let totalValue = 0
    let activeCount = 0
    let successCount = 0
    let tableData: any[] = []
    let alerts: { text: string, time: string, type: string }[] = []

    // Chart data
    let rfqsByStatus: { name: string; value: number; color: string }[] = []
    let monthlyData: { month: string; value: number }[] = []

    if (isBuyer) {
        const [spentAgg, activeRfqs, closedRfqs, recentRfqs, allRfqs] = await Promise.all([
            prisma.bid.aggregate({ where: { status: 'ACCEPTED', rfq: { companyId } }, _sum: { amount: true } }),
            prisma.rfq.count({ where: { companyId, status: { in: ['OPEN', 'EVALUATING', 'DRAFT_PENDING_APPROVAL'] } } }),
            prisma.rfq.count({ where: { companyId, status: 'CLOSED' } }),
            prisma.rfq.findMany({
                where: { companyId },
                orderBy: { createdAt: 'desc' },
                take: 8,
                include: { _count: { select: { bids: true } } }
            }),
            // For charts: group by status
            prisma.rfq.groupBy({
                by: ['status'],
                where: { companyId },
                _count: { _all: true }
            })
        ])
        totalValue = Number(spentAgg._sum.amount || 0)
        activeCount = activeRfqs
        successCount = closedRfqs
        tableData = recentRfqs.map(r => ({
            id: r.id, title: r.title, deadline: r.deadline, status: r.status,
            metric: `${r._count.bids} ofertas`, link: `/rfq/${r.id}`
        }))

        // Build status chart data
        const statusMap: Record<string, { label: string; color: string }> = {
            'OPEN': { label: 'Abiertas', color: '#10b981' },
            'EVALUATING': { label: 'Evaluando', color: '#f59e0b' },
            'AWARDED': { label: 'Adjudicadas', color: '#3b82f6' },
            'PENDING_DELIVERY': { label: 'En Entrega', color: '#f97316' },
            'DELIVERED': { label: 'Entregadas', color: '#06b6d4' },
            'CLOSED': { label: 'Cerradas', color: '#6366f1' },
            'DRAFT_PENDING_APPROVAL': { label: 'Borradores', color: '#94a3b8' },
        }
        rfqsByStatus = allRfqs.map(g => ({
            name: statusMap[g.status]?.label || g.status,
            value: g._count._all,
            color: statusMap[g.status]?.color || '#94a3b8'
        }))

        // Build monthly spend data (last 6 months)
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
        sixMonthsAgo.setDate(1)
        const acceptedBids = await prisma.bid.findMany({
            where: { status: 'ACCEPTED', rfq: { companyId }, createdAt: { gte: sixMonthsAgo } },
            select: { amount: true, createdAt: true }
        })
        const monthMap: Record<string, number> = {}
        for (let i = 5; i >= 0; i--) {
            const d = new Date()
            d.setMonth(d.getMonth() - i)
            const key = d.toLocaleDateString('es-GT', { month: 'short' })
            monthMap[key] = 0
        }
        acceptedBids.forEach(b => {
            const key = new Date(b.createdAt).toLocaleDateString('es-GT', { month: 'short' })
            if (key in monthMap) monthMap[key] += Number(b.amount)
        })
        monthlyData = Object.entries(monthMap).map(([month, value]) => ({ month, value: Math.round(value) }))

        // Alerts
        const pendingEval = await prisma.rfq.count({ where: { companyId, status: 'EVALUATING', bids: { some: {} } } })
        if (pendingEval > 0) alerts.push({ text: `Tienes ${pendingEval} licitación(es) en evaluación`, time: "Pendiente", type: "warn" })

        const closingRfqs = await prisma.rfq.findMany({
            where: { companyId, status: 'OPEN', deadline: { lte: new Date(Date.now() + 24 * 60 * 60 * 1000), gte: new Date() } },
            select: { title: true }
        })
        closingRfqs.forEach(rfq => {
            alerts.push({ text: `La licitación "${rfq.title}" cierra pronto`, time: "Hoy", type: "danger" })
        })
    } else {
        const [earnedAgg, submittedBids, wonBids, availableRfqs, bidsByStatus] = await Promise.all([
            prisma.bid.aggregate({ where: { status: 'ACCEPTED', companyId }, _sum: { amount: true } }),
            prisma.bid.count({ where: { companyId } }),
            prisma.bid.count({ where: { status: 'ACCEPTED', companyId } }),
            prisma.rfq.findMany({
                where: { status: 'OPEN', deadline: { gt: now } },
                include: { company: true },
                orderBy: { createdAt: 'desc' },
                take: 8
            }),
            // For charts: bids by status
            prisma.bid.groupBy({
                by: ['status'],
                where: { companyId },
                _count: { _all: true }
            })
        ])
        totalValue = Number(earnedAgg._sum.amount || 0)
        activeCount = submittedBids
        successCount = wonBids
        tableData = availableRfqs.map(r => ({
            id: r.id, title: r.title, deadline: r.deadline, status: r.status,
            metric: 'Ver detalles', link: `/rfq/${r.id}`,
            companyName: r.company?.name || 'Múltiples'
        }))

        // Build bid status chart
        const bidStatusMap: Record<string, { label: string; color: string }> = {
            'PENDING': { label: 'Pendientes', color: '#f59e0b' },
            'ACCEPTED': { label: 'Ganadas', color: '#10b981' },
            'REJECTED': { label: 'Rechazadas', color: '#ef4444' },
        }
        rfqsByStatus = bidsByStatus.map(g => ({
            name: bidStatusMap[g.status]?.label || g.status,
            value: g._count._all,
            color: bidStatusMap[g.status]?.color || '#94a3b8'
        }))

        // Monthly bids data
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
        sixMonthsAgo.setDate(1)
        const recentBids = await prisma.bid.findMany({
            where: { companyId, createdAt: { gte: sixMonthsAgo } },
            select: { createdAt: true }
        })
        const monthMap: Record<string, number> = {}
        for (let i = 5; i >= 0; i--) {
            const d = new Date()
            d.setMonth(d.getMonth() - i)
            const key = d.toLocaleDateString('es-GT', { month: 'short' })
            monthMap[key] = 0
        }
        recentBids.forEach(b => {
            const key = new Date(b.createdAt).toLocaleDateString('es-GT', { month: 'short' })
            if (key in monthMap) monthMap[key] += 1
        })
        monthlyData = Object.entries(monthMap).map(([month, value]) => ({ month, value }))

        // Alerts
        const wonBidsAlert = await prisma.bid.count({ where: { companyId, status: 'ACCEPTED', updatedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } })
        if (wonBidsAlert > 0) alerts.push({ text: `¡Se aceptó tu oferta en ${wonBidsAlert} licitación(es)!`, time: "Reciente", type: "success" })
    }

    return (
        <DashboardClient
            isBuyer={isBuyer}
            companyId={companyId}
            totalValue={totalValue}
            activeCount={activeCount}
            successCount={successCount}
            tableData={tableData}
            alerts={alerts}
            rfqsByStatus={rfqsByStatus}
            monthlyData={monthlyData}
            trustScoreBadge={<TrustScoreBadge companyId={companyId} className="w-full text-base py-2 px-4 bg-slate-50/50 dark:bg-white/5 border-slate-200/50 dark:border-white/10 backdrop-blur-md" />}
        />
    )
}
