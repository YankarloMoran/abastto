import React from 'react'
import prisma from '@/lib/prisma'
import RegisterForm from './register-form'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'


/**
 * Página principal de registro para nuevas empresas o miembros invitados.
 * Si se accede a través de un enlace de invitación, verifica la validez del token
 * y pasa los datos de la invitación al formulario de registro.
 * 
 * @param searchParams - Parámetros de la URL (querystring) que pueden contener un token.
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
        <div className="min-h-screen bg-white dark:bg-[#0a0f1c] flex flex-col transition-colors duration-300">
            <main className="flex-grow flex flex-col lg:flex-row shadow-2xl overflow-hidden relative">
                {/* Panel Informativo (Izquierda) */}
                <div className="hidden lg:flex lg:w-[40%] bg-[#020617] text-white p-16 flex-col justify-between relative">
                    {/* Background decorativo */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent" />
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none animate-pulse duration-[10s]" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-600/20 blur-[100px] rounded-full pointer-events-none" />

                    <div className="relative z-10">
                        <Link href="/" className="flex items-center gap-2.5 mb-16 group w-fit">
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-all">
                                <BoxIcon className="w-7 h-7 text-white" />
                            </div>
                            <span className="text-3xl font-black tracking-tighter text-white font-outfit">
                                ABASTTO
                            </span>
                        </Link>

                        <h1 className="text-4xl font-extrabold mb-8 leading-[1.1] font-outfit text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">
                            La red más eficiente para el crecimiento de tu empresa.
                        </h1>

                        <div className="space-y-8">
                            <div className="flex gap-4 items-start">
                                <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/30">
                                    <AlertCircle className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-white font-outfit">Estandarización Total</h3>
                                    <p className="text-slate-300 text-sm mt-1 font-medium">Formatos de cotización uniformes para comparaciones rápidas y precisas.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/30">
                                    <AlertCircle className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-white font-outfit">Proveedores Verificados</h3>
                                    <p className="text-slate-300 text-sm mt-1 font-medium">Acceso inmediato a una red de confianza con historial de cumplimiento.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/30">
                                    <AlertCircle className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-white font-outfit">Gestión Centralizada</h3>
                                    <p className="text-slate-300 text-sm mt-1 font-medium">Toda la documentación y transacciones en un solo tablero inteligente.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 pt-12 border-t border-white/10 mt-auto">
                        <p className="text-slate-400 text-xs font-bold tracking-widest uppercase mb-6">CONFIADO POR LÍDERES DEL SECTOR</p>
                        <div className="flex gap-8 opacity-40 grayscale filter transition-all hover:grayscale-0">
                            {/* Logos placeholders simplificados */}
                            <div className="h-6 w-24 bg-slate-500 rounded"></div>
                            <div className="h-6 w-24 bg-slate-500 rounded"></div>
                            <div className="h-6 w-24 bg-slate-500 rounded"></div>
                        </div>
                    </div>
                </div>

                {/* Formulario (Derecha) */}
                <div className="w-full lg:w-[60%] flex flex-col items-center justify-center bg-slate-50 dark:bg-[#030712] py-16 px-6 sm:px-12 relative overflow-y-auto max-h-screen lg:max-h-none transition-colors">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />
                    {/* Elementos decorativos móviles */}
                    <div className="lg:hidden absolute top-0 right-0 w-64 h-64 bg-blue-500/10 dark:bg-blue-600/10 blur-[80px] -z-10 rounded-full" />

                    <div className="w-full max-w-2xl relative z-10">
                        <div className="mb-10 text-center lg:text-left">
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                Crear Perfil Empresarial
                            </h2>
                            <p className="mt-2 text-slate-600 dark:text-slate-400 font-medium">
                                Completa los datos para activar tu cuenta corporativa.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 text-red-800 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-500/20 flex gap-3 items-center backdrop-blur-sm shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <p className="text-sm font-semibold">{error}</p>
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
