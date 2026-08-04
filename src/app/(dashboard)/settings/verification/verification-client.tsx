'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { uploadKycDocument, requestKycReview, quickToggleVerification } from '@/actions/kyc'
import { ShieldCheck, AlertTriangle, FileText, UploadCloud, Clock, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface CompanyData {
    id: string
    isVerified: boolean
    kycStatus: string
    documents: Array<{ type: string; url: string; status: string }>
}

export function VerificationClient({ company }: { company: CompanyData }) {
    const router = useRouter()
    const [submittingType, setSubmittingType] = useState<string | null>(null)
    const [isRequesting, setIsRequesting] = useState(false)
    const [isToggling, setIsToggling] = useState(false)

    const hasRtu = company.documents.some(d => d.type === 'RTU')
    const hasPatente = company.documents.some(d => d.type === 'PATENTE')
    const hasRep = company.documents.some(d => d.type === 'REPRESENTACION_LEGAL')
    const canRequestReview = hasRtu && hasPatente && hasRep && company.kycStatus === 'PENDING'

    async function handleUpload(e: React.FormEvent<HTMLFormElement>, type: string) {
        e.preventDefault()
        setSubmittingType(type)
        const formData = new FormData(e.currentTarget)
        
        try {
            const res = await uploadKycDocument(formData)
            if (res.success) {
                toast.success(res.message)
                router.refresh()
            } else {
                toast.error(res.message)
            }
        } catch (error) {
            toast.error("Error al procesar el archivo")
        } finally {
            setSubmittingType(null)
        }
    }

    async function handleRequestReview() {
        setIsRequesting(true)
        try {
            const res = await requestKycReview()
            if (res.success) {
                toast.success(res.message)
                router.refresh()
            } else {
                toast.error(res.message)
            }
        } catch (error) {
            toast.error("Error al solicitar revisión")
        } finally {
            setIsRequesting(false)
        }
    }

    async function handleQuickToggle() {
        setIsToggling(true)
        try {
            const res = await quickToggleVerification()
            if (res.success) {
                toast.success(res.message)
                router.refresh()
            } else {
                toast.error(res.message)
            }
        } catch (error) {
            toast.error("Error al cambiar estado")
        } finally {
            setIsToggling(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3 font-outfit">
                        <ShieldCheck className="w-7 h-7 text-blue-600 dark:text-blue-400 shrink-0" /> Verificación de Identidad y Empresa
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">Sube la documentación legal de tu organización para habilitar las gestiones comerciales protegidas.</p>
                </div>

                <Button
                    onClick={handleQuickToggle}
                    disabled={isToggling}
                    variant="outline"
                    className="border-dashed border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 font-bold hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-2xl h-11 px-5 cursor-pointer shrink-0 transition-all text-xs"
                >
                    {isToggling ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ShieldCheck className="w-4 h-4 mr-2 text-blue-500" />}
                    {company.isVerified ? "Desactivar Verificación (Pruebas)" : "Activar Verificación Rápida"}
                </Button>
            </div>

            <div className="p-5 bg-blue-50/80 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-2xl flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-xs font-black text-blue-900 dark:text-blue-200 uppercase tracking-widest">Protocolo de Confianza Abastto</h4>
                    <p className="text-xs md:text-sm text-blue-800/80 dark:text-blue-300/80 mt-1 font-medium leading-relaxed">Abastto conecta empresas verificadas. Para realizar solicitudes comerciales de forma segura, las organizaciones deben validar su expediente legal.</p>
                </div>
            </div>

            <Card className="border-slate-200 dark:border-white/10 shadow-sm bg-white dark:bg-slate-900 overflow-hidden rounded-3xl transition-colors">
                <CardHeader className="border-b dark:border-white/5 bg-slate-50/50 dark:bg-white/5 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <CardTitle className="text-slate-900 dark:text-white font-black text-lg">Estado de Verificación</CardTitle>
                            <CardDescription className="dark:text-slate-400 font-medium italic text-xs">Resumen de su validación empresarial</CardDescription>
                        </div>
                        <div>
                            {company.isVerified ? (
                                <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 font-black px-4 py-1.5 rounded-full flex items-center gap-1.5 text-xs">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Empresa Verificada
                                </Badge>
                            ) : company.kycStatus === 'REVIEW_REQUESTED' ? (
                                <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-800 font-black px-4 py-1.5 rounded-full text-xs">
                                    <Clock className="w-4 h-4 mr-1.5 inline" /> Revisión en Proceso
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 font-black px-4 py-1.5 rounded-full uppercase tracking-tighter text-xs">
                                    Acceso Restringido
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                    {!company.isVerified && company.kycStatus !== 'REVIEW_REQUESTED' && (
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b dark:border-white/5 pb-2">Documentos Requeridos</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <DocCard
                                    type="RTU"
                                    title="Registro Tributario (RTU)"
                                    isUploaded={hasRtu}
                                    isSubmitting={submittingType === 'RTU'}
                                    onSubmit={(e) => handleUpload(e, 'RTU')}
                                />
                                <DocCard
                                    type="PATENTE"
                                    title="Patente de Comercio"
                                    isUploaded={hasPatente}
                                    isSubmitting={submittingType === 'PATENTE'}
                                    onSubmit={(e) => handleUpload(e, 'PATENTE')}
                                />
                                <DocCard
                                    type="REPRESENTACION_LEGAL"
                                    title="Representación Legal"
                                    isUploaded={hasRep}
                                    isSubmitting={submittingType === 'REPRESENTACION_LEGAL'}
                                    onSubmit={(e) => handleUpload(e, 'REPRESENTACION_LEGAL')}
                                />
                            </div>

                            {canRequestReview && (
                                <div className="pt-6 border-t dark:border-white/10 mt-6">
                                    <Button
                                        onClick={handleRequestReview}
                                        disabled={isRequesting}
                                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-8 rounded-xl cursor-pointer text-xs"
                                    >
                                        {isRequesting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                        Solicitar Verificación Oficial
                                    </Button>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Al solicitar verificación, nuestro equipo revisará los documentos en un margen de 24 horas.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {company.isVerified && (
                        <div className="text-center py-8">
                            <ShieldCheck className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                            <h3 className="text-xl font-black text-slate-900 dark:text-white font-outfit">¡Tu empresa está verificada!</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-2 font-medium text-sm">Tienes acceso completo e ilimitado para publicar requerimientos, emitir cotizaciones y utilizar el copiloto Nexus AI.</p>
                        </div>
                    )}
                    
                    {company.kycStatus === 'REVIEW_REQUESTED' && !company.isVerified && (
                        <div className="text-center py-8 border-2 border-dashed border-amber-200 dark:border-amber-800/40 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20">
                            <Clock className="w-16 h-16 text-amber-500 mx-auto mb-4 animate-pulse" />
                            <h3 className="text-lg font-black text-amber-900 dark:text-amber-200 font-outfit">Tus documentos están en revisión</h3>
                            <p className="text-amber-800/80 dark:text-amber-300/80 max-w-md mx-auto mt-2 font-medium text-sm">Hemos recibido tus documentos. Nuestro equipo los validará a la brevedad. Recibirás una notificación inmediata al ser verificada.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

function DocCard({
    type,
    title,
    isUploaded,
    isSubmitting,
    onSubmit
}: {
    type: string
    title: string
    isUploaded: boolean
    isSubmitting: boolean
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}) {
    return (
        <div className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between min-w-0 ${isUploaded ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50' : 'bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 shadow-sm'}`}>
            <div className="flex items-center gap-3 mb-4 min-w-0">
                <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${isUploaded ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
                    <FileText className="w-5 h-5" />
                </div>
                <h4 className="text-xs md:text-sm font-black text-slate-900 dark:text-white leading-tight min-w-0 flex-1 truncate" title={title}>{title}</h4>
            </div>
            
            {isUploaded ? (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 pt-2">
                    <ShieldCheck className="w-4 h-4 shrink-0" /> Entregado y Verificado
                </div>
            ) : (
                <form onSubmit={onSubmit} className="flex flex-col gap-2.5 pt-1">
                    <input type="hidden" name="type" value={type} />
                    <input 
                        type="url" 
                        name="url" 
                        required 
                        placeholder="URL del documento (Drive, PDF...)" 
                        className="w-full text-xs px-3.5 py-2.5 border border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all min-w-0"
                    />
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        variant="secondary"
                        size="sm"
                        className="w-full text-xs font-bold h-9 bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white rounded-xl transition-all cursor-pointer truncate"
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin shrink-0" /> : <UploadCloud className="w-4 h-4 mr-2 shrink-0" />}
                        Vincular Expediente
                    </Button>
                </form>
            )}
        </div>
    )
}
