import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Bell } from "lucide-react"
import { NotificationsClient } from "./notifications-client"

/**
 * Centro de Notificaciones — Server Component.
 * Genera notificaciones en tiempo real basadas en datos reales:
 * - Compradores: nuevas ofertas recibidas y licitaciones por cerrar.
 * - Proveedores: ofertas aceptadas y nuevas oportunidades publicadas.
 * Pasa los datos al cliente para renderizado interactivo con acordeón.
 */
export default async function NotificationsPage() {
    const session = await auth()
    if (!session?.user?.id || !session.user.companyId) redirect('/login')

    const isBuyer = session.user.role === 'BUYER'
    const companyId = session.user.companyId

    type NotifType = 'info' | 'success' | 'warning' | 'danger'
    const notifications: {
        id: string
        title: string
        description: string
        time: string
        type: NotifType
        link?: string
        read: boolean
    }[] = []

    if (isBuyer) {
        const [recentBids, closingRfqs, pendingEval] = await Promise.all([
            prisma.bid.findMany({
                where: { rfq: { companyId }, createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
                include: { company: true, rfq: { select: { id: true, title: true } } },
                orderBy: { createdAt: 'desc' },
                take: 10
            }),
            prisma.rfq.findMany({
                where: { companyId, status: 'OPEN', deadline: { lte: new Date(Date.now() + 24 * 60 * 60 * 1000), gte: new Date() } },
                select: { id: true, title: true, deadline: true }
            }),
            prisma.rfq.findMany({
                where: { companyId, status: 'EVALUATING' },
                select: { id: true, title: true, _count: { select: { bids: true } } }
            })
        ])

        closingRfqs.forEach(rfq => {
            notifications.push({
                id: `closing-${rfq.id}`,
                title: 'Licitación cierra en menos de 24 horas',
                description: `"${rfq.title}" tiene fecha límite el ${new Date(rfq.deadline).toLocaleDateString('es-GT', { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}. Revisa las ofertas recibidas y adjudica antes del cierre.`,
                time: 'Urgente',
                type: 'danger',
                link: `/rfq/${rfq.id}`,
                read: false
            })
        })

        pendingEval.forEach(rfq => {
            notifications.push({
                id: `eval-${rfq.id}`,
                title: 'Licitación lista para evaluación',
                description: `"${rfq.title}" tiene ${rfq._count.bids} oferta${rfq._count.bids !== 1 ? 's' : ''} esperando revisión. Compara las propuestas y selecciona la mejor opción.`,
                time: 'Pendiente',
                type: 'warning',
                link: `/rfq/${rfq.id}`,
                read: false
            })
        })

        recentBids.forEach(bid => {
            notifications.push({
                id: bid.id,
                title: 'Nueva oferta recibida',
                description: `${bid.company.name} presentó una propuesta de Q ${Number(bid.amount).toLocaleString('es-GT')} para "${bid.rfq.title}". Revisa el desglose de precios y condiciones.`,
                time: timeAgo(bid.createdAt),
                type: 'info',
                link: `/rfq/${bid.rfq.id}`,
                read: false
            })
        })
    } else {
        const [wonBids, newRfqs] = await Promise.all([
            prisma.bid.findMany({
                where: { companyId, status: 'ACCEPTED', updatedAt: { gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) } },
                include: { rfq: { select: { id: true, title: true } } },
                orderBy: { updatedAt: 'desc' },
                take: 5
            }),
            prisma.rfq.findMany({
                where: { status: 'OPEN', deadline: { gt: new Date() }, createdAt: { gte: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) } },
                include: { company: { select: { name: true } } },
                orderBy: { createdAt: 'desc' },
                take: 8
            })
        ])

        wonBids.forEach(bid => {
            notifications.push({
                id: bid.id,
                title: 'Oferta adjudicada',
                description: `Tu propuesta de Q ${Number(bid.amount).toLocaleString('es-GT')} fue seleccionada para "${bid.rfq.title}". Coordina los siguientes pasos con el comprador para completar la entrega.`,
                time: timeAgo(bid.updatedAt),
                type: 'success',
                link: `/rfq/${bid.rfq.id}`,
                read: false
            })
        })

        newRfqs.forEach(rfq => {
            notifications.push({
                id: `new-${rfq.id}`,
                title: 'Nueva oportunidad publicada',
                description: `${rfq.company.name} publicó "${rfq.title}". Revisa los requisitos y presenta tu propuesta antes del cierre.`,
                time: timeAgo(rfq.createdAt),
                type: 'info',
                link: `/rfq/${rfq.id}`,
                read: false
            })
        })
    }

    // Sort: danger first, then warning, then rest
    const order: NotifType[] = ['danger', 'warning', 'success', 'info']
    notifications.sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type))

    const unreadCount = notifications.length

    return (
        <div className="flex-1 p-5 md:p-8 xl:p-10 max-w-[1200px] w-full mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-7">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <Bell className="w-4.5 h-4.5 w-[18px] h-[18px]" />
                        </div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-outfit leading-none">
                            Notificaciones
                        </h1>
                        {unreadCount > 0 && (
                            <span className="text-[0.6rem] font-black px-2 py-0.5 rounded-full bg-blue-600 text-white">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium ml-12">
                        Alertas y actualizaciones de tus operaciones.
                    </p>
                </div>
            </div>

            {/* Card */}
            <div className="bg-white dark:bg-[#0b0f19] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                {/* Card header bar */}
                <div className="px-5 sm:px-6 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-900/40">
                    <span className="text-[0.7rem] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todo al día'}
                    </span>
                    {unreadCount > 0 && (
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-[0.65rem] font-bold text-blue-600 dark:text-blue-400">En tiempo real</span>
                        </div>
                    )}
                </div>

                {/* Notifications list */}
                <NotificationsClient notifications={notifications} />
            </div>
        </div>
    )
}

function timeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
    if (seconds < 60) return 'Ahora'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `Hace ${minutes}m`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `Hace ${hours}h`
    const days = Math.floor(hours / 24)
    if (days < 7) return `Hace ${days}d`
    return `Hace ${Math.floor(days / 7)}sem`
}
