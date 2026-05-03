import { streamText, convertToModelMessages, stepCountIs } from 'ai'
import { google } from '@ai-sdk/google'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { openrouter, FREE_MODELS } from '@/lib/openrouter'
import { getAuthenticatedTools, getPublicTools } from '@/lib/nexus-tools'

// ─── Helpers ─────────────────────────────────────────────

/** Extract text content from a message (handles both SDK v6 parts format and legacy content string) */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractTextFromMessage(message: any): string {
  // SDK v6 UIMessage format: parts array with { type: 'text', text: '...' }
  if (message.parts && Array.isArray(message.parts)) {
    return message.parts
      .filter((p: { type: string; text?: string }) => p.type === 'text' && p.text)
      .map((p: { text: string }) => p.text)
      .join('')
  }
  // Legacy/fallback: direct content string
  if (typeof message.content === 'string') {
    return message.content
  }
  return ''
}

// ─── System Prompts ──────────────────────────────────────


function getAuthenticatedPrompt(userName: string, role: string, companyName: string, metrics?: { activeRfqs: number; totalBids: number; pendingAlerts: number }) {
  const now = new Date()
  const dateStr = now.toLocaleDateString('es-GT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const timeStr = now.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' })

  return `Eres Nexus, el asistente inteligente de Abastto — una plataforma B2B de compras empresariales en Guatemala.

Contexto actual:
- Fecha: ${dateStr}
- Hora: ${timeStr}
- Usuario: ${userName}
- Rol: ${role === 'BUYER' ? 'Director de Compras (Comprador)' : 'Ejecutivo Comercial (Proveedor)'}
- Empresa: ${companyName}
${metrics ? `- Licitaciones activas: ${metrics.activeRfqs}\n- Total de ofertas: ${metrics.totalBids}\n- Alertas pendientes: ${metrics.pendingAlerts}` : ''}

Herramientas disponibles — úsalas siempre que necesites datos reales:
- getRfqSummary: Consultar licitaciones del usuario
- getBidsSummary: Ver ofertas enviadas/recibidas
- searchSuppliers: Buscar proveedores por industria o departamento
- getCompanyInfo: Información de la empresa del usuario
- getMarketInsights: Estadísticas del mercado y promedios por categoría
- getActivityLog: Historial de actividad reciente
- getDeadlineAlerts: Licitaciones que cierran pronto (urgentes)
- getFinancialSummary: Resumen financiero completo (gastos, ahorros, ROI)
- navigateTo: Generar enlaces de navegación

Reglas obligatorias:
- Responde SIEMPRE en español
- Sé conciso, profesional y amigable
- Usa markdown para formatear (negritas, listas, tablas cuando sea útil)
- Si necesitas datos, usa las herramientas disponibles — NUNCA inventes datos
- Si el usuario pide algo que no puedes hacer, dile amablemente y sugiere alternativas
- Cuando uses navigateTo, muestra el enlace como: [Nombre de la página](ruta)
- No reveles información técnica interna (IDs, nombres de tablas, etc.)
- Preséntate brevemente solo en el primer mensaje de cada conversación
- Cuando muestres cifras monetarias, usa el formato Q (Quetzales) con separadores de miles
- Si detectas urgencias (deadlines próximos), alerta al usuario proactivamente`
}

const PUBLIC_PROMPT = `Eres Nexus, el asistente de bienvenida de Abastto — una plataforma B2B de compras empresariales en Guatemala.

Estás en la página principal ayudando a visitantes que aún no han iniciado sesión.

Solo puedes:
- Responder preguntas sobre qué es Abastto y cómo funciona
- Explicar el proceso de registro y licitación
- Hablar de las características y beneficios de la plataforma
- Invitar al usuario a registrarse

Reglas obligatorias:
- Responde SIEMPRE en español
- Sé amigable, entusiasta y conciso
- Usa markdown para formatear
- NO tienes acceso a datos privados de ningún usuario
- Si preguntan algo que requiere iniciar sesión, sugiere que se registren o inicien sesión
- Usa la herramienta platformFAQ para obtener información correcta antes de responder`

// ─── Route Handler ────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages, conversationId } = body

    // Authenticate (optional — landing page visitors won't have session)
    const session = await auth()
    const isAuthenticated = !!session?.user?.id

    // ── Resolve or create conversation ──
    let activeConversationId = conversationId as string | undefined

    if (activeConversationId) {
      // Validate that conversation exists and belongs to user
      const existing = await prisma.nexusConversation.findUnique({
        where: { id: activeConversationId },
        select: { userId: true },
      })
      if (!existing) {
        activeConversationId = undefined
      } else if (isAuthenticated && existing.userId && existing.userId !== session.user.id) {
        activeConversationId = undefined // Don't let users access other users' conversations
      }
    }

    if (!activeConversationId) {
      const convo = await prisma.nexusConversation.create({
        data: {
          userId: isAuthenticated ? session.user.id : null,
          title: null,
        },
      })
      activeConversationId = convo.id
    }

    // ── Save user message ──
    const lastUserMessage = messages[messages.length - 1]
    if (lastUserMessage?.role === 'user') {
      // Extract text content — SDK v6 uses `parts` array, but legacy uses `content` string
      const userText = extractTextFromMessage(lastUserMessage)

      if (userText) {
        await prisma.nexusMessage.create({
          data: {
            role: 'user',
            content: userText,
            conversationId: activeConversationId,
          },
        })

        // Auto-title conversation from first user message
        if (!conversationId) {
          const title = userText.slice(0, 80)
          await prisma.nexusConversation.update({
            where: { id: activeConversationId },
            data: { title },
          })
        }
      }
    }

    // ── Build tools and system prompt ──
    let tools: Record<string, ReturnType<typeof import('ai')['tool']>>
    let systemPrompt: string

    if (isAuthenticated && session.user.companyId) {
      const companyId = session.user.companyId
      const role = session.user.role || 'BUYER'

      const [company, activeRfqs, totalBids, pendingAlerts] = await Promise.all([
        prisma.company.findUnique({ where: { id: companyId }, select: { name: true } }),
        role === 'BUYER'
          ? prisma.rfq.count({ where: { companyId, status: { in: ['OPEN', 'EVALUATING'] } } })
          : prisma.rfq.count({ where: { status: 'OPEN', deadline: { gt: new Date() } } }),
        role === 'BUYER'
          ? prisma.bid.count({ where: { rfq: { companyId } } })
          : prisma.bid.count({ where: { companyId } }),
        prisma.rfq.count({
          where: {
            ...(role === 'BUYER' ? { companyId } : {}),
            status: 'OPEN',
            deadline: { gte: new Date(), lte: new Date(Date.now() + 48 * 60 * 60 * 1000) },
          }
        }),
      ])
      
      tools = {
        ...getAuthenticatedTools({
          userId: session.user.id,
          companyId,
          role,
          companyName: company?.name,
        }),
        ...getPublicTools(),
      } as any
      
      systemPrompt = getAuthenticatedPrompt(
        session.user.name || 'Usuario',
        role,
        company?.name || 'Tu empresa',
        { activeRfqs, totalBids, pendingAlerts }
      )
    } else {
      tools = getPublicTools() as any
      systemPrompt = PUBLIC_PROMPT
    }

    // ── Generate Stream ──
    try {
      // Usamos el mejor modelo oficial garantizado para Function Calling usando la API Key proporcionada
      console.log(`[Nexus] Requesting stream from Google Gemini API (gemini-2.5-flash)`)
      
      const result = streamText({
        model: google('gemini-2.5-flash'),
        system: systemPrompt,
        messages: await convertToModelMessages(messages),
        tools,
        stopWhen: stepCountIs(5),
        onFinish: async ({ text }) => {
          if (text && activeConversationId) {
            try {
               await prisma.nexusMessage.create({
                 data: { role: 'assistant', content: text, conversationId: activeConversationId },
               })
            } catch(e) {}
          }
        },
      })

      return result.toUIMessageStreamResponse({
        headers: {
          'X-Conversation-Id': activeConversationId,
        },
      })
    } catch (primaryError: any) {
      console.warn(`[Nexus] Primary model failed, falling back to openrouter/free: ${primaryError.message}`)
      
      try {
        const fallbackModel = 'openrouter/free'
        // Removemos tools en el fallback para evitar que un modelo aleatorio rompa el parsing
        const result = streamText({
          model: openrouter.chat(fallbackModel),
          system: systemPrompt + '\n\nNOTA: Las bases de datos externas están temporalmente indisponibles. Responde de forma natural basándote en tu conocimiento general.',
          messages: await convertToModelMessages(messages),
          stopWhen: stepCountIs(5),
          onFinish: async ({ text }) => {
            if (text && activeConversationId) {
              try {
                await prisma.nexusMessage.create({
                  data: { role: 'assistant', content: text, conversationId: activeConversationId },
                })
              } catch(e) {}
            }
          },
        })

        return result.toUIMessageStreamResponse({
          headers: {
            'X-Conversation-Id': activeConversationId,
          },
        })
      } catch (fallbackError: any) {
        console.error('[Nexus] Fallback stream initialization error:', fallbackError)
        return new Response(
          JSON.stringify({ error: 'Todos los modelos de IA están temporalmente no disponibles.' }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        )
      }
    }
  } catch (error: any) {
    console.error('[Nexus] Route error:', error)
    return new Response(
      JSON.stringify({ error: 'Error interno del asistente.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

// ─── GET: Load conversation history ───────────────────────

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const conversationId = searchParams.get('conversationId')
    const listAll = searchParams.get('list')

    const session = await auth()

    // List user's conversations
    if (listAll === 'true' && session?.user?.id) {
      const conversations = await prisma.nexusConversation.findMany({
        where: { userId: session.user.id },
        select: {
          id: true,
          title: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: 'desc' },
        take: 20,
      })
      return Response.json({ conversations })
    }

    // Load specific conversation messages
    if (conversationId) {
      const convo = await prisma.nexusConversation.findUnique({
        where: { id: conversationId },
        select: { userId: true },
      })

      // Security: only allow owner or anonymous conversations
      if (convo?.userId && session?.user?.id !== convo.userId) {
        return Response.json({ messages: [] })
      }

      const messages = await prisma.nexusMessage.findMany({
        where: { conversationId },
        select: {
          id: true,
          role: true,
          content: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'asc' },
      })

      return Response.json({ messages })
    }

    return Response.json({ messages: [] })
  } catch (error) {
    console.error('[Nexus] GET error:', error)
    return Response.json({ messages: [] }, { status: 500 })
  }
}
