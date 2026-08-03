import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { AnalyticsClient } from "./analytics-client"
import { CATEGORY_LABELS } from "@/lib/constants"

/**
 * Página de Inteligencia Financiera (Server Component).
 * Consulta datos reales de la base de datos para calcular KPIs, 
 * gráficas de comparación presupuesto vs. gasto, distribución por categoría,
 * tendencia de ahorro y ranking de proveedores principales.
 * Solo disponible para compradores.
 */
export default async function AnalyticsPage() {
    const session = await auth()
    if (!session?.user?.companyId || session.user.role !== 'BUYER') {
        redirect("/dashboard")
    }

    const companyId = session.user.companyId

    // ─── Base Queries ───────────────────────────────────────────
    const [allRfqs, closedRfqsWithBids, totalRfqCount] = await Promise.all([
        prisma.rfq.findMany({
            where: { companyId },
            select: {
                id: true,
                budget: true,
                category: true,
                status: true,
                createdAt: true,
                _count: { select: { bids: true } }
            }
        }),
        prisma.rfq.findMany({
            where: {
                companyId,
                status: { in: ['CLOSED', 'DELIVERED', 'PENDING_DELIVERY', 'AWARDED'] }
            },
            include: {
                bids: {
                    where: { status: 'ACCEPTED' },
                    include: { company: { select: { name: true, id: true } } }
                }
            }
        }),
        prisma.rfq.count({ where: { companyId } })
    ])

    // ─── KPI Calculations ───────────────────────────────────────
    let totalBudget = 0
    let totalAwarded = 0
    let totalBids = 0
    const closedCount = closedRfqsWithBids.length

    closedRfqsWithBids.forEach(rfq => {
        totalBudget += Number(rfq.budget)
        const accepted = rfq.bids[0]
        if (accepted) {
            totalAwarded += Number(accepted.amount)
        }
    })

    allRfqs.forEach(rfq => {
        totalBids += rfq._count.bids
    })

    const savingsAmount = totalBudget - totalAwarded
    const savingsPercent = totalBudget > 0 ? (savingsAmount / totalBudget) * 100 : 0
    const awardRate = totalRfqCount > 0 ? (closedCount / totalRfqCount) * 100 : 0
    const avgBidsPerRfq = totalRfqCount > 0 ? totalBids / totalRfqCount : 0

    // ─── Monthly Budget vs. Spent (last 6 months) ───────────────
    const monthlyMap: Record<string, { budget: number; spent: number }> = {}
    for (let i = 5; i >= 0; i--) {
        const d = new Date()
        d.setMonth(d.getMonth() - i)
        const key = d.toLocaleDateString('es-GT', { month: 'short' })
        monthlyMap[key] = { budget: 0, spent: 0 }
    }

    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
    sixMonthsAgo.setDate(1)

    closedRfqsWithBids
        .filter(rfq => rfq.createdAt >= sixMonthsAgo)
        .forEach(rfq => {
            const key = new Date(rfq.createdAt).toLocaleDateString('es-GT', { month: 'short' })
            if (key in monthlyMap) {
                monthlyMap[key].budget += Number(rfq.budget)
                const accepted = rfq.bids[0]
                if (accepted) {
                    monthlyMap[key].spent += Number(accepted.amount)
                }
            }
        })

    const monthlyComparison = Object.entries(monthlyMap).map(([month, data]) => ({
        month,
        budget: Math.round(data.budget),
        spent: Math.round(data.spent)
    }))

    // ─── Category Breakdown ─────────────────────────────────────
    const COLORS = ['#3b82f6', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
    const categoryMap: Record<string, number> = {}

    closedRfqsWithBids.forEach(rfq => {
        const catKey = rfq.category || 'OTHER'
        const accepted = rfq.bids[0]
        if (accepted) {
            categoryMap[catKey] = (categoryMap[catKey] || 0) + Number(accepted.amount)
        }
    })

    const categoryBreakdown = Object.entries(categoryMap)
        .sort((a, b) => b[1] - a[1])
        .map(([key, value], i) => ({
            name: CATEGORY_LABELS[key] || key,
            value: Math.round(value),
            color: COLORS[i % COLORS.length]
        }))

    // ─── Top Suppliers ──────────────────────────────────────────
    const supplierAgg: Record<string, { name: string; totalAwarded: number; bidCount: number; companyId: string }> = {}

    closedRfqsWithBids.forEach(rfq => {
        const accepted = rfq.bids[0]
        if (accepted) {
            const key = accepted.companyId
            if (!supplierAgg[key]) {
                supplierAgg[key] = {
                    name: accepted.company.name,
                    totalAwarded: 0,
                    bidCount: 0,
                    companyId: accepted.companyId
                }
            }
            supplierAgg[key].totalAwarded += Number(accepted.amount)
            supplierAgg[key].bidCount += 1
        }
    })

    // Fetch ratings for top suppliers
    const topSupplierIds = Object.values(supplierAgg)
        .sort((a, b) => b.totalAwarded - a.totalAwarded)
        .slice(0, 5)

    const supplierRatings = topSupplierIds.length > 0
        ? await prisma.review.groupBy({
            by: ['targetCompanyId'],
            where: { targetCompanyId: { in: topSupplierIds.map(s => s.companyId) } },
            _avg: {
                ratingQuality: true,
                ratingPunctuality: true,
                ratingCommunication: true,
                ratingProfessionalism: true
            }
        })
        : []

    const ratingsMap: Record<string, number> = {}
    supplierRatings.forEach(r => {
        const avg = (
            (r._avg.ratingQuality || 0) +
            (r._avg.ratingPunctuality || 0) +
            (r._avg.ratingCommunication || 0) +
            (r._avg.ratingProfessionalism || 0)
        ) / 4
        ratingsMap[r.targetCompanyId] = avg
    })

    const topSuppliers = topSupplierIds.map(s => ({
        name: s.name,
        totalAwarded: Math.round(s.totalAwarded),
        bidCount: s.bidCount,
        avgRating: ratingsMap[s.companyId] ?? null
    }))

    // ─── Savings Trend (monthly %) ──────────────────────────────
    const savingsTrend = Object.entries(monthlyMap)
        .map(([month, data]) => ({
            month,
            savingsPercent: data.budget > 0
                ? Math.round(((data.budget - data.spent) / data.budget) * 1000) / 10
                : 0
        }))

    return (
        <AnalyticsClient
            totalAwarded={Math.round(totalAwarded)}
            totalBudget={Math.round(totalBudget)}
            savingsAmount={Math.round(savingsAmount)}
            savingsPercent={savingsPercent}
            awardRate={awardRate}
            avgBidsPerRfq={avgBidsPerRfq}
            closedCount={closedCount}
            totalRfqCount={totalRfqCount}
            monthlyComparison={monthlyComparison}
            categoryBreakdown={categoryBreakdown}
            topSuppliers={topSuppliers}
            savingsTrend={savingsTrend}
        />
    )
}
