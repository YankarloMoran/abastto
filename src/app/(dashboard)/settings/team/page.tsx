import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import InviteMemberModal from "./invite-modal"
import { CopyLinkButton } from "./copy-link-button"
import { ShieldCheck, Users, Mail, Clock, Crown, UserCheck, Eye } from "lucide-react"

const ROLE_DISPLAY_NAMES: Record<string, { label: string; icon: any; class: string }> = {
    OWNER: { 
        label: '👑 Dirección / Propietario', 
        icon: Crown,
        class: 'bg-purple-100 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800' 
    },
    ADMIN: { 
        label: '🛡️ Administrador', 
        icon: ShieldCheck,
        class: 'bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800' 
    },
    MEMBER: { 
        label: '👤 Miembro Operativo', 
        icon: UserCheck,
        class: 'bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-white/10' 
    },
    VIEWER: { 
        label: '👁️ Observador / Auditor', 
        icon: Eye,
        class: 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800' 
    },
}

export default async function TeamSettingsPage() {
    const session = await auth()

    if (!session?.user || !session.user.companyId) {
        redirect("/login")
    }

    const isOwnerOrAdmin = session.user.companyRole === 'OWNER' || session.user.companyRole === 'ADMIN'

    // Fetch existing users in the company
    const users = await prisma.user.findMany({
        where: { companyId: session.user.companyId },
        select: { id: true, name: true, email: true, companyRole: true, role: true, createdAt: true },
        orderBy: { createdAt: 'asc' }
    })

    // Fetch pending invitations
    const invitations = await prisma.invitation.findMany({
        where: { companyId: session.user.companyId },
        select: { id: true, email: true, role: true, createdAt: true, expiresAt: true, token: true },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
                <div>
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white font-outfit flex items-center gap-3">
                        <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" /> Directorio de Equipo y Accesos
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-xs md:text-sm font-medium">
                        Administra las cuentas de tus colaboradores y asigna permisos jerárquicos en la organización.
                    </p>
                </div>
                {isOwnerOrAdmin && (
                    <InviteMemberModal />
                )}
            </div>

            <div className="space-y-8">
                {/* Active Members */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                            Miembros Activos ({users.length})
                        </h3>
                    </div>

                    <div className="border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-slate-900/80 shadow-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left min-w-[600px]">
                                <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[0.65rem] border-b border-slate-200 dark:border-white/5">
                                    <tr>
                                        <th className="px-6 py-4">Nombre del Integrante</th>
                                        <th className="px-6 py-4">Correo Electrónico</th>
                                        <th className="px-6 py-4">Perfil Operativo</th>
                                        <th className="px-6 py-4">Jerarquía / Permisos</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                    {users.map(user => {
                                        const roleConfig = ROLE_DISPLAY_NAMES[user.companyRole] || ROLE_DISPLAY_NAMES['MEMBER']
                                        return (
                                            <tr key={user.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 rounded-lg bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xs">
                                                            {user.name?.[0]?.toUpperCase() || 'U'}
                                                        </div>
                                                        <span>{user.name || 'Sin nombre'}</span>
                                                        {user.id === session.user?.id && (
                                                            <Badge className="bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 text-[0.65rem] font-black px-2 py-0.5">
                                                                Tú
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">{user.email}</td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="outline" className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 text-[0.65rem] font-bold">
                                                        {user.role === 'BUYER' ? 'Comprador' : 'Proveedor'}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="outline" className={`font-bold px-3 py-1 rounded-xl text-xs ${roleConfig.class}`}>
                                                        {roleConfig.label}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Pending Invitations */}
                {isOwnerOrAdmin && invitations.length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/10">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                                <Mail className="w-4 h-4 text-amber-500" /> Invitaciones Pendientes ({invitations.length})
                            </h3>
                        </div>

                        <div className="border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-slate-900/80 shadow-xs">
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs text-left min-w-[600px]">
                                    <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[0.65rem] border-b border-slate-200 dark:border-white/5">
                                        <tr>
                                            <th className="px-6 py-4">Correo Invitado</th>
                                            <th className="px-6 py-4">Rol Asignado</th>
                                            <th className="px-6 py-4">Fecha de Expiración</th>
                                            <th className="px-6 py-4">Acción / Copiar Enlace</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                        {invitations.map(inv => {
                                            const roleConfig = ROLE_DISPLAY_NAMES[inv.role] || ROLE_DISPLAY_NAMES['MEMBER']
                                            const isExpired = new Date(inv.expiresAt) < new Date()
                                            return (
                                                <tr key={inv.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">{inv.email}</td>
                                                    <td className="px-6 py-4">
                                                        <Badge variant="outline" className={`font-bold px-3 py-1 rounded-xl text-xs ${roleConfig.class}`}>
                                                            {roleConfig.label}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-medium">
                                                        <div className="flex items-center gap-1.5">
                                                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                            <span>{new Date(inv.expiresAt).toLocaleDateString('es-GT', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                            {isExpired && <span className="text-red-500 font-bold ml-1">(Expirada)</span>}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <CopyLinkButton token={inv.token} />
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
