'use client'

import { useState, useActionState, useEffect } from "react"
import { createInvitation, InviteState } from "@/actions/invitation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, UserPlus, Copy, Check, X, ShieldCheck } from "lucide-react"

export default function InviteMemberModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [copied, setCopied] = useState(false)

    // Using Action State
    const initialState: InviteState = { message: null, errors: {}, successLink: null }
    const [state, formAction, isPending] = useActionState(createInvitation, initialState)

    // Reset copy state when link changes
    useEffect(() => {
        if (state.successLink) {
            setCopied(false)
        }
    }, [state.successLink])

    const handleCopy = async () => {
        if (state.successLink) {
            await navigator.clipboard.writeText(state.successLink)
            setCopied(true)
            setTimeout(() => setCopied(false), 3000)
        }
    }

    return (
        <>
            <Button onClick={() => setIsOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-5 rounded-xl text-xs cursor-pointer shadow-md shadow-blue-600/20">
                <UserPlus className="w-4 h-4 mr-2" />
                Invitar Miembro
            </Button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/[0.02]">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-900 dark:text-white font-outfit text-base">Invitar al Equipo</h3>
                                    <p className="text-[0.7rem] text-slate-500 dark:text-slate-400 font-medium">Asigna accesos a tus colaboradores</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1.5 rounded-lg transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            {state.successLink ? (
                                <div className="space-y-4">
                                    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 rounded-2xl border border-emerald-200 dark:border-emerald-800/40">
                                        <div className="flex gap-3">
                                            <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-black text-sm">¡Invitación Creada!</p>
                                                <p className="text-xs mt-1 font-medium leading-relaxed">Comparte este enlace único con tu colega para que pueda registrarse asociado a tu empresa.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Enlace de Invitación Corporativa</Label>
                                        <div className="flex gap-2">
                                            <Input readOnly value={state.successLink} className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-mono text-xs h-11 rounded-xl" />
                                            <Button onClick={handleCopy} variant="outline" className="shrink-0 h-11 px-3 border-slate-200 dark:border-white/10 rounded-xl cursor-pointer">
                                                {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-slate-600 dark:text-slate-400" />}
                                            </Button>
                                        </div>
                                    </div>

                                    <Button onClick={() => setIsOpen(false)} className="w-full mt-4 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white font-bold h-11 rounded-xl text-xs cursor-pointer">
                                        Cerrar
                                    </Button>
                                </div>
                            ) : (
                                <form action={formAction} className="space-y-5">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="email" className="text-xs font-bold text-slate-700 dark:text-slate-300">Correo Electrónico Corporativo</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="ej. colega@miempresa.com"
                                            required
                                            className="h-11 rounded-xl border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs"
                                        />
                                        {state.errors?.email && (
                                            <p className="mt-1 text-xs text-red-500 font-bold">{state.errors.email[0]}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="role" className="text-xs font-bold text-slate-700 dark:text-slate-300">Rol y Permisos en la Plataforma</Label>
                                        <select
                                            id="role"
                                            name="role"
                                            className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white dark:[&_option]:bg-slate-900 dark:[&_option]:text-slate-100 px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                            required
                                            defaultValue="MEMBER"
                                        >
                                            <option value="MEMBER">👤 Miembro (Crear/gestionar licitaciones u ofertas)</option>
                                            <option value="ADMIN">🛡️ Administrador (Invitar miembros y editar perfil)</option>
                                            <option value="VIEWER">👁️ Observador / Auditor (Acceso solo lectura)</option>
                                            <option value="OWNER">👑 Dirección / Propietario (Control e invitaciones jerárquicas)</option>
                                        </select>
                                        {state.errors?.role && (
                                            <p className="mt-1 text-xs text-red-500 font-bold">{state.errors.role[0]}</p>
                                        )}
                                    </div>

                                    {state.message && !state.successLink && (
                                        <div className="flex items-center gap-2 p-3 text-xs rounded-xl text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 font-bold">
                                            <AlertCircle className="h-4 w-4 shrink-0" />
                                            <p>{state.message}</p>
                                        </div>
                                    )}

                                    <div className="pt-3 flex justify-end gap-3">
                                        <Button
                                            type="button"
                                            onClick={() => setIsOpen(false)}
                                            variant="outline"
                                            className="text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 rounded-xl h-10 px-5 text-xs font-bold cursor-pointer"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-6 rounded-xl text-xs cursor-pointer shadow-md shadow-blue-600/20">
                                            {isPending ? 'Generando...' : 'Generar Enlace de Invitación'}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
