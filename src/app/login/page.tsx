"use client"

import React, { useActionState, useState } from 'react'
import { authenticate } from '@/lib/actions'
import { ArrowRight, CheckCircle2, Lock, Mail, Eye, EyeOff, BoxIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'


/**
 * Página de inicio de sesión de Abastto.
 * Permite a los usuarios autenticarse usando su correo electrónico y contraseña.
 * Utiliza acciones de servidor (Server Actions) para manejar la autenticación.
 */
export default function LoginPage() {
    const [errorMessage, dispatch] = useActionState(authenticate, undefined)
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0f1c] transition-colors duration-300">
            <div className="flex-grow flex flex-col lg:flex-row">
            {/* Left Side - Hero/Testimonial */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#020617] text-white p-12 flex-col justify-between relative overflow-hidden">
                {/* Premium Background Elements */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10 mix-blend-luminosity" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none animate-pulse duration-[10s]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-600/20 blur-[100px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-2.5 mb-12 group cursor-pointer w-fit">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all">
                            <BoxIcon className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-3xl font-black tracking-tighter text-white font-outfit">
                            ABASTTO
                        </span>
                    </Link>

                    <h1 className="text-5xl font-extrabold mb-6 leading-[1.1] font-outfit text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">
                        Optimiza tu proceso de compras hoy.
                    </h1>

                    <div className="space-y-5">
                        <div className="flex items-center gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                                <CheckCircle2 className="h-4 w-4 text-blue-400" />
                            </div>
                            <span className="text-lg text-slate-200">Red de proveedores verificados</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                                <CheckCircle2 className="h-4 w-4 text-blue-400" />
                            </div>
                            <span className="text-lg text-slate-200">Gestión inteligente de cotizaciones</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                                <CheckCircle2 className="h-4 w-4 text-blue-400" />
                            </div>
                            <span className="text-lg text-slate-200">Flujo de transacciones seguro</span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 mt-12 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl">
                    <p className="text-lg text-slate-300 italic mb-6 leading-relaxed">
                        &quot;Abastto ha transformado cómo obtenemos materiales. La plataforma es intuitiva y la calidad de los proveedores inigualable.&quot;
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center font-bold text-lg shadow-inner border border-white/20">
                            JU
                        </div>
                        <div>
                            <p className="font-bold text-white">Juan Pérez</p>
                            <p className="text-sm text-blue-400">Gerente de Compras, TechCorp</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 dark:bg-[#030712] relative overflow-hidden transition-colors">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
                <div className="w-full max-w-md space-y-8 bg-white/80 dark:bg-white/[0.02] backdrop-blur-2xl p-10 rounded-[2rem] shadow-2xl border border-slate-200/50 dark:border-white/10 relative z-10">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex justify-center mb-6">
                        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all">
                                <BoxIcon className="w-7 h-7 text-white" />
                            </div>
                            <span className="text-3xl font-black tracking-tighter text-blue-600 dark:text-white font-outfit">
                                ABASTTO
                            </span>
                        </Link>
                    </div>

                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-outfit tracking-tight">Bienvenido de nuevo</h2>
                        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
                            Ingresa tus credenciales para acceder a tu panel
                        </p>
                    </div>

                    <form action={dispatch} className="mt-10 space-y-6">
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Correo electrónico
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="appearance-none block w-full pl-12 pr-4 py-3.5 border border-slate-200 dark:border-white/10 rounded-2xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-black/20 text-slate-900 dark:text-white transition-all shadow-sm"
                                        placeholder="correo@ejemplo.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Contraseña
                                    </label>
                                    <span className="text-sm font-medium text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 cursor-not-allowed transition-colors">
                                        ¿Olvidaste tu contraseña?
                                    </span>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        className="appearance-none block w-full pl-12 pr-12 py-3.5 border border-slate-200 dark:border-white/10 rounded-2xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-black/20 text-slate-900 dark:text-white transition-all shadow-sm"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-blue-500 transition-colors cursor-pointer"
                                        onMouseDown={() => setShowPassword(true)}
                                        onMouseUp={() => setShowPassword(false)}
                                        onMouseLeave={() => setShowPassword(false)}
                                        onTouchStart={() => setShowPassword(true)}
                                        onTouchEnd={() => setShowPassword(false)}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {errorMessage && (
                            <div className="text-red-600 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-500/10 p-4 rounded-2xl border border-red-200 dark:border-red-500/20 font-medium">
                                {errorMessage}
                            </div>
                        )}

                        <div className="pt-2">
                            <button type="submit" className="group relative w-full flex justify-center py-4 px-4 rounded-2xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all overflow-hidden shadow-[0_10px_20px_rgba(37,99,235,0.2)]">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="relative z-10 flex items-center">
                                    Iniciar Sesión
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                        </div>

                        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400 font-medium">
                            ¿No tienes una cuenta?{' '}
                            <Link href="/register" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                                Crear cuenta
                            </Link>
                        </p>
                    </form>
                </div>
                </div>
            </div>

        </div>
    )
}
