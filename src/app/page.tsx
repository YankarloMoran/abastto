"use client"

import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, BarChart3, Building2, FileText, Users, CheckCircle2, Sparkles } from "lucide-react";
import { motion, Variants, useInView } from "framer-motion";
import { HeroGraphic } from "@/components/landing/hero-graphic";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { useRef, useEffect, useState } from "react";

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

/**
 * Componente que anima un número incrementándolo gradualmente desde 0 hasta el valor objetivo.
 */
function AnimatedCounter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

/**
 * Componente principal de la página de inicio (Landing Page) de Abastto.
 * Lenguaje profesional, claro e intuitivo sin jerga técnica.
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1c] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300 overflow-x-hidden font-sans scroll-smooth">
      <Navbar />

      <main className="flex-1 flex flex-col items-center">
        {/* ═══════════════ HERO ═══════════════ */}
        <section className="relative w-full max-w-7xl mx-auto px-6 xl:px-8 py-16 lg:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-8 text-center lg:text-left z-10">
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-white/5 rounded-full text-blue-700 dark:text-blue-300 font-semibold text-sm border border-slate-200/80 dark:border-white/10 backdrop-blur-md shadow-sm">
              ✨ La red de negocios líder en Guatemala
            </motion.div>
            <motion.h1 variants={fadeIn} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] font-outfit">
              La red conectada para el <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400 dark:from-blue-400 dark:via-indigo-400 dark:to-sky-300">crecimiento de su empresa</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Encuentre proveedores, gestione presupuestos al instante y organice todos sus requerimientos comerciales en un solo lugar — potenciado por inteligencia artificial.
            </motion.p>
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link href="/register" className="group px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-2xl hover:bg-blue-500 hover:-translate-y-0.5 transition-all flex items-center gap-3 w-full sm:w-auto justify-center shadow-lg shadow-blue-600/20">
                Unirse a la red <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#features" className="px-8 py-4 text-lg font-semibold text-slate-700 dark:text-slate-200 bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl hover:bg-white dark:hover:bg-white/10 transition-all w-full sm:w-auto justify-center flex backdrop-blur-md shadow-sm">
                Descubrir más
              </Link>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative h-[420px] lg:h-[500px] flex items-center justify-center">
            <HeroGraphic />
          </motion.div>
        </section>

        {/* ═══════════════ STATS BAR ═══════════════ */}
        <section className="w-full bg-white dark:bg-[#0d1323] border-y border-slate-200 dark:border-slate-800/80">
          <div className="max-w-7xl mx-auto px-6 xl:px-8 py-12">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: 500, suffix: "+", label: "Empresas Registradas" },
                { value: 2400, suffix: "+", label: "Cotizaciones Procesadas" },
                { value: 98, suffix: "%", label: "Satisfacción" },
                { value: 15, prefix: "Q", suffix: "M+", label: "Transacciones Gestionadas" },
              ].map((stat, i) => (
                <motion.div key={i} variants={fadeIn} className="space-y-1">
                  <p className="text-3xl md:text-4xl font-extrabold text-blue-600 dark:text-blue-400 font-outfit">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} prefix={stat.prefix || ""} />
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════ FEATURES ═══════════════ */}
        <section id="features" className="w-full bg-slate-50 dark:bg-[#060b14] transition-colors scroll-mt-20 py-24">
          <div className="max-w-7xl mx-auto px-6 xl:px-8">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight font-outfit">
                Todo lo que su organización necesita, <span className="text-blue-600 dark:text-blue-400">simplificado</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
                Nuestra plataforma está diseñada para optimizar sus procesos y ahorrar tiempo en cada gestión comercial.
              </p>
            </div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {[
                { icon: ShieldCheck, title: "Proveedores Verificados", desc: "Acceda a una red de empresas de confianza para asegurar la calidad de sus suministros sin riesgos innecesarios.", colorClasses: "text-blue-600 dark:text-blue-400", bgClasses: "bg-blue-100 dark:bg-blue-500/10" },
                { icon: Zap, title: "Gestión Eficiente", desc: "Envíe sus requerimientos y reciba propuestas rápidamente, optimizando sus canales de comunicación.", colorClasses: "text-indigo-600 dark:text-indigo-400", bgClasses: "bg-indigo-100 dark:bg-indigo-500/10" },
                { icon: BarChart3, title: "Seguimiento Integral", desc: "Supervise sus pedidos y el estado de sus transacciones desde un panel claro y organizado.", colorClasses: "text-violet-600 dark:text-violet-400", bgClasses: "bg-violet-100 dark:bg-violet-500/10" },
              ].map((f, i) => (
                <motion.div key={i} variants={fadeIn} className="p-8 bg-white dark:bg-white/[0.03] rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                  <div className={`h-14 w-14 ${f.bgClasses} rounded-2xl flex items-center justify-center mb-6`}>
                    <f.icon className={`h-7 w-7 ${f.colorClasses}`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 font-outfit">{f.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{f.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════ CÓMO FUNCIONA ═══════════════ */}
        <section id="como-funciona" className="w-full bg-white dark:bg-[#030712] border-t border-slate-200 dark:border-white/5 py-24 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6 xl:px-8">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight font-outfit">
                Tan simple como <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">1, 2, 3</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">Desde la solicitud hasta la adjudicación, todo fluye en minutos.</p>
            </div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                { num: "01", title: "Publique su requerimiento", desc: "Describa su necesidad a través de nuestro formulario inteligente. Adjunte especificaciones y defina su presupuesto.", icon: FileText, colorClasses: "text-blue-600 dark:text-blue-400", bgClasses: "bg-blue-100 dark:bg-blue-500/10" },
                { num: "02", title: "Reciba propuestas", desc: "Proveedores verificados responderán con ofertas competitivas en cuestión de minutos.", icon: Users, colorClasses: "text-indigo-600 dark:text-indigo-400", bgClasses: "bg-indigo-100 dark:bg-indigo-500/10" },
                { num: "03", title: "Compare y decida", desc: "Nexus AI le asiste en el análisis de propuestas para identificar la mejor opción y formalizar el acuerdo.", icon: Sparkles, colorClasses: "text-violet-600 dark:text-violet-400", bgClasses: "bg-violet-100 dark:bg-violet-500/10" },
              ].map((s, i) => (
                <motion.div key={i} variants={fadeIn} className="relative group">
                  <div className={`mx-auto w-20 h-20 ${s.bgClasses} rounded-3xl flex items-center justify-center mb-6 border border-slate-200 dark:border-white/10 shadow-sm`}>
                    <s.icon className={`h-8 w-8 ${s.colorClasses}`} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 block">Paso {s.num}</span>
                  <h3 className="text-xl font-bold mb-3 font-outfit">{s.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs mx-auto font-medium text-sm">{s.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════ RED DE PROVEEDORES ═══════════════ */}
        <section id="red" className="w-full bg-slate-50 dark:bg-[#0a0f1c] border-t border-slate-200 dark:border-slate-800/80 py-24 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6 xl:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="space-y-8">
                <motion.div variants={fadeIn} className="inline-block px-3.5 py-1.5 bg-emerald-100/80 dark:bg-emerald-900/30 rounded-full text-emerald-700 dark:text-emerald-300 font-semibold text-xs uppercase tracking-wider border border-emerald-200/50 dark:border-emerald-800/50">
                  Red Verificada
                </motion.div>
                <motion.h2 variants={fadeIn} className="text-3xl md:text-5xl font-bold tracking-tight leading-tight font-outfit">
                  Una red confiable presente en <span className="text-blue-600 dark:text-blue-400">todo el país</span>
                </motion.h2>
                <motion.p variants={fadeIn} className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  Conectamos compradores y proveedores de toda Guatemala. Cada organización atraviesa un riguroso proceso de validación para garantizar la seriedad de sus operaciones.
                </motion.p>
                <motion.div variants={fadeIn} className="space-y-4">
                  {["Verificación de NIT y documentos legales", "Historial de cumplimiento visible", "Calificaciones y reseñas entre empresas", "Comunicación directa y segura"].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300 font-medium text-base">{item}</span>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative">
                <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-white/10 p-8 shadow-xl">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Building2, label: "Construcción", count: "85+" },
                      { icon: Zap, label: "Tecnología", count: "62+" },
                      { icon: ShieldCheck, label: "Manufactura", count: "110+" },
                      { icon: BarChart3, label: "Logística", count: "73+" },
                    ].map((sector, i) => (
                      <div key={i} className="bg-slate-50 dark:bg-white/5 rounded-2xl p-5 text-center border border-slate-100 dark:border-white/5">
                        <sector.icon className="w-7 h-7 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-slate-900 dark:text-white font-outfit">{sector.count}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">{sector.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Proveedores activos en toda <span className="font-bold text-slate-800 dark:text-white">Guatemala</span></p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════ PRECIOS ═══════════════ */}
        <section id="precios" className="w-full bg-white dark:bg-[#0d1323] border-t border-slate-200 dark:border-slate-800/80 py-24 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6 xl:px-8">
            <div className="text-center mb-16 space-y-4">
              <span className="inline-block px-3.5 py-1.5 bg-amber-100/80 dark:bg-amber-900/30 rounded-full text-amber-700 dark:text-amber-300 font-semibold text-xs uppercase tracking-wider border border-amber-200/50 dark:border-amber-800/50">
                Acceso Anticipado
              </span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight font-outfit">Comience sin <span className="text-blue-600 dark:text-blue-400">costo</span></h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Actualmente nos encontramos en fase de lanzamiento. Regístrese ahora y disfrute de acceso completo a nuestras herramientas comerciales.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8">
              {/* Free Plan */}
              <div className="bg-slate-50 dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-white/10 p-8 shadow-sm">
                <h3 className="text-xl font-bold mb-2 font-outfit">Plan Inicial</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 font-medium">Para organizaciones que desean explorar la red</p>
                <p className="text-4xl font-extrabold mb-6 font-outfit">Q0<span className="text-lg font-medium text-slate-400">/mes</span></p>
                <ul className="space-y-3 mb-8">
                  {["Hasta 5 cotizaciones/mes", "Acceso a la red de proveedores", "Dashboard básico", "Soporte por email"].map((f, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="block w-full py-3.5 text-center font-semibold text-blue-600 dark:text-blue-400 border-2 border-blue-200 dark:border-blue-800 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  Crear cuenta institucional
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-blue-600/20">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold font-outfit">Profesional</h3>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold backdrop-blur-sm">BETA GRATIS</span>
                  </div>
                  <p className="text-blue-100 text-sm mb-6 font-medium">Para equipos que necesitan máximo control</p>
                  <p className="text-4xl font-extrabold mb-1 font-outfit"><s className="text-blue-300/60 text-2xl">Q499</s> Q0<span className="text-lg font-medium text-blue-200">/mes</span></p>
                  <p className="text-xs text-blue-200 mb-6 font-medium">Durante la fase beta</p>
                  <ul className="space-y-3 mb-8">
                    {["Cotizaciones ilimitadas", "Nexus AI — asistente inteligente", "Analytics avanzados", "Gestión de equipo", "Soporte prioritario"].map((f, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-sm text-blue-100 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-blue-300 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/register" className="block w-full py-3.5 text-center font-semibold text-blue-700 bg-white rounded-2xl hover:bg-blue-50 transition-colors shadow-md">
                    Comenzar ahora — Es gratis
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ CTA FINAL ═══════════════ */}
        <section className="w-full bg-slate-900 dark:bg-[#060a14] border-t border-slate-800 py-24 text-center">
          <div className="max-w-4xl mx-auto px-6 xl:px-8 space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight font-outfit">
              ¿Desea optimizar los procesos de su <span className="text-blue-400">empresa</span>?
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">
              Únase a las entidades que ya fortalecen su cadena de suministro a través de Abastto.
            </p>
            <div className="flex justify-center pt-2">
              <Link href="/register" className="group px-10 py-4 text-lg font-semibold text-white bg-blue-600 rounded-2xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-3">
                Unirse a la red <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
