import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { AppHeader } from "@/components/layout/app-header"
import { OnboardingWizard } from "@/components/onboarding-wizard"
import prisma from "@/lib/prisma"

/**
 * Componente Layout para todas las rutas del Dashboard protegido.
 * Verifica la autenticación del usuario, determina su rol (comprador/proveedor),
 * y muestra el asistente de configuración inicial (onboarding) si es necesario.
 * También provee el Sidebar y Header compartidos en el dashboard.
 */
export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()
    
    // Redirigir al login si el usuario no está autenticado o no pertenece a una empresa
    if (!session?.user || !session.user.companyId) {
        redirect("/login")
    }

    const { role, name, id: userId } = session.user
    const isBuyer = role === 'BUYER'

    // Check onboarding
    const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { onboardingComplete: true }
    })
    const showOnboarding = !currentUser?.onboardingComplete

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-500 overflow-hidden relative">
            
            {/* Global Animated Background Orbs for Dashboard */}
            <div className="fixed top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-blue-600/10 dark:bg-blue-600/5 blur-[120px] rounded-full pointer-events-none animate-pulse duration-[10s] -z-0" />
            <div className="fixed bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-600/10 dark:bg-indigo-600/5 blur-[100px] rounded-full pointer-events-none -z-0" />

            {/* Global Sidebar */}
            <AppSidebar
                userName={name ?? 'Usuario'}
                userRole={role}
                isBuyer={isBuyer}
            />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto relative z-10">
                {/* Shared Header */}
                <AppHeader
                    userName={name ?? 'Usuario'}
                    userRole={role}
                />

                {/* Page Content */}
                <div className="flex-1 relative">
                    {children}
                </div>
            </main>

            {/* Onboarding Wizard */}
            {showOnboarding && <OnboardingWizard userName={name || 'Usuario'} userRole={isBuyer ? 'BUYER' : 'SUPPLIER'} />}
        </div>
    )
}
