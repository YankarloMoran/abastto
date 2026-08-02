'use server'

import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { google } from '@ai-sdk/google'
import { generateText } from 'ai'

/**
 * Server Actions para Inteligencia Artificial en Abastto.
 * Implementa el análisis estructurado de ofertas (`analyzeOffers`),
 * autocompletado inteligente de licitaciones (`autoStructureRfq`),
 * asistencia de propuestas para proveedores (`generateSupplierBidProposal`),
 * y la generación de reportes de ahorro (`generateSpendAnalytics`).
 */
export async function autoStructureRfq(userPrompt: string) {
    try {
        const session = await auth()
        if (!session?.user) {
            return { success: false, message: 'Debes iniciar sesión.' }
        }

        if (!userPrompt || userPrompt.trim().length < 10) {
            return { success: false, message: 'Ingresa un requerimiento o texto con más detalles.' }
        }

        const prompt = `
Eres Nexus IA, un experto en abastecimiento comercial y estructuración de licitaciones en Guatemala.
Un comprador te ha enviado una descripción informal o lista de lo que necesita cotizar:
"${userPrompt}"

Tu tarea es analizar el requerimiento y extraer la información en un objeto JSON estructurado listo para publicar la licitación.

Reglas obligatorias:
1. El presupuesto ('budget') debe ser un número entero o decimal estimado en Quetzales. Si no se especifica, calcula una estimación razonable mayor a 0 basada en el mercado de Guatemala.
2. La categoría ('category') debe ser estrictamente una de las siguientes opciones: 'TECH', 'OFFICE', 'CONSTRUCTION', 'SERVICES', 'OTHER'.
3. Las partidas ('items') deben ser un array de objetos con las claves:
   - "name": Nombre del producto o servicio.
   - "quantity": Número entero positivo (mayor a 0).
   - "unit": Unidad de medida (ej. "Piezas", "Cajas", "Horas", "Lotes", "Metros").
4. REGLA CLAVE: NO INCLUYAS NINGÚN TIEMPO NI PLAZO DE ENTREGA. Los proveedores son los encargados de proponer su tiempo de entrega en sus cotizaciones.

Responde ÚNICAMENTE con un JSON estricto sin bloques de markdown (\`\`\`json), sin saludos, sin explicaciones:
{
  "title": "Título corporativo claro y conciso",
  "description": "Descripción técnica detallada especificando la necesidad del negocio y normas de entrega requeridas.",
  "budget": 5000,
  "category": "TECH",
  "items": [
    { "name": "Laptop Intel Core i7", "quantity": 5, "unit": "Piezas" }
  ]
}
`

        const result = await generateText({
            model: google('gemini-2.5-flash'),
            prompt,
        })

        let cleanJson = result.text.trim()
        if (cleanJson.startsWith('```json')) {
            cleanJson = cleanJson.replace(/^```json\n/, '').replace(/\n```$/, '')
        }
        if (cleanJson.startsWith('```')) {
            cleanJson = cleanJson.replace(/^```\n/, '').replace(/\n```$/, '')
        }

        const parsed = JSON.parse(cleanJson)

        return {
            success: true,
            data: parsed
        }
    } catch (error) {
        console.error("AutoStructureRfq Error:", error)
        return { success: false, message: 'Error procesando el requerimiento con IA.' }
    }
}

export async function generateSupplierBidProposal(rfqTitle: string, rfqDescription: string, userNotes?: string) {
    try {
        const session = await auth()
        if (!session?.user) {
            return { success: false, message: 'Debes iniciar sesión.' }
        }

        const prompt = `
Eres un consultor comercial experto. Ayuda a un proveedor a redactar una carta de presentación y propuesta formal para una licitación.

Licitación: "${rfqTitle}"
Descripción de la licitación: "${rfqDescription}"
${userNotes ? `Notas adicionales del proveedor: "${userNotes}"` : ''}

Escribe una propuesta formal, persuasiva y profesional en 2 párrafos cortos resaltando la garantía, compromiso de cumplimiento e invitando al comprador a evaluar la oferta. No incluyas marcadores de posición tipo [Nombre].
`

        const result = await generateText({
            model: google('gemini-2.5-flash'),
            prompt,
        })

        return {
            success: true,
            proposal: result.text.trim()
        }
    } catch (error) {
        console.error("GenerateSupplierBidProposal Error:", error)
        return { success: false, message: 'Error redactando la propuesta con IA.' }
    }
}

export async function analyzeOffers(rfqId: string) {
    try {
        const session = await auth()
        if (!session?.user || session.user.role !== 'BUYER') {
            return { success: false, message: 'No autorizado.' }
        }

        // 1. Fetch the RFQ and its Bids
        const rfq = await prisma.rfq.findUnique({
            where: { id: rfqId },
            include: {
                items: true,
                bids: {
                    include: {
                        company: { select: { name: true } },
                        items: { include: { rfqItem: true } }
                    }
                }
            }
        })

        if (!rfq) return { success: false, message: 'Solicitud no encontrada.' }
        if (rfq.companyId !== session.user.companyId) return { success: false, message: 'Tu empresa no es dueña de esta solicitud.' }
        if (rfq.bids.length === 0) return { success: false, message: 'No hay ofertas para analizar todavía.' }

        // 2. Construct the Prompt
        const rfqItemsText = rfq.items.map(item => `- ${item.quantity} ${item.unit} de ${item.name}`).join('\n')

        const bidDataText = rfq.bids.map((bid: any, index: number) => {
            const itemsText = bid.items.map((bItem: any) =>
                `  * ${bItem.rfqItem?.name}: Q ${Number(bItem.unitPrice).toFixed(2)} c/u (Total: Q ${Number(bItem.totalPrice).toFixed(2)})${bItem.remarks ? ` - Nota: ${bItem.remarks}` : ''}`
            ).join('\n')

            return `
--- Oferta #${index + 1} ---
* Bid ID: ${bid.id}
* Proveedor: ${bid.company?.name || 'Empresa Anónima'}
* Precio Total Ofertado: Q ${Number(bid.amount).toFixed(2)}
* Días de Validez de Oferta: ${bid.validityDays || 'No especificado'}
* Tiempo de Entrega Prometido por el Proveedor: ${bid.deliveryLeadTime || 'No especificado'}
* Carta/Desglose General: ${bid.coverLetter}
* Cotización por Ítem:
${itemsText}
`
        }).join('\n')

        const prompt = `
Eres un analista de compras experto en Guatemala.
Han publicado una Solicitud de Cotización (RFQ) multi-producto y han llegado múltiples ofertas.
Tu trabajo es analizar las ofertas, compararlas de manera objetiva y recomendar la mejor opción basándote en un balance entre precio unitario total, condiciones establecidas, y tiempo de entrega prometido por cada proveedor.

### Detalles de la Solicitud (Lo que el comprador necesita):
* Título: ${rfq.title}
* Descripción Técnica: ${rfq.description}
* Categoría: ${rfq.category || 'No especificada'}
* Lugar de Entrega: ${rfq.deliveryLocation || 'No especificado'}
* Condiciones de Pago Esperadas: ${rfq.paymentTerms || 'No especificadas'}
* Presupuesto Máximo Ofertado del Comprador: Q ${Number(rfq.budget).toFixed(2)}
* Productos Solicitados:
${rfqItemsText}

### Ofertas Recibidas de Proveedores:
${bidDataText}

### Instrucciones obligatorias para tu respuesta:
Eres una API estructurada. 
Tu única respuesta válida es un documento JSON estricto y parseable, sin backticks de markdown (\`\`\`json), sin formato externo, sin saludos, y sin explicaciones adicionales.
Debes devolver un JSON que cumpla EXACTAMENTE con esta estructura:
{
  "best_bid_id": "ID de la oferta (Bid ID) ganadora recomendada. Usa estrictamente el 'Bid ID' proporcionado.",
  "best_bid_name": "Nombre corporativo del proveedor recomendado.",
  "overall_verdict": "Resumen ejecutivo argumentando tu decisión final evaluando precio y tiempo de entrega, max 2 párrafos.",
  "red_flags": ["Cualquier riesgo o alerta roja que notes en las ofertas. Si no hay nada, array vacío."],
  "evaluations": [
    {
      "bid_id": "ID de la oferta",
      "provider_name": "Nombre del proveedor de esta oferta",
      "price_score": 90,
      "time_score": 85,
      "quality_score": 80,
      "pros": ["pro 1", "pro 2"],
      "cons": ["contra 1", "contra 2"]
    }
  ]
}
`

        const result = await generateText({
            model: google('gemini-2.5-flash'),
            prompt,
        })

        let cleanJson = result.text.trim()
        if (cleanJson.startsWith('```json')) {
            cleanJson = cleanJson.replace(/^```json\n/, '').replace(/\n```$/, '')
        }
        if (cleanJson.startsWith('```')) {
            cleanJson = cleanJson.replace(/^```\n/, '').replace(/\n```$/, '')
        }

        await prisma.rfq.update({
            where: { id: rfqId },
            data: { aiAnalysis: cleanJson }
        })

        return {
            success: true,
            analysis: cleanJson
        }

    } catch (error) {
        console.error("AI Error:", error)
        return { success: false, message: 'Ocurrió un error al contactar al motor de Inteligencia Artificial.' }
    }
}

export async function generateSpendAnalytics() {
    try {
        const session = await auth()
        if (!session?.user?.companyId || session.user.role !== 'BUYER') {
            return { success: false, message: 'No autorizado o no eres comprador.' }
        }

        const rfqs = await prisma.rfq.findMany({
            where: { 
                companyId: session.user.companyId,
                status: 'CLOSED'
            },
            include: {
                bids: {
                    where: { status: 'ACCEPTED' },
                    include: { company: true }
                }
            }
        })

        if (rfqs.length === 0) {
            return { success: false, message: 'No hay suficientes datos históricos. Necesitas cerrar al menos una licitación.' }
        }

        let totalBudget = 0
        let totalSpent = 0
        const vendorCount: Record<string, number> = {}

        const historicalData = rfqs.map(rfq => {
            const acceptedBid = rfq.bids[0]
            if (!acceptedBid) return null;
            
            totalBudget += Number(rfq.budget)
            const spent = Number(acceptedBid.amount)
            totalSpent += spent
            
            const vendorName = acceptedBid.company?.name || 'Proveedor Anónimo'
            vendorCount[vendorName] = (vendorCount[vendorName] || 0) + 1

            return `- Licitación "${rfq.title}": Presupuesto Q${Number(rfq.budget).toFixed(2)}, Adjudicado a ${vendorName} por Q${spent.toFixed(2)}.`
        }).filter(Boolean).join('\n')
        
        if (totalBudget === 0) {
            return { success: false, message: 'Las licitaciones cerradas no tienen presupuesto asignado para comparar.' }
        }

        const savings = totalBudget - totalSpent;
        const savingsPercentage = totalBudget > 0 ? (savings / totalBudget) * 100 : 0;

        const prompt = `
Eres un Analista Financiero y Director de Compras.
Tu objetivo es generar a partir del historial de compras de la empresa, un informe ejecutivo rápido resaltando el ahorro generado.

Datos Históricos Recientes (Licitaciones Cerradas):
${historicalData}

Resumen Matemático:
* Presupuesto Total Original: Q${totalBudget.toFixed(2)}
* Gasto Real Ejecutado: Q${totalSpent.toFixed(2)}
* Ahorro Logrado: Q${savings.toFixed(2)} (${savingsPercentage.toFixed(2)}%)

Instrucciones:
Escribe un reporte ejecutivo de 2 a 3 párrafos resaltando el ahorro financiero logrado y recomendaciones futuras.
`
        const result = await generateText({
            model: google('gemini-2.5-flash'),
            prompt,
        })

        return { 
            success: true, 
            analysis: result.text, 
            savings, 
            totalSpent,
            savingsPercentage 
        }

    } catch (error) {
        console.error("AI Analytics Error:", error)
        return { success: false, message: 'Error procesando analíticas financieras con IA.' }
    }
}
