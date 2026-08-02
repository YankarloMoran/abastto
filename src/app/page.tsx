"use client"

import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, BarChart3, Building2, FileText, Users, CheckCircle2, Sparkles, Layers } from "lucide-react";
import { motion, Variants, useInView } from "framer-motion";
import { HeroGraphic } from "@/components/landing/hero-graphic";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { useRef, useEffect, useState } from "react";

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
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
    const duration = 1800;
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
 * Página principal de Abastto (Landing Page B2B Limpia y Profesional).
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300 overflow-x-hidden font-sans scroll-smooth">
      <Navbar />

      <main className="flex-1 flex flex-col items-center">
        {/* ═══════════════ HERO ═══════════════ */}
        <section className="relative w-full max-w-7xl mx-auto px-6 xl:px-8 py-16 lg:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6 text-center lg:text-left z-10">
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 rounded-full text-blue-700 dark:text-blue-300 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Infraestructura B2B Institucional en Guatemala
            </motion.div>
            <motion.h1 variants={fadeIn} className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] font-outfit text-slate-900 dark:text-white">
              La red conectada para el <span className="text-blue-600 dark:text-blue-400">abastecimiento inteligente</span> de su empresa
            </motion.h1>
            <motion.p variants={fadeIn} className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Encuentre proveedores homologados, publique licitaciones multi-producto y analice cotizaciones con el copiloto Nexus AI — con auditoría completa en Quetzales.
            </motion.p>
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link href="/register" className="px-8 py-4 text-base font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all flex items-center gap-3 w-full sm:w-auto justify-center shadow-lg shadow-blue-600/20 cursor-pointer">
                Registrar Empresa <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#features" className="px-8 py-4 text-base font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all w-full sm:w-auto justify-center flex shadow-sm">
                Conocer la Plataforma
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative flex items-center justify-center">
            <HeroGraphic />
          </motion.div>
        </section>

        {/* ═══════════════ STATS BAR ═══════════════ */}
        <section className="w-full bg-white dark:bg-[#0b0f19] border-y border-slate-200 dark:border-slate-800/80">
          <div className="max-w-7xl mx-auto px-6 xl:px-8 py-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: 500, suffix: "+", label: "Empresas Registradas" },
                { value: 2400, suffix: "+", label: "Cotizaciones Procesadas" },
                { value: 98, suffix: "%", label: "Cumplimiento Auditado" },
                { value: 15, prefix: "Q", suffix: "M+", label: "Transacciones Gestionadas" },
              ].map((stat, i) => (
                <motion.div key={i} variants={fadeIn} className="space-y-1">
                  <p className="text-3xl md:text-4xl font-extrabold text-blue-600 dark:text-blue-400 font-outfit">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} prefix={stat.prefix || ""} />
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════ FEATURES ═══════════════ */}
        <section id="features" className="w-full bg-[#f8fafc] dark:bg-[#090d16] transition-colors scroll-mt-20 py-20 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-6 xl:px-8">
            <div className="text-center mb-14 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Eficiencia Operativa</span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-outfit text-slate-900 dark:text-white">Todo lo que su departamento de compras necesita</h2>
              <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">Diseñado para estandarizar requerimientos, reducir tiempos de negociación y garantizar la transparencia jurídica.</p>
            </div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: ShieldCheck, title: "Homologación KYC Obligatoria", desc: "Verificación legal de RTU, Patente de Comercio y Representación Legal antes de que las empresas participen." },
                { icon: Zap, title: "Recepcion Blindada de Ofertas", desc: "Los montos y propuestas se mantienen bajo confidencialidad hasta la fecha de evaluación oficial." },
                { icon: BarChart3, title: "Análisis Comparativo con IA", desc: "El copiloto Nexus IA estructura desgloses de precios, calcula puntajes y emite recomendaciones ejecutivas." },
              ].map((f, i) => (
                <motion.div key={i} variants={fadeIn} className="p-7 bg-white dark:bg-[#0b0f19] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                  <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5 border border-blue-100 dark:border-blue-900/50">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 font-outfit text-slate-900 dark:text-white">{f.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">{f.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════ CÓMO FUNCIONA ═══════════════ */}
        <section id="como-funciona" className="w-full bg-white dark:bg-[#0b0f19] border-b border-slate-200 dark:border-slate-800 py-20 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6 xl:px-8">
            <div className="text-center mb-14 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Flujo Comercial</span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-outfit text-slate-900 dark:text-white">Proceso estructurado en 3 pasos</h2>
              <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">Desde la publicación de la licitación hasta la emisión de la orden de compra en PDF.</p>
            </div>
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { num: "01", title: "Publicación de RFQ Multi-Producto", desc: "Defina presupuestos en Quetzales, especificaciones por partida, lugar de entrega y fecha límite de recepción.", icon: FileText },
                { num: "02", title: "Recepción Confidencial de Ofertas", desc: "Proveedores homologados envían desglose de precios unitarios, tiempos de garantía y cartas de condiciones.", icon: Users },
                { num: "03", title: "Adjudicación y Orden de Compra", desc: "Seleccione la propuesta óptima con apoyo de IA y descargue la Orden de Compra oficial con firma digital.", icon: Sparkles },
              ].map((s, i) => (
                <motion.div key={i} variants={fadeIn} className="bg-[#f8fafc] dark:bg-[#090d16] p-7 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900">
                      Paso {s.num}
                    </span>
                    <s.icon className="h-5 w-5 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 font-outfit text-slate-900 dark:text-white">{s.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">{s.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════ CTA FINAL ═══════════════ */}
        <section className="w-full bg-[#0a0f1d] text-white py-16">
          <div className="max-w-4xl mx-auto px-6 xl:px-8 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-outfit">
              Modernice la gestión de abastecimiento de su empresa hoy.
            </h2>
            <p className="text-slate-400 text-base max-w-2xl mx-auto font-medium">
              Únase a las organizaciones que ya operan con mayor velocidad y respaldo en Guatemala.
            </p>
            <div className="pt-2">
              <Link href="/register" className="inline-flex items-center gap-3 px-8 py-3.5 text-base font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 cursor-pointer">
                Crear Perfil Institucional <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
