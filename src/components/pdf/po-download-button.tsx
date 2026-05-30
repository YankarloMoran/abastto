'use client'

import { useState } from 'react'
import { FileText, FileDown, Loader2, X, ShieldCheck, Building2, ClipboardCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'
import { PurchaseOrderPDF, PDFRfq, PDFBid } from './purchase-order-pdf'
import { motion, AnimatePresence } from 'framer-motion'

const PDFDownloadLink = dynamic(
    () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
    { ssr: false, loading: () => <Button variant="outline" size="sm" disabled className="rounded-xl"><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Preparando PDF</Button> }
)

export function PoDownloadButton({ rfq, bid }: { rfq: PDFRfq, bid: PDFBid }) {
    const [showPreview, setShowPreview] = useState(false)
    const formattedDate = new Date().toLocaleDateString('es-GT', { year: 'numeric', month: 'long', day: 'numeric' })
    const totalAmount = Number(bid.amount)

    return (
        <>
            <div className="flex items-center gap-2">
                <Button 
                    onClick={() => setShowPreview(true)}
                    variant="outline" 
                    size="sm" 
                    className="cursor-pointer border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/20 font-bold rounded-xl h-9 px-4 transition-all hover:scale-[1.02] shadow-sm flex items-center gap-2"
                >
                    <FileText className="w-4 h-4" />
                    Ver Orden de Compra
                </Button>
            </div>

            {/* Premium Preview Modal */}
            <AnimatePresence>
                {showPreview && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto overflow-x-hidden">
                        {/* Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowPreview(false)}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
                        />

                        {/* Modal Container */}
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 350 }}
                            className="relative w-full max-w-3xl bg-white/95 dark:bg-[#0a0f24]/95 backdrop-blur-2xl border border-slate-200/60 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto leading-relaxed"
                        >
                            {/* Close icon */}
                            <button 
                                onClick={() => setShowPreview(false)}
                                className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                                aria-label="Cerrar previsualización"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Decorative glow */}
                            <div className="absolute top-0 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none"></div>

                            {/* Modal Header */}
                            <div className="flex items-center gap-3 border-b border-slate-200/50 dark:border-white/5 pb-4 shrink-0">
                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
                                    <ClipboardCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight font-outfit">
                                        Vista Previa de Orden de Compra
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Visualice los términos oficiales y valide antes de exportar
                                    </p>
                                </div>
                            </div>

                            {/* The PO sheet style */}
                            <div className="bg-slate-50/50 dark:bg-[#060a18]/45 border border-slate-200/50 dark:border-white/5 rounded-2xl p-6 sm:p-8 space-y-6 text-sm text-slate-800 dark:text-slate-200 shadow-inner max-w-full overflow-x-hidden font-sans">
                                {/* Sheet Title & Ref */}
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200/60 dark:border-white/5">
                                    <div>
                                        <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight font-outfit">ORDEN DE COMPRA</h4>
                                        <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-1 tracking-wider">
                                            PO-{rfq.id.substring(0, 8).toUpperCase()}
                                        </p>
                                    </div>
                                    <div className="text-left sm:text-right">
                                        <p className="font-bold text-slate-900 dark:text-white">{rfq.company?.name || 'Cliente sin registrar'}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">NIT: {rfq.company?.nit || '—'}</p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-bold">Emisión: {formattedDate}</p>
                                    </div>
                                </div>

                                {/* Entities Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Facturar y Entregar A</span>
                                        <div className="flex items-start gap-2.5">
                                            <Building2 className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">{rfq.company?.name}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Licitación: {rfq.title}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Proveedor Adjudicado</span>
                                        <div className="flex items-start gap-2.5">
                                            <div className="text-emerald-500 shrink-0 mt-0.5"><ShieldCheck className="w-4 h-4" /></div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">{bid.company?.name}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">NIT: {bid.company?.nit}</p>
                                                {bid.deliveryLeadTime && (
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                                        Plazo de entrega: <span className="font-bold text-slate-700 dark:text-slate-300">{bid.deliveryLeadTime}</span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Items list table style */}
                                <div className="pt-4 space-y-3">
                                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Detalle de Productos / Servicios</span>
                                    <div className="border border-slate-200/60 dark:border-white/5 rounded-xl overflow-hidden bg-white/40 dark:bg-black/15 backdrop-blur-sm">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-100 dark:bg-white/5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200/60 dark:border-white/5">
                                                    <th className="px-4 py-2">Descripción</th>
                                                    <th className="px-4 py-2 text-center">Cantidad</th>
                                                    <th className="px-4 py-2 text-right">Precio Unit.</th>
                                                    <th className="px-4 py-2 text-right">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200/50 dark:divide-white/5 text-xs">
                                                {bid.items?.map((item, i) => (
                                                    <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                                                        <td className="px-4 py-3">
                                                            <p className="font-bold text-slate-900 dark:text-white">{item.rfqItem?.name || 'Producto sin descripción'}</p>
                                                            {item.remarks && <p className="text-[10px] text-slate-500 dark:text-slate-400 italic mt-0.5">{item.remarks}</p>}
                                                        </td>
                                                        <td className="px-4 py-3 text-center font-semibold whitespace-nowrap">
                                                            {item.rfqItem?.quantity} {item.rfqItem?.unit}
                                                        </td>
                                                        <td className="px-4 py-3 text-right font-semibold whitespace-nowrap">
                                                            Q {Number(item.unitPrice).toFixed(2)}
                                                        </td>
                                                        <td className="px-4 py-3 text-right font-black text-slate-900 dark:text-white whitespace-nowrap">
                                                            Q {Number(item.totalPrice).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Grand total */}
                                <div className="flex justify-end pt-2">
                                    <div className="bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/5 px-6 py-4 rounded-xl flex items-center justify-between gap-12 w-full sm:w-auto shrink-0 shadow-sm">
                                        <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest font-outfit">TOTAL DE LA ORDEN:</span>
                                        <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight font-outfit">
                                            Q {totalAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer Controls */}
                            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-200/50 dark:border-white/5 shrink-0">
                                <Button 
                                    onClick={() => setShowPreview(false)}
                                    variant="ghost" 
                                    className="w-full sm:w-auto cursor-pointer text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 font-bold rounded-xl h-11 px-6 text-sm transition-all"
                                >
                                    Cerrar
                                </Button>
                                
                                <PDFDownloadLink
                                    document={<PurchaseOrderPDF rfq={rfq} bid={bid} date={new Date().toLocaleDateString()} />}
                                    fileName={`Orden-Compra-PO-${rfq.id.substring(0, 8).toUpperCase()}.pdf`}
                                >
                                    <Button className="w-full sm:w-auto cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold h-11 px-6 rounded-xl text-sm shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
                                        <FileDown className="w-4 h-4" />
                                        Descargar PDF Oficial
                                    </Button>
                                </PDFDownloadLink>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
