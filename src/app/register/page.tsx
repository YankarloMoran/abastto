import React from 'react'
import prisma from '@/lib/prisma'
import RegisterForm from './register-form'
import { AlertCircle, Building2, CheckCircle2, ShieldCheck, FileCheck, Layers } from 'lucide-react'
import Link from 'next/link'

/**
 * Página de registro empresarial en Abastto.
 * Diseño corporativo B2B estructurado sin clichés gráficos ni placeholders.
 */
export default async function RegisterPage({
    searchParams
}: {
    searchParams: Promise<{ token?: string }>
}) {
    const params = await searchParams
    const token = params.token

    let invitation = null
    let error = null

    if (token) {
        invitation = await prisma.invitation.findUnique({
            where: { token },
            include: { company: true }
        })

        if (!invitation || new Date(invitation.expiresAt) < new Date()) {
            error = "El enlace de invitación es inválido o ha expirado."
            invitation = null
        }
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
            <main className="flex-grow flex flex-col lg:flex-row border-b border-slate-200 dark:border-slate-800">
                {/* Left Side - Enterprise Industry Context */}
                <div className="hidden lg:flex lg:w-[42%] bg-[#0a0f1d] text-white p-14 flex-col justify-between relative border-r border-slate-800/80">
                    <div className="relative z-10">
                        <Link href="/" className="flex items-center gap-3 mb-14 group cursor-pointer w-fit">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-md">
                                <BoxIcon className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-white font-outfit">
                                ABASTTO
                            </span>
                        </Link>

                        <div className="max-w-md">
                            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold tracking-wider uppercase mb-5 inline-block">
                                Registro Corporativo Homologado
                            </span>
                            <h1 className="text-3xl font-extrabold mb-6 leading-snug font-outfit text-white">
                                Integre su organización a la red de abastecimiento B2B.
                            </h1>
                            <p className="text-slate-400 text-sm leading-relaxed font-medium mb-10">
                                Active su perfil empresarial como Comprador o Proveedor para gestionar licitaciones con validación de NIT en Guatemala.
                            </p>
                        </div>

                        <div className="space-y-4 max-w-md">
                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-4">
                                <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 shrink-0 mt-0.5">
                                    <FileCheck className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">Formato de Cotización Uniforme</h4>
                                    <p className="text-slate-400 text-xs mt-0.5">Estandarización de precios unitarios y partidas para análisis sin discrepancias.</p>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-4">
                                <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 shrink-0 mt-0.5">
                                    <ShieldCheck className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">Homologación de Expedientes KYC</h4>
                                    <p className="text-slate-400 text-xs mt-0.5">Resguardo legal de RTU, Patente y Nombramiento de Representante.</p>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-4">
                                <div className="p-2 rounded-lg bg-violet-600/20 text-violet-400 shrink-0 mt-0.5">
                                    <Layers className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">Roles y Permisos de Equipo</h4>
                                    <p className="text-slate-400 text-xs mt-0.5">Jerarquía de compras con solicitud de aprobación obligatoria para miembros.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 pt-8 border-t border-slate-800/80">
                        <p className="text-slate-500 text-[0.7rem] font-bold tracking-widest uppercase mb-3">COBERTURA EN SECTORES CLAVE EN GUATEMALA</p>
                        <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-400">
                            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5">Tecnología</span>
                            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5">Construcción</span>
                            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5">Manufactura</span>
                            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5">Salud & Médico</span>
                            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5">Agroindustria</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Registration Form */}
                <div className="w-full lg:w-[58%] flex flex-col items-center justify-center p-6 sm:p-12">
                    <div className="w-full max-w-2xl bg-white dark:bg-[#0b0f19] p-8 sm:p-10 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 transition-colors">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-outfit tracking-tight">
                                Crear Perfil Empresarial
                            </h2>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-medium">
                                {invitation ? `Te estás uniendo a la empresa "${invitation.company.name}"` : 'Complete los datos corporativos para registrar su organización en Abastto'}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-900/50 flex gap-3 items-center text-sm font-semibold">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        <RegisterForm invitation={invitation} />
                    </div>
                </div>
            </main>
        </div>
    )
}

function BoxIcon(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
}
