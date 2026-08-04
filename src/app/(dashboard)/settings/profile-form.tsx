'use client'

import { useActionState, useState } from 'react'
import { updateCompanyProfile, SettingsState } from '@/actions/settings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { 
    AlertCircle, Save, Building2, FileText, MapPin, Layers, 
    Globe, Phone, Image as ImageIcon, CheckCircle2, Eye, ShieldCheck, ExternalLink
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const INDUSTRIES = [
    { value: 'AGRICULTURA', label: 'Agricultura y Campo' },
    { value: 'CONSTRUCCION', label: 'Construcción e Infraestructura' },
    { value: 'ESTADO_GOBIERNO', label: 'Estado y Entidades Públicas' },
    { value: 'MANUFACTURA', label: 'Manufactura e Industria' },
    { value: 'MEDICAL_SALUD', label: 'Salud y Farmacéutica' },
    { value: 'RETAIL_COMERCIO', label: 'Retail, Mayorista y Comercio' },
    { value: 'SERVICIOS_PROFESIONALES', label: 'Servicios Profesionales' },
    { value: 'TECNOLOGIA', label: 'Tecnología de la Información' },
    { value: 'TRANSPORTE_LOGISTICA', label: 'Transporte y Logística' },
    { value: 'OTRO', label: 'Otro Sector Corporativo' },
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
    const [logoUrl, setLogoUrl] = useState<string>(initialData.logo || '')

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setLogoUrl(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <form action={formAction} className="space-y-8">
            {/* Header Banner / Action Bar */}
            <div className="p-6 bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-slate-900/5 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-slate-900/60 rounded-3xl border border-blue-100 dark:border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                        {logoUrl ? (
                            <img 
                                src={logoUrl} 
                                alt="Logo Empresa" 
                                className="w-16 h-16 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-md" 
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-2xl shadow-md font-outfit">
                                {initialData.name?.[0]?.toUpperCase() || 'E'}
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white font-outfit">{initialData.name}</h2>
                            {initialData.isVerified && (
                                <Badge className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 text-[0.65rem] font-bold px-2.5 py-0.5">
                                    <ShieldCheck className="w-3 h-3 mr-1" /> Verificada
                                </Badge>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">NIT: {initialData.nit} | {initialData.department}</p>
                    </div>
                </div>

                <Link href={`/company/${initialData.id}`} target="_blank">
                    <Button type="button" variant="outline" className="bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 font-bold text-xs h-10 px-5 rounded-xl cursor-pointer shadow-xs gap-2 shrink-0">
                        <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        Ver Mi Perfil Público (Vista previa)
                        <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                    </Button>
                </Link>
            </div>

            {/* Logo Customization Card */}
            <div className="p-6 bg-slate-50/50 dark:bg-white/[0.02] rounded-3xl border border-slate-200 dark:border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Insignia / Logo Corporativo
                        </Label>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                            Carga la imagen de marca oficial que verán tus clientes y proveedores en la plataforma.
                        </p>
                    </div>
                </div>

                <input type="hidden" name="logo" value={logoUrl} />
                
                {!isReadOnly && (
                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                        <label className="w-full sm:w-auto text-center cursor-pointer px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white text-xs font-bold rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-all shadow-xs">
                            Cargar Imagen de Logo
                            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                        </label>
                        <span className="text-xs text-slate-400 font-medium">o pegue una URL directa:</span>
                        <Input 
                            type="url" 
                            placeholder="https://ejemplo.com/logo.png" 
                            value={logoUrl} 
                            onChange={(e) => setLogoUrl(e.target.value)} 
                            className="text-xs h-10 rounded-xl max-w-sm border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                        />
                    </div>
                )}
            </div>

            {/* Form Fields Grid */}
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
                        className="h-11 rounded-xl border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium text-xs focus:ring-2 focus:ring-blue-600"
                    />
                    {state.errors?.name && (
                        <p className="mt-1 text-xs font-bold text-rose-500">{state.errors.name[0]}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="nit" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> NIT (Identificación Tributaria)
                    </Label>
                    <Input
                        id="nit"
                        name="nit"
                        defaultValue={initialData.nit}
                        disabled={isReadOnly}
                        placeholder="Ej. 1234567-8"
                        required
                        className="h-11 rounded-xl border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium text-xs focus:ring-2 focus:ring-blue-600"
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
                        className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:[&_option]:bg-slate-900 dark:[&_option]:text-slate-100 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                        required
                    >
                        <option value="" disabled>Selecciona el sector...</option>
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
                        className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-900 dark:text-white dark:[&_option]:bg-slate-900 dark:[&_option]:text-slate-100 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                        required
                    >
                        <option value="" disabled>Selecciona el departamento...</option>
                        {DEPARTMENTS.map(dep => (
                            <option key={dep} value={dep}>{dep.replace('_', ' ')}</option>
                        ))}
                    </select>
                    {state.errors?.department && (
                        <p className="mt-1 text-xs font-bold text-rose-500">{state.errors.department[0]}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="website" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Sitio Web Corporativo
                    </Label>
                    <Input
                        id="website"
                        name="website"
                        type="url"
                        defaultValue={initialData.website || ''}
                        disabled={isReadOnly}
                        placeholder="https://www.tuempresa.com"
                        className="h-11 rounded-xl border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium text-xs focus:ring-2 focus:ring-blue-600"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Teléfono de Contacto Directo
                    </Label>
                    <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        defaultValue={initialData.phone || ''}
                        disabled={isReadOnly}
                        placeholder="+502 2200-0000"
                        className="h-11 rounded-xl border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium text-xs focus:ring-2 focus:ring-blue-600"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Descripción Comercial / Resumen Corporativo
                </Label>
                <Textarea
                    id="description"
                    name="description"
                    rows={4}
                    defaultValue={initialData.description || ''}
                    disabled={isReadOnly}
                    placeholder="Describa la actividad principal, especialidades, productos o servicios clave que ofrece su organización..."
                    className="rounded-2xl border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium text-xs focus:ring-2 focus:ring-blue-600 p-4 resize-none"
                />
            </div>

            {state.message && (
                <div className={`flex items-center gap-3 p-4 text-xs font-bold rounded-2xl border ${
                    state.message.includes('exitosamente')
                        ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50'
                        : 'text-rose-700 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50'
                }`}>
                    {state.message.includes('exitosamente') ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" /> : <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />}
                    <p>{state.message}</p>
                </div>
            )}

            {!isReadOnly && (
                <div className="pt-2 flex justify-end">
                    <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-8 rounded-xl cursor-pointer shadow-md shadow-blue-600/20 text-xs">
                        {isPending ? 'Guardando cambios...' : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Guardar Perfil Corporativo
                            </>
                        )}
                    </Button>
                </div>
            )}
        </form>
    )
}
