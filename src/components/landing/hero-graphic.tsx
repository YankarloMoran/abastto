"use client"

import { motion } from "framer-motion"

const floatAnimation = (delay: number, duration: number = 6) => ({
  y: [-8, 8, -8],
  transition: { duration, repeat: Infinity, ease: "easeInOut" as const, delay }
})

export function HeroGraphic() {
  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center overflow-visible">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/15 dark:bg-blue-600/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-indigo-400/10 dark:bg-indigo-500/15 blur-[60px] rounded-full pointer-events-none" />

      {/* Main Dashboard Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 w-[320px] sm:w-[380px]"
      >
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-2xl shadow-slate-300/30 dark:shadow-black/40 p-5 sm:p-6">
          {/* Card Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-white">Dashboard</span>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            </div>
          </div>

          {/* Mini Chart Bars */}
          <div className="flex items-end gap-2 h-20 mb-5 px-1">
            {[40, 65, 45, 80, 55, 92, 70, 85, 60, 95, 75, 88].map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-t-sm bg-gradient-to-t from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300"
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.6, delay: 0.8 + i * 0.05 }}
              />
            ))}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Activas</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">24</p>
            </div>
            <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Ofertas</p>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">156</p>
            </div>
            <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Ahorro</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">18%</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Notification Card - Top Right */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0, ...floatAnimation(0) }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute top-8 -right-4 sm:top-4 sm:right-[-60px] z-20"
      >
        <div className="bg-white/90 dark:bg-white/10 backdrop-blur-xl rounded-xl border border-slate-200/80 dark:border-white/10 shadow-xl shadow-slate-200/40 dark:shadow-black/30 p-3.5 flex items-center gap-3 w-[200px]">
          <div className="w-9 h-9 bg-green-100 dark:bg-green-500/20 rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-800 dark:text-white">Oferta Aceptada</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Q 45,200.00</p>
          </div>
        </div>
      </motion.div>

      {/* Floating Supplier Card - Bottom Left */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0, ...floatAnimation(1.5, 7) }}
        transition={{ duration: 0.6, delay: 1.5 }}
        className="absolute bottom-12 -left-4 sm:bottom-16 sm:left-[-50px] z-20"
      >
        <div className="bg-white/90 dark:bg-white/10 backdrop-blur-xl rounded-xl border border-slate-200/80 dark:border-white/10 shadow-xl shadow-slate-200/40 dark:shadow-black/30 p-3.5 flex items-center gap-3 w-[210px]">
          <div className="w-9 h-9 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-800 dark:text-white">+3 Proveedores</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Nuevos esta semana</p>
          </div>
        </div>
      </motion.div>

      {/* Floating AI Badge - Top Left */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, ...floatAnimation(2, 5) }}
        transition={{ duration: 0.5, delay: 1.8 }}
        className="absolute top-16 -left-2 sm:top-10 sm:left-[-30px] z-20"
      >
        <div className="bg-gradient-to-br from-violet-500 to-blue-600 rounded-xl p-3 shadow-xl shadow-violet-500/25 flex items-center gap-2">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          <span className="text-[11px] font-bold text-white">Nexus AI</span>
        </div>
      </motion.div>

      {/* Connection Lines (decorative dots) */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-blue-400/40 dark:bg-blue-400/30 rounded-full"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          />
        ))}
      </div>
    </div>
  )
}
