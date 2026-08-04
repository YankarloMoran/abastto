import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { SettingsNav } from "./settings-nav"

export default async function SettingsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()
    if (!session?.user) {
        redirect("/login")
    }

    return (
        <div className="flex-1 p-6 md:p-10 xl:p-14 max-w-[1400px] w-full mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white font-outfit">
                    Configuración de Cuenta
                </h1>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    Gestiona tu identidad corporativa, equipo, apariencia y estado de verificación legal.
                </p>
            </div>

            {/* Horizontal Tabs Navigation */}
            <SettingsNav />

            {/* Content Area */}
            <main className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm p-6 md:p-10 min-h-[500px] transition-colors">
                {children}
            </main>
        </div>
    )
}
