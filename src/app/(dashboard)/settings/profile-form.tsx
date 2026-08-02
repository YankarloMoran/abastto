'use client'

import { useActionState } from 'react'
import { updateCompanyProfile, SettingsState } from '@/actions/settings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Save, Building2, FileText, MapPin, Layers } from 'lucide-react'

const INDUSTRIES = [
    { value: 'AGRICULTURA', label: 'Agricultura' },
    { value: 'CONSTRUCCION', label: 'Construcción' },
    { value: 'ESTADO_GOBIERNO', label: 'Estado / Gobierno' },
    { value: 'MANUFACTURA', label: 'Manufactura' },
    { value: 'MEDICAL_SALUD', label: 'Médica y Salud' },
    { value: 'RETAIL_COMERCIO', label: 'Retail y Comercio' },
    { value: 'SERVICIOS_PROFESIONALES', label: 'Servicios Profesionales' },
    { value: 'TECNOLOGIA', label: 'Tecnología' },
    { value: 'TRANSPORTE_LOGISTICA', label: 'Transporte y Logística' },
    { value: 'OTRO', label: 'Otro' },
]

const DEPARTMENTS = [
    'ALTA_VERAPAZ', 'BAJA_VERAPAZ', 'CHIMALTENANGO', 'CHIQUIMULA',
    'EL_PROGRESO', 'ESCUINTLA', 'GUATEMALA', 'HUEHUETENANGO',
    'IZABAL', 'JALAPA', 'JUTIAPA', 'PETEN', 'QUETZALTENANGO',
    'QUICHE', 'RETALHULEU', 'SACATEPEQUEZ', 'SAN_MARCOS',
    'SANTA_ROSA', 'SOLOLA', 'SUCHITEPEQUEZ', 'TOTONICAPAN', 'ZACAPA'
]

export default function CompanyProfileForm({
    initialData,
    isReadOnly
}: {
    initialData: any,
    isReadOnly: boolean
}) {
    const initialState: SettingsState = { message: null, errors: {} }
    const [state, formAction, isPending] = useActionState(updateCompanyProfile, initialState)

    return (
        <form action={formAction} className="space-y-6 bg-white dark:bg-[#0b0f19] p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Razón Social o Nombre Comercial
                    </Label>
                    <Input
                        id="name"
                        name="name"
                        defaultValue={initialData.name}
                        disabled={isReadOnly}
                        required
                        className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 font-medium text-sm focus:ring-2 focus:ring-blue-600"
                    />
                    {state.errors?.name && (
                        <p className="mt-1 text-xs font-bold text-rose-500">{state.errors.name[0]}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="nit" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> NIT (Número de Identificación Tributaria)
                    </Label>
                    <Input
                        id="nit"
                        name="nit"
                        defaultValue={initialData.nit}
                        disabled={isReadOnly}
                        placeholder="Ej. 1234567-8"
                        required
                        className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 font-medium text-sm focus:ring-2 focus:ring-blue-600"
                    />
                    {state.errors?.nit && (
                        <p className="mt-1 text-xs font-bold text-rose-500">{state.errors.nit[0]}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="industry" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Sector Industrial
                    </Label>
                    <select
                        id="industry"
                        name="industry"
                        defaultValue={initialData.industry}
                        disabled={isReadOnly}
                        className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                    >
                        <option value="" disabled>Selecciona el sector</option>
                        {INDUSTRIES.map(ind => (
                            <option key={ind.value} value={ind.value}>{ind.label}</option>
                        ))}
                    </select>
                    {state.errors?.industry && (
                        <p className="mt-1 text-xs font-bold text-rose-500">{state.errors.industry[0]}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="department" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Ubicación Principal (Departamento)
                    </Label>
                    <select
                        id="department"
                        name="department"
                        defaultValue={initialData.department}
                        disabled={isReadOnly}
                        className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                    >
                        <option value="" disabled>Selecciona el departamento</option>
                        {DEPARTMENTS.map(dep => (
                            <option key={dep} value={dep}>{dep.replace('_', ' ')}</option>
                        ))}
                    </select>
                    {state.errors?.department && (
                        <p className="mt-1 text-xs font-bold text-rose-500">{state.errors.department[0]}</p>
                    )}
                </div>
            </div>

            {state.message && (
                <div className={`flex items-center gap-3 p-4 text-xs font-bold rounded-xl border ${state.message.includes('exitosamente')
                        ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900'
                        : 'text-rose-700 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900'
                    }`}>
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <p>{state.message}</p>
                </div>
            )}

            {!isReadOnly && (
                <div className="pt-2 flex justify-end">
                    <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700 font-bold h-10 px-6 rounded-xl cursor-pointer shadow-md shadow-blue-600/20">
                        {isPending ? 'Guardando cambios...' : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Guardar Perfil
                            </>
                        )}
                    </Button>
                </div>
            )}
        </form>
    )
}
