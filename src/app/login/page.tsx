"use client"

import React, { useActionState, useState } from 'react'
import { authenticate } from '@/lib/actions'
import { ArrowRight, ShieldCheck, Lock, Mail, Eye, EyeOff, BoxIcon, Zap, BarChart3, FileSpreadsheet } from 'lucide-react'
import Link from 'next/link'

/**
 * Página de inicio de sesión de Abastto.
 * Diseño empresarial B2B limpio sin elementos gráficos artificiales o clichés.
 */
export default function LoginPage() {
    const [errorMessage, dispatch] = useActionState(authenticate, undefined)
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <div className="flex-grow flex flex-col lg:flex-row">
                {/* Left Side - Enterprise B2B Value Proposition */}
                <div className="hidden lg:flex lg:w-1/2 bg-[#0a0f1d] text-white p-14 flex-col justify-between relative border-r border-slate-800/80">
                    <div className="relative z-10">
                        <Link href="/" className="flex items-center gap-3 mb-16 group cursor-pointer w-fit">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-md">
                                <BoxIcon className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-white font-outfit">
                                ABASTTO
                            </span>
                        </Link>

                        <div className="max-w-xl">
                            <span className="px-3.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-semibold tracking-wider uppercase mb-6 inline-block">
                                Plataforma B2B Institucional
                            </span>
                            <h1 className="text-4xl font-extrabold mb-6 leading-tight font-outfit text-white">
                                Control total y trazabilidad en sus compras corporativas.
                            </h1>
                            <p className="text-slate-400 text-base leading-relaxed font-medium mb-10">
                                Conectamos departamentos de compras con proveedores calificados en Guatemala bajo protocolos de transparencia y auditoría continua.
                            </p>
                        </div>

                        <div className="space-y-4 max-w-lg">
                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-4">
                                <div className="p-2.5 rounded-lg bg-blue-600/20 text-blue-400 shrink-0">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">Homologación Rigurosa de Proveedores</h4>
                                    <p className="text-slate-400 text-xs mt-1">Verificación legal de NIT, Patente y Representación Legal antes de cotizar.</p>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-4">
                                <div className="p-2.5 rounded-lg bg-indigo-600/20 text-indigo-400 shrink-0">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">Apertura de Sobres Confidenciales</h4>
                                    <p className="text-slate-400 text-xs mt-1">Protocolo blindado de recepción de ofertas hasta la fecha oficial de evaluación.</p>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-4">
                                <div className="p-2.5 rounded-lg bg-emerald-600/20 text-emerald-400 shrink-0">
                                    <FileSpreadsheet className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">Generación Automática de Órdenes de Compra</h4>
                                    <p className="text-slate-400 text-xs mt-1">Exportación formal en PDF al adjudicar licitaciones multi-producto.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 pt-8 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-medium">
                        <span>Abastto B2B Guatemala &copy; {new Date().getFullYear()}</span>
                        <span>Seguridad TLS 1.3 / Encriptación 256-bit</span>
                    </div>
                </div>

                {/* Right Side - Clean Login Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                    <div className="w-full max-w-md space-y-8 bg-white dark:bg-[#0b0f19] p-8 sm:p-10 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 transition-colors">
                        {/* Mobile logo */}
                        <div className="lg:hidden flex justify-center mb-4">
                            <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                                    <BoxIcon className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white font-outfit">
                                    ABASTTO
                                </span>
                            </Link>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-outfit tracking-tight">Iniciar Sesión Corporativa</h2>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                                Ingrese sus credenciales autorizadas para ingresar al panel
                            </p>
                        </div>

                        <form action={dispatch} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                                    Correo Electrónico Empresarial
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium transition-all"
                                        placeholder="usuario@empresa.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        Contraseña
                                    </label>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <Lock className="h-4 w-4" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        className="w-full pl-10 pr-10 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium transition-all"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {errorMessage && (
                                <div className="text-red-600 dark:text-red-400 text-xs text-center bg-red-50 dark:bg-red-950/30 p-3 rounded-xl border border-red-200 dark:border-red-900/50 font-bold">
                                    {errorMessage}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/20"
                            >
                                Iniciar Sesión
                                <ArrowRight className="h-4 w-4" />
                            </button>

                            <p className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
                                ¿No tiene una cuenta corporativa aún?{' '}
                                <Link href="/register" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-bold transition-colors">
                                    Registrar Empresa
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
