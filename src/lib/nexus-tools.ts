import { tool } from 'ai'
import { z } from 'zod'
import prisma from '@/lib/prisma'

// ─── Types ───────────────────────────────────────────────
interface UserContext {
  userId: string
  companyId: string
  role: string
  companyName?: string
}

// ─── Authenticated Tools (Dashboard) ────────────────────

export function getAuthenticatedTools(user: UserContext) {
  return {
    getRfqSummary: tool({
      description: 'Obtiene un resumen de las licitaciones (RFQs) del usuario. Usa esta herramienta cuando el usuario pregunte sobre sus licitaciones, solicitudes de cotización, o estado de sus procesos de compra.',
      inputSchema: z.object({
        status: z.enum(['all', 'OPEN', 'EVALUATING', 'AWARDED', 'CLOSED']).optional()
          .describe('Filtrar por estado. Si no se especifica, devuelve todas.'),
      }),
      execute: async ({ status }) => {
        const where: Record<string, unknown> = { companyId: user.companyId }
        if (status && status !== 'all') {
          where.status = status
        }

        const rfqs = await prisma.rfq.findMany({
          where,
          select: {
            id: true,
            title: true,
            status: true,
            budget: true,
            deadline: true,
            createdAt: true,
            _count: { select: { bids: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        })

        const total = await prisma.rfq.count({ where })

        return {
          total,
          showing: rfqs.length,
          rfqs: rfqs.map(r => ({
            id: r.id,
            title: r.title,
            status: r.status,
            budget: Number(r.budget),
            deadline: r.deadline.toISOString(),
            bidsCount: r._count.bids,
            createdAt: r.createdAt.toISOString(),
          })),
        }
      },
    }),

    searchSuppliers: tool({
      description: 'Busca proveedores en la red de Abastto por sector industrial o departamento de Guatemala. Usa esta herramienta cuando el usuario quiera encontrar proveedores.',
      inputSchema: z.object({
        industry: z.string().optional().describe('Sector industrial: AGRICULTURA, CONSTRUCCION, MANUFACTURA, MEDICAL_SALUD, RETAIL_COMERCIO, SERVICIOS_PROFESIONALES, TECNOLOGIA, TRANSPORTE_LOGISTICA'),
        department: z.string().optional().describe('Departamento de Guatemala: GUATEMALA, QUETZALTENANGO, ESCUINTLA, etc.'),
      }),
      execute: async ({ industry, department }) => {
        const where: Record<string, unknown> = {}
        if (industry) where.industry = industry
        if (department) where.department = department

        // Only show companies that have users with SUPPLIER role
        const suppliers = await prisma.company.findMany({
          where: {
            ...where,
            users: { some: { role: 'SUPPLIER' } },
          },
          select: {
            id: true,
            name: true,
            nit: true,
            industry: true,
            department: true,
            isVerified: true,
            _count: { select: { bids: true, receivedReviews: true } },
          },
          take: 10,
        })

        return {
          found: suppliers.length,
          suppliers: suppliers.map(s => ({
            name: s.name,
            nit: s.nit,
            industry: s.industry,
            department: s.department,
            isVerified: s.isVerified,
            totalBids: s._count.bids,
            totalReviews: s._count.receivedReviews,
          })),
        }
      },
    }),

    getCompanyInfo: tool({
      description: 'Obtiene información de la empresa del usuario actual. Usa cuando pregunte sobre su empresa, NIT, verificación, o datos corporativos.',
      inputSchema: z.object({}),
      execute: async () => {
        const company = await prisma.company.findUnique({
          where: { id: user.companyId },
          include: {
            _count: { select: { rfqs: true, bids: true, users: true, receivedReviews: true } },
          },
        })

        if (!company) return { error: 'Empresa no encontrada' }

        return {
          name: company.name,
          nit: company.nit,
          industry: company.industry,
          department: company.department,
          isVerified: company.isVerified,
          kycStatus: company.kycStatus,
          totalRfqs: company._count.rfqs,
          totalBids: company._count.bids,
          teamMembers: company._count.users,
          reviews: company._count.receivedReviews,
        }
      },
    }),

    getBidsSummary: tool({
      description: 'Obtiene un resumen de las ofertas/propuestas enviadas o recibidas. Usa cuando el usuario pregunte sobre ofertas, propuestas, o cotizaciones.',
      inputSchema: z.object({
        type: z.enum(['sent', 'received']).describe('"sent" para ofertas enviadas (proveedor), "received" para ofertas recibidas en mis RFQs (comprador).'),
      }),
      execute: async ({ type }) => {
        if (type === 'sent') {
          const bids = await prisma.bid.findMany({
            where: { companyId: user.companyId },
            select: {
              id: true,
              amount: true,
              status: true,
              createdAt: true,
              rfq: { select: { title: true, status: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
          })

          return {
            total: bids.length,
            bids: bids.map(b => ({
              rfqTitle: b.rfq.title,
              amount: Number(b.amount),
              bidStatus: b.status,
              rfqStatus: b.rfq.status,
              date: b.createdAt.toISOString(),
            })),
          }
        } else {
          const rfqs = await prisma.rfq.findMany({
            where: { companyId: user.companyId },
            select: {
              title: true,
              status: true,
              _count: { select: { bids: true } },
              bids: {
                select: {
                  amount: true,
                  status: true,
                  company: { select: { name: true } },
                },
                take: 5,
              },
            },
            orderBy: { createdAt: 'desc' },
            take: 5,
          })

          return {
            rfqs: rfqs.map(r => ({
              title: r.title,
              status: r.status,
              totalBids: r._count.bids,
              topBids: r.bids.map(b => ({
                supplier: b.company.name,
                amount: Number(b.amount),
                status: b.status,
              })),
            })),
          }
        }
      },
    }),

    navigateTo: tool({
      description: 'Genera un enlace de navegación para que el usuario vaya a una sección de la plataforma. Usa cuando diga "llévame a", "ir a", "muéstrame".',
      inputSchema: z.object({
        destination: z.enum([
          'dashboard', 'rfq', 'rfq-new', 'analytics',
          'network', 'settings', 'notifications', 'company',
        ]).describe('La página destino.'),
      }),
      execute: async ({ destination }) => {
        const routes: Record<string, { path: string; label: string }> = {
          'dashboard': { path: '/dashboard', label: 'Panel Principal' },
          'rfq': { path: '/rfq', label: 'Mis Licitaciones' },
          'rfq-new': { path: '/rfq/create', label: 'Crear Nueva Licitación' },
          'analytics': { path: '/analytics', label: 'Analíticas de Gasto' },
          'network': { path: '/network', label: 'Directorio de Proveedores' },
          'settings': { path: '/settings', label: 'Configuración' },
          'notifications': { path: '/notifications', label: 'Notificaciones' },
          'company': { path: '/company', label: 'Mi Empresa' },
        }
        return routes[destination] || { path: '/dashboard', label: 'Panel Principal' }
      },
    }),
  }
}

// ─── Public Tools (Landing Page) ─────────────────────────

export function getPublicTools() {
  return {
    platformFAQ: tool({
      description: 'Responde preguntas frecuentes sobre la plataforma Abastto. Usa esta herramienta para buscar la respuesta correcta a preguntas sobre qué es Abastto, cómo funciona, precios, registro, etc.',
      inputSchema: z.object({
        topic: z.enum([
          'what-is-abastto', 'how-it-works', 'pricing',
          'registration', 'security', 'support', 'features',
        ]).describe('El tema de la pregunta.'),
      }),
      execute: async ({ topic }) => {
        const faqs: Record<string, string> = {
          'what-is-abastto': 'Abastto es una plataforma B2B (Business-to-Business) de compras empresariales en Guatemala. Conectamos compradores con proveedores verificados para facilitar licitaciones, cotizaciones y gestión de compras en un solo lugar.',
          'how-it-works': '1) Regístrate como Comprador o Proveedor. 2) Los compradores publican Solicitudes de Cotización (RFQ) describiendo qué necesitan. 3) Los proveedores envían sus ofertas con precios y condiciones. 4) El comprador evalúa ofertas (con ayuda de IA) y adjudica al mejor. 5) Se confirma la entrega y ambas partes se evalúan mutuamente.',
          'pricing': 'Abastto es completamente gratuito durante la fase beta. No hay costos ocultos para publicar licitaciones ni enviar ofertas.',
          'registration': 'Puedes registrarte en /register con tu correo electrónico. Necesitarás datos básicos de tu empresa (nombre, NIT, sector industrial y departamento). El proceso toma menos de 2 minutos.',
          'security': 'Abastto verifica empresas mediante un proceso KYC (Conozca a su Cliente). Las empresas verificadas reciben una insignia de confianza. Todos los datos se almacenan de forma segura en servidores certificados.',
          'support': 'Puedes contactarnos a través de este chat (¡soy Nexus!), o enviando un correo a soporte. También puedes consultar las preguntas frecuentes en la plataforma.',
          'features': 'Abastto ofrece: Publicación de licitaciones multi-producto, sistema de ofertas competitivas, análisis de ofertas con IA (Nexus), directorio de proveedores verificados, sistema de reputación con reseñas, analíticas de gasto, mensajería entre empresas, exportación de datos CSV/PDF, y más.',
        }

        return { answer: faqs[topic] || 'No encontré información sobre ese tema. ¿Podrías reformular tu pregunta?' }
      },
    }),
  }
}
