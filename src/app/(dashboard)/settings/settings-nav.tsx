'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Building, Users, ShieldCheck, Palette, ScrollText } from "lucide-react"

const navItems = [
    {
        name: "Perfil de Empresa",
        href: "/settings",
        icon: Building,
    },
    {
        name: "Apariencia",
        href: "/settings/appearance",
        icon: Palette,
    },
    {
        name: "Directorio de Equipo",
        href: "/settings/team",
        icon: Users,
    },
    {
        name: "Verificación de Identidad",
        href: "/settings/verification",
        icon: ShieldCheck,
    },
    {
        name: "Historial de Actividad",
        href: "/settings/activity",
        icon: ScrollText,
    },
]

export function SettingsNav() {
    const pathname = usePathname()

    return (
        <nav className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-white/10 mb-8">
            {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2.5 px-4 py-3 text-xs md:text-sm font-bold rounded-xl whitespace-nowrap transition-all duration-200 ${
                            isActive
                                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                        }`}
                    >
                        <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400 dark:text-slate-500"}`} />
                        {item.name}
                    </Link>
                )
            })}
        </nav>
    )
}
