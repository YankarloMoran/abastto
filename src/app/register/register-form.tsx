"use client"

import React, { useActionState, useState, useEffect } from 'react'
import { registerUser } from '@/actions/register'
import { Building2, User, Mail, Lock, CheckCircle2, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function RegisterForm({ invitation }: { invitation?: any | null }) {
    const initialState = { message: '', errors: {} }
    const [state, dispatch] = useActionState(registerUser, initialState)
    const [showPassword, setShowPassword] = useState(false)
    const [step, setStep] = useState(invitation ? 2 : 1)

    // Si hay errores de validación en el estado, asegurar que estemos en el paso correcto para verlos
    useEffect(() => {
        if (Object.keys(state.errors || {}).length > 0) {
            const hasStep1Errors = state.errors?.nit || state.errors?.industry || state.errors?.companyName || state.errors?.department
            if (hasStep1Errors && !invitation) {
                setStep(1)
            } else {
                setStep(2)
            }
        }
    }, [state.errors, invitation])

    const nextStep = () => setStep(2)
    const prevStep = () => setStep(1)

    return (
        <div className="bg-white/80 dark:bg-white/[0.02] backdrop-blur-2xl py-8 px-6 shadow-2xl shadow-blue-900/5 sm:rounded-[2rem] sm:px-10 border border-slate-200/50 dark:border-white/10 transition-colors overflow-hidden relative z-10 w-full max-w-2xl">
            {/* Indicador de pasos */}
            {!invitation && (
                <div className="flex items-center justify-between mb-8 px-2 relative z-10">
                    <div className="flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${step === 1 ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 ring-4 ring-blue-500/20' : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'}`}>1</div>
                        <span className={`text-[10px] uppercase tracking-widest font-black ${step === 1 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>Empresa</span>
                    </div>
                    <div className="flex-1 h-[2px] bg-slate-100 dark:bg-slate-800/50 mx-4 mt-[-20px] rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ${step === 2 ? 'w-full' : 'w-0'}`} />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${step === 2 ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 ring-4 ring-blue-500/20' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>2</div>
                        <span className={`text-[10px] uppercase tracking-widest font-black ${step === 2 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>Usuario</span>
                    </div>
                </div>
            )}
            {invitation && (
                <div className="mb-6 bg-blue-500/10 border border-blue-500/20 p-5 rounded-2xl backdrop-blur-md relative z-10">
                    <div className="flex gap-3">
                        <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-blue-900 dark:text-blue-100">Has recibido una invitación corporativa</p>
                            <p className="text-sm text-blue-800 dark:text-blue-300/80 mt-1 font-medium">
                                Tu perfil se asociará automáticamente a la empresa <span className="font-bold text-blue-600 dark:text-blue-200">{invitation.company.name}</span> como {invitation.role === 'ADMIN' ? 'Administrador' : 'Miembro'}.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <form action={dispatch} className="relative z-10">
                {/* Token Oculto Si Fue Invitado */}
                {invitation && (
                    <input type="hidden" name="inviteToken" value={invitation.token} />
                )}

                {/* Step 1 - Always in DOM, hidden when not active */}
                <div className={step === 1 && !invitation ? 'block' : 'hidden'}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        <div className="pt-2 text-center mb-8">
                            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-3 font-outfit tracking-tight">
                                <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                Información Comercial
                            </h3>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 font-medium">Datos principales para identificar a su organización en la red.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* NIT Field */}
                            <div>
                                <label htmlFor="nit" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                    NIT <span className="text-slate-400 font-normal">(Identificación Tributaria)</span>
                                </label>
                                <input
                                    type="text"
                                    name="nit"
                                    id="nit"
                                    className="focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block w-full sm:text-sm border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-black/20 dark:text-white py-3 px-4 transition-all shadow-sm"
                                    placeholder="Ej. 1234567-8"
                                />
                                {state.errors?.nit && (
                                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">{state.errors.nit.join(', ')}</p>
                                )}
                            </div>

                            {/* Industry Field */}
                            <div>
                                <label htmlFor="industry" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Sector Industrial
                                </label>
                                <select
                                    id="industry"
                                    name="industry"
                                    className="focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block w-full sm:text-sm border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-black/20 dark:text-white py-3 px-4 transition-all shadow-sm appearance-none"
                                >
                                    <option value="">Seleccione el sector...</option>
                                    <option value="AGRICULTURA">Agricultura</option>
                                    <option value="CONSTRUCCION">Construcción</option>
                                    <option value="ESTADO_GOBIERNO">Entidad Gubernamental</option>
                                    <option value="MANUFACTURA">Manufactura y Producción</option>
                                    <option value="MEDICAL_SALUD">Salud y Servicios Médicos</option>
                                    <option value="RETAIL_COMERCIO">Comercio Minorista / Mayorista</option>
                                    <option value="SERVICIOS_PROFESIONALES">Servicios Profesionales</option>
                                    <option value="TECNOLOGIA">Tecnología de la Información</option>
                                    <option value="TRANSPORTE_LOGISTICA">Transporte y Logística</option>
                                    <option value="OTRO">Otro sector corporativo</option>
                                </select>
                                {state.errors?.industry && (
                                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">{state.errors.industry.join(', ')}</p>
                                )}
                            </div>

                            {/* Company Name Field */}
                            <div className="md:col-span-2">
                                <label htmlFor="companyName" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Razón Social
                                </label>
                                <input
                                    type="text"
                                    name="companyName"
                                    id="companyName"
                                    className="focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block w-full sm:text-sm border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-black/20 dark:text-white py-3 px-4 transition-all shadow-sm"
                                    placeholder="Ej. Constructora Los Andes S.A."
                                />
                                {state.errors?.companyName && (
                                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">{state.errors.companyName.join(', ')}</p>
                                )}
                            </div>

                            {/* Department Field */}
                            <div className="md:col-span-2">
                                <label htmlFor="department" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Ubicación (Sede Principal)
                                </label>
                                <select
                                    id="department"
                                    name="department"
                                    className="focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block w-full sm:text-sm border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-black/20 dark:text-white py-3 px-4 transition-all shadow-sm appearance-none"
                                >
                                    <option value="">Seleccione...</option>
                                    <option value="GUATEMALA">Guatemala</option>
                                    <option value="ALTA_VERAPAZ">Alta Verapaz</option>
                                    <option value="BAJA_VERAPAZ">Baja Verapaz</option>
                                    <option value="CHIMALTENANGO">Chimaltenango</option>
                                    <option value="CHIQUIMULA">Chiquimula</option>
                                    <option value="EL_PROGRESO">El Progreso</option>
                                    <option value="ESCUINTLA">Escuintla</option>
                                    <option value="HUEHUETENANGO">Huehuetenango</option>
                                    <option value="IZABAL">Izabal</option>
                                    <option value="JALAPA">Jalapa</option>
                                    <option value="JUTIAPA">Jutiapa</option>
                                    <option value="PETEN">Petén</option>
                                    <option value="QUETZALTENANGO">Quetzaltenango</option>
                                    <option value="QUICHE">Quiché</option>
                                    <option value="RETALHULEU">Retalhuleu</option>
                                    <option value="SACATEPEQUEZ">Sacatepéquez</option>
                                    <option value="SAN_MARCOS">San Marcos</option>
                                    <option value="SANTA_ROSA">Santa Rosa</option>
                                    <option value="SOLOLA">Sololá</option>
                                    <option value="SUCHITEPEQUEZ">Suchitepéquez</option>
                                    <option value="TOTONICAPAN">Totonicapán</option>
                                    <option value="ZACAPA">Zacapa</option>
                                </select>
                                {state.errors?.department && (
                                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">{state.errors.department.join(', ')}</p>
                                )}
                            </div>
                        </div>

                        {/* Selección del Rol Primario */}
                        <div className="pt-4">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 text-center">
                                Objetivo principal en la plataforma
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <label className="cursor-pointer group">
                                    <input type="radio" name="role" value="BUYER" className="peer sr-only" defaultChecked />
                                    <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] px-4 py-6 hover:border-blue-500/50 peer-checked:bg-blue-50/50 dark:peer-checked:bg-blue-500/10 peer-checked:border-blue-500 peer-checked:ring-1 peer-checked:ring-blue-500 transition-all text-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 peer-checked:opacity-100 transition-opacity" />
                                        <span className="relative z-10 block text-base font-bold text-slate-900 dark:text-white font-outfit">Comprador</span>
                                        <span className="relative z-10 mt-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">Publicar requerimientos</span>
                                    </div>
                                </label>

                                <label className="cursor-pointer group">
                                    <input type="radio" name="role" value="SUPPLIER" className="peer sr-only" />
                                    <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] px-4 py-6 hover:border-blue-500/50 peer-checked:bg-blue-50/50 dark:peer-checked:bg-blue-500/10 peer-checked:border-blue-500 peer-checked:ring-1 peer-checked:ring-blue-500 transition-all text-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 peer-checked:opacity-100 transition-opacity" />
                                        <span className="relative z-10 block text-base font-bold text-slate-900 dark:text-white font-outfit">Proveedor</span>
                                        <span className="relative z-10 mt-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">Atender cotizaciones</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="button"
                                onClick={nextStep}
                                className="group relative w-full flex justify-center py-4 border border-transparent rounded-2xl shadow-[0_10px_20px_rgba(37,99,235,0.2)] text-base font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="relative z-10 flex items-center">
                                    Siguiente Paso
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Step 2 - Always in DOM, hidden when not active */}
                <div className={step === 2 ? 'block' : 'hidden'}>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                            {invitation && (
                                <div className="mb-8 bg-blue-500/10 border border-blue-500/20 p-5 rounded-2xl backdrop-blur-md">
                                    <div className="flex gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                                        <div>
                                            <p className="text-sm font-bold text-blue-900 dark:text-blue-100">Invitación confirmada</p>
                                            <p className="text-sm text-blue-800 dark:text-blue-300/80 mt-1 font-medium">
                                                Completando acceso para <span className="font-bold text-blue-600 dark:text-blue-200">{invitation.company.name}</span>.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="pt-2 text-center mb-8">
                                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-3 font-outfit tracking-tight">
                                    <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    Cuenta Administradora
                                </h3>
                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 font-medium">Credenciales formales de acceso a la entidad.</p>
                            </div>
                            
                            <div className="space-y-5">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Nombre del representante
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" aria-hidden="true" />
                                        </div>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            autoComplete="name"
                                            required
                                            className="focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block w-full pl-12 sm:text-sm border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-black/20 dark:text-white py-3.5 transition-all shadow-sm"
                                            placeholder="Nombre completo"
                                        />
                                    </div>
                                    {state.errors?.name && (
                                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium" id="name-error">
                                            {state.errors.name.join(', ')}
                                        </p>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Dirección de correo electrónico
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" aria-hidden="true" />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            autoComplete="email"
                                            defaultValue={invitation?.email || ''}
                                            readOnly={!!invitation}
                                            required
                                            className={`focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block w-full pl-12 sm:text-sm border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-black/20 dark:text-white py-3.5 transition-all shadow-sm ${invitation ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            placeholder="correo@empresa.com"
                                        />
                                    </div>
                                    {state.errors?.email && (
                                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium" id="email-error">
                                            {state.errors.email.join(', ')}
                                        </p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Contraseña de seguridad
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" aria-hidden="true" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            id="password"
                                            required
                                            className="focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block w-full pl-12 pr-12 sm:text-sm border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-black/20 dark:text-white py-3.5 transition-all shadow-sm"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-blue-500 transition-colors"
                                            onMouseDown={() => setShowPassword(true)}
                                            onMouseUp={() => setShowPassword(false)}
                                            onMouseLeave={() => setShowPassword(false)}
                                            onTouchStart={() => setShowPassword(true)}
                                            onTouchEnd={() => setShowPassword(false)}
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {state.errors?.password && (
                                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium" id="password-error">
                                            {state.errors.password.join(', ')}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Hidden role inherited from company if invited */}
                            {invitation && (
                                <input type="hidden" name="role" value={invitation.role === 'ADMIN' ? 'ADMIN' : 'MEMBER'} />
                            )}

                            {state.message && (
                                <div className="rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-4 mt-6">
                                    <div className="flex">
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                                                {state.message}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="pt-8 flex gap-4">
                                {!invitation && (
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="flex-none px-5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all outline-none"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className="group relative flex-1 flex justify-center py-4 border border-transparent rounded-2xl shadow-[0_10px_20px_rgba(37,99,235,0.2)] text-base font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span className="relative z-10 flex items-center">
                                        Comenzar ahora
                                    </span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
            </form>

            <div className="mt-8 border-t border-slate-200/50 dark:border-white/5 pt-8 relative z-10">
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-transparent text-slate-500 dark:text-slate-400 font-medium">
                        ¿Ya tienes acceso corporativo?
                    </span>
                </div>

                <div className="mt-4 flex justify-center">
                    <Link href="/login" className="text-sm font-bold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 group transition-colors">
                        Iniciar Sesión
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
