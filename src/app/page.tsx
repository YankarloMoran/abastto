"use client"

import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, BarChart3, Building2, FileText, Users, CheckCircle2, Sparkles } from "lucide-react";
import { motion, Variants, useInView } from "framer-motion";
import { HeroGraphic } from "@/components/landing/hero-graphic";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { useRef, useEffect, useState } from "react";

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

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

const steps = [
  { num: "01", title: "Publica tu solicitud", desc: "Describe lo que necesitas con nuestro formulario inteligente. Adjunta especificaciones y define tu presupuesto.", icon: FileText, color: "blue" },
  { num: "02", title: "Recibe ofertas", desc: "Proveedores verificados responden con cotizaciones competitivas en cuestión de minutos.", icon: Users, color: "indigo" },
  { num: "03", title: "Compara y decide", desc: "Nexus AI te ayuda a analizar ofertas, identificar la mejor relación calidad-precio y cerrar el trato.", icon: Sparkles, color: "violet" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1c] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300 overflow-x-hidden font-sans scroll-smooth">
      <Navbar />

      <main className="flex-1 flex flex-col items-center">
        {/* ═══════════════ HERO ═══════════════ */}
        <section className="relative w-full max-w-7xl mx-auto px-6 xl:px-8 py-20 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 dark:bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-8 text-center lg:text-left z-10">
            <motion.div variants={fadeIn} className="inline-block px-4 py-2 bg-blue-100/50 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 font-medium text-sm border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-md">
              🚀 La plataforma B2B #1 de Guatemala
            </motion.div>
            <motion.h1 variants={fadeIn} className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
              La red conectada para <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 dark:from-blue-400 dark:to-sky-400">crecer tu negocio</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0">
              Encuentra proveedores, solicita presupuestos al instante y organiza todas tus compras corporativas en un solo lugar — potenciado por inteligencia artificial.
            </motion.p>
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link href="/register" className="group px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-500 hover:-translate-y-1 transition-all shadow-[0_10px_20px_rgba(37,99,235,0.2)] flex items-center gap-3 w-full sm:w-auto justify-center">
                Únete a la red <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#features" className="px-8 py-4 text-lg font-semibold text-slate-700 dark:text-slate-200 bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-all w-full sm:w-auto justify-center flex backdrop-blur-sm">
                Descubre más
              </Link>
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }} className="relative h-[400px] lg:h-[600px] flex items-center justify-center pointer-events-none lg:pointer-events-auto">
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
                  <p className="text-3xl md:text-4xl font-extrabold text-blue-600 dark:text-blue-400">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} prefix={stat.prefix || ""} />
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════ FEATURES ═══════════════ */}
        <section id="features" className="w-full relative bg-slate-50 dark:bg-[#0a0f1c] transition-colors scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6 xl:px-8 py-24">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Todo lo que necesitas, <span className="text-blue-600 dark:text-blue-400">simplificado</span></h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Nuestra plataforma está diseñada para quitarte dolores de cabeza y ahorrar tiempo en cada cotización.</p>
            </div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {[
                { icon: ShieldCheck, title: "Proveedores Seguros", desc: "Evita sorpresas. Formamos una red de empresas de confianza para que consigas la mejor calidad sin tomar riesgos innecesarios.", color: "blue" },
                { icon: Zap, title: "Cotizaciones Rápidas", desc: "Dinos qué requieres y recibe presupuestos en cuestión de minutos. El proceso te ahorrará horas de llamadas y correos.", color: "indigo" },
                { icon: BarChart3, title: "Control Centralizado", desc: "Supervisa tus pedidos, pagos y el estado de tu logística desde un panel claro y organizado. Todo queda registrado.", color: "violet" },
              ].map((f, i) => (
                <motion.div key={i} variants={fadeIn} className={`p-8 bg-white dark:bg-[#111827] rounded-3xl border border-slate-100 dark:border-white/5 hover:border-${f.color}-500/30 hover:shadow-2xl hover:shadow-${f.color}-500/10 hover:-translate-y-2 transition-all duration-300 group`}>
                  <div className={`h-14 w-14 bg-${f.color}-100 dark:bg-${f.color}-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-${f.color}-600 group-hover:scale-110 transition-all duration-300`}>
                    <f.icon className={`h-7 w-7 text-${f.color}-600 dark:text-${f.color}-400 group-hover:text-white transition-colors`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{f.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════ CÓMO FUNCIONA ═══════════════ */}
        <section id="como-funciona" className="w-full bg-white dark:bg-[#0d1323] border-t border-slate-200 dark:border-slate-800/80 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6 xl:px-8 py-24">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Tan simple como <span className="text-blue-600 dark:text-blue-400">1, 2, 3</span></h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Desde la solicitud hasta la adjudicación, todo fluye en minutos.</p>
            </div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connecting line (desktop) */}
              <div className="hidden md:block absolute top-24 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-blue-300 via-indigo-300 to-violet-300 dark:from-blue-700 dark:via-indigo-700 dark:to-violet-700" />
              {steps.map((s, i) => (
                <motion.div key={i} variants={fadeIn} className="relative text-center group">
                  <div className={`mx-auto w-16 h-16 bg-${s.color}-100 dark:bg-${s.color}-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-${s.color}-600 group-hover:scale-110 transition-all duration-300 relative z-10 border-4 border-white dark:border-[#0d1323]`}>
                    <s.icon className={`h-7 w-7 text-${s.color}-600 dark:text-${s.color}-400 group-hover:text-white transition-colors`} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-300 dark:text-slate-600 mb-2 block">Paso {s.num}</span>
                  <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════ RED DE PROVEEDORES ═══════════════ */}
        <section id="red" className="w-full bg-slate-50 dark:bg-[#0a0f1c] border-t border-slate-200 dark:border-slate-800/80 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6 xl:px-8 py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="space-y-8">
                <motion.div variants={fadeIn} className="inline-block px-3 py-1.5 bg-emerald-100/60 dark:bg-emerald-900/30 rounded-full text-emerald-700 dark:text-emerald-300 font-semibold text-xs uppercase tracking-wider border border-emerald-200/50 dark:border-emerald-800/50">
                  Red verificada
                </motion.div>
                <motion.h2 variants={fadeIn} className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                  Una red de confianza en <span className="text-blue-600 dark:text-blue-400">22 departamentos</span>
                </motion.h2>
                <motion.p variants={fadeIn} className="text-lg text-slate-600 dark:text-slate-400">
                  Conectamos compradores y proveedores de toda Guatemala. Cada empresa pasa por un proceso de validación para garantizar calidad y seriedad.
                </motion.p>
                <motion.div variants={fadeIn} className="space-y-4">
                  {["Verificación de NIT y documentos legales", "Historial de cumplimiento visible", "Calificaciones y reseñas entre empresas", "Comunicación directa y segura"].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{item}</span>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative">
                <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-white/5 p-8 shadow-xl">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Building2, label: "Construcción", count: "85+" },
                      { icon: Zap, label: "Tecnología", count: "62+" },
                      { icon: ShieldCheck, label: "Manufactura", count: "110+" },
                      { icon: BarChart3, label: "Logística", count: "73+" },
                    ].map((sector, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1 }} className="bg-slate-50 dark:bg-white/5 rounded-2xl p-5 text-center hover:bg-blue-50 dark:hover:bg-blue-500/5 transition-colors group cursor-default">
                        <sector.icon className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{sector.count}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">{sector.label}</p>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Proveedores activos en toda <span className="font-bold text-slate-700 dark:text-white">Guatemala</span></p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════ PRECIOS ═══════════════ */}
        <section id="precios" className="w-full bg-white dark:bg-[#0d1323] border-t border-slate-200 dark:border-slate-800/80 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6 xl:px-8 py-24">
            <div className="text-center mb-16 space-y-4">
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="inline-block px-3 py-1.5 bg-amber-100/60 dark:bg-amber-900/30 rounded-full text-amber-700 dark:text-amber-300 font-semibold text-xs uppercase tracking-wider border border-amber-200/50 dark:border-amber-800/50">
                Acceso anticipado
              </motion.div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Empieza <span className="text-blue-600 dark:text-blue-400">gratis</span></h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Estamos en fase beta. Regístrate ahora y disfruta acceso completo sin costo mientras dure.</p>
            </div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8">
              {/* Free Plan */}
              <motion.div variants={fadeIn} className="bg-slate-50 dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-white/5 p-8 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold mb-2">Inicio</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Para empresas que quieren explorar la red</p>
                <p className="text-4xl font-extrabold mb-6">Q0<span className="text-lg font-medium text-slate-400">/mes</span></p>
                <ul className="space-y-3 mb-8">
                  {["Hasta 5 cotizaciones/mes", "Acceso a la red de proveedores", "Dashboard básico", "Soporte por email"].map((f, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="block w-full py-3.5 text-center font-semibold text-blue-600 dark:text-blue-400 border-2 border-blue-200 dark:border-blue-800 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  Crear cuenta gratis
                </Link>
              </motion.div>
              {/* Pro Plan */}
              <motion.div variants={fadeIn} className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-600/20">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 blur-[40px] rounded-full pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold">Profesional</h3>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold backdrop-blur-sm">BETA GRATIS</span>
                  </div>
                  <p className="text-blue-200 text-sm mb-6">Para equipos que necesitan máximo control</p>
                  <p className="text-4xl font-extrabold mb-1"><s className="text-blue-300/60 text-2xl">Q499</s> Q0<span className="text-lg font-medium text-blue-200">/mes</span></p>
                  <p className="text-xs text-blue-200 mb-6">Durante la fase beta</p>
                  <ul className="space-y-3 mb-8">
                    {["Cotizaciones ilimitadas", "Nexus AI — asistente inteligente", "Analytics avanzados", "Gestión de equipo", "API e integraciones", "Soporte prioritario"].map((f, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-sm text-blue-100">
                        <CheckCircle2 className="w-4 h-4 text-blue-300 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/register" className="block w-full py-3.5 text-center font-semibold text-blue-700 bg-white rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
                    Comenzar ahora — Es gratis
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════ CTA FINAL ═══════════════ */}
        <section className="w-full bg-slate-900 dark:bg-[#060a14] border-t border-slate-800">
          <div className="max-w-4xl mx-auto px-6 xl:px-8 py-24 text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="space-y-8">
              <motion.h2 variants={fadeIn} className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                ¿Listo para transformar tus <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-400">compras corporativas</span>?
              </motion.h2>
              <motion.p variants={fadeIn} className="text-lg text-slate-400 max-w-2xl mx-auto">
                Únete a cientos de empresas que ya optimizan su cadena de suministro con Abastto.
              </motion.p>
              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/register" className="group px-10 py-4 text-lg font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-500 hover:-translate-y-1 transition-all shadow-[0_10px_30px_rgba(37,99,235,0.3)] flex items-center gap-3">
                  Comenzar gratis <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
