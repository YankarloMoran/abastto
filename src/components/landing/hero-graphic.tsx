"use client"

import { motion } from "framer-motion"
import { ShieldCheck, CheckCircle2, FileText, Sparkles, ArrowUpRight } from "lucide-react"

export function HeroGraphic() {
  return (
    <div className="relative w-full max-w-[460px] mx-auto">
      {/* Outer Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-[#0b0f19] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
      >
        {/* Card Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Licitación Activa #RFQ-842</span>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
            Recepción Abierta
          </span>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
              Suministro de Infraestructura de Cómputo & Servidores
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Emitida por: <strong className="text-slate-700 dark:text-slate-300">Corporación Tecnológica GT</strong> (NIT: 492810-3)
            </p>
          </div>

          {/* Budget & Items preview */}
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800/80">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Presupuesto Máximo</p>
              <p className="text-base font-black text-slate-900 dark:text-white mt-0.5">Q 125,000.00</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Partidas Solicitadas</p>
              <p className="text-base font-black text-blue-600 dark:text-blue-400 mt-0.5">3 Productos</p>
            </div>
          </div>

          {/* Received Offers */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">Ofertas Recibidas (3)</span>
              <span className="text-[11px] text-slate-400 font-medium">Evaluación en proceso</span>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                    P1
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Proveedor San José, S.A.</p>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      <ShieldCheck className="w-3 h-3" /> Homologado
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Q 118,500.00</p>
                  <p className="text-[10px] text-slate-400">Entrega: 3 días</p>
                </div>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                    P2
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Sistemas Globales GT</p>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      <ShieldCheck className="w-3 h-3" /> Homologado
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Q 122,000.00</p>
                  <p className="text-[10px] text-slate-400">Entrega: 5 días</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Analysis preview badge */}
          <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-100 dark:border-blue-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="text-xs font-bold text-blue-900 dark:text-blue-200">Recomendación Nexus IA lista</span>
            </div>
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center">
              Ver Análisis <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
