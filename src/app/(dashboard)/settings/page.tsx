import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import CompanyProfileForm from "./profile-form"
import { TrustScoreBadge } from "@/components/trust-score-badge"

/**
 * Página de Configuración (Perfil de Empresa).
 * Obtiene la información actual de la empresa desde la base de datos
 * y evalúa si el usuario activo tiene permisos de edición.
 * Renderiza el formulario `CompanyProfileForm` en modo edición o solo lectura.
 */
export default async function SettingsProfilePage() {
    const session = await auth()

    if (!session?.user || !session.user.companyId) {
        redirect("/login")
    }

    const company = await prisma.company.findUnique({
        where: { id: session.user.companyId }
    })

    if (!company) {
        return <div>Error: Empresa no encontrada.</div>
    }

    const isReadOnly = session.user.companyRole !== 'OWNER' && session.user.companyRole !== 'ADMIN'

    return (
        <div className="flex-1 p-5 md:p-8 xl:p-10 max-w-[1400px] w-full mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
                <div>
                    <p className="text-[0.7rem] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-[0.12em] mb-1">Ajustes Generales</p>
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-outfit">Perfil de la Empresa</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Actualiza la información pública y operativa de tu negocio.</p>
                </div>
                <TrustScoreBadge companyId={session.user.companyId} />
            </div>

            {isReadOnly && (
                <div className="mb-10 bg-amber-50/50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-800/50 text-amber-800 dark:text-amber-400 px-6 py-4 rounded-2xl text-sm font-medium flex items-start gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                    <p>Estás viendo este perfil en modo <strong>Solo Lectura</strong>. Solo los Administradores o Propietarios pueden modificar la información general de la empresa.</p>
                </div>
            )}

            <CompanyProfileForm initialData={company} isReadOnly={isReadOnly} />
        </div>
    )
}
