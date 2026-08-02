'use server'

import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { logActivity } from '@/lib/activity-log'

export async function uploadKycDocument(formData: FormData) {
    const session = await auth()
    
    if (!session?.user?.companyId) {
        return { success: false, message: "No tienes una empresa vinculada." }
    }

    const type = formData.get('type') as string
    const url = formData.get('url') as string

    if (!type || !url) {
        return { success: false, message: "Faltan campos obligatorios." }
    }

    try {
        const existingDoc = await (prisma as any).companyDocument.findFirst({
            where: {
                companyId: session.user.companyId,
                type: type
            }
        })

        if (existingDoc) {
            await (prisma as any).companyDocument.update({
                where: { id: existingDoc.id },
                data: { url, status: 'PENDING' }
            })
        } else {
            await (prisma as any).companyDocument.create({
                data: {
                    type,
                    url,
                    companyId: session.user.companyId,
                    status: 'PENDING'
                }
            })
        }

        await logActivity({
            action: 'DOCUMENT_UPLOADED',
            description: `Documento ${type} subido para verificación`,
            userId: session.user.id,
            companyId: session.user.companyId,
            metadata: { documentType: type }
        })

        revalidatePath('/settings/verification')
        return { success: true, message: 'Documento vinculado correctamente.' }
    } catch (error) {
        console.error("Error al subir documento KYC:", error)
        return { success: false, message: "Ocurrió un error guardando el link del documento." }
    }
}

export async function requestKycReview(formData?: FormData) {
    const session = await auth()

    if (!session?.user?.companyId) {
        return { success: false, message: "No tienes una empresa vinculada." }
    }

    try {
        const docs = await (prisma as any).companyDocument.findMany({
            where: { companyId: session.user.companyId }
        })

        const hasRtu = docs.some((d: any) => d.type === 'RTU')
        const hasPatente = docs.some((d: any) => d.type === 'PATENTE')
        const hasRep = docs.some((d: any) => d.type === 'REPRESENTACION_LEGAL')

        if (!hasRtu || !hasPatente || !hasRep) {
            return { success: false, message: "Faltan documentos obligatorios para solicitar revisión." }
        }

        // Auto-Approving for Testing Purposes (Simulating Admin Approval)
        await (prisma as any).company.update({
            where: { id: session.user.companyId },
            data: { 
                kycStatus: 'APPROVED',
                isVerified: true
            }
        })

        await logActivity({
            action: 'KYC_SUBMITTED',
            description: 'Verificación KYC completada — empresa marcada como verificada',
            userId: session.user.id,
            companyId: session.user.companyId,
        })

        revalidatePath('/settings/verification')
        revalidatePath('/dashboard')
        return { success: true, message: '¡Empresa homologada con éxito!' }
    } catch (error) {
        console.error("Error al solicitar revisión KYC:", error)
        return { success: false, message: "Ocurrió un error procesando tu solicitud." }
    }
}

/**
 * Permite a cualquier usuario autenticado en modo desarrollo/demo o administración
 * activar/desactivar el estado de verificación de su empresa para pruebas end-to-end.
 */
export async function quickToggleVerification() {
    const session = await auth()
    if (!session?.user?.companyId) return { success: false, message: "No autenticado." }

    try {
        const company = await prisma.company.findUnique({
            where: { id: session.user.companyId },
            select: { isVerified: true }
        })

        if (!company) return { success: false, message: "Empresa no encontrada." }

        const newVerifiedState = !company.isVerified

        await prisma.company.update({
            where: { id: session.user.companyId },
            data: {
                isVerified: newVerifiedState,
                kycStatus: newVerifiedState ? 'APPROVED' : 'PENDING'
            }
        })

        revalidatePath('/settings/verification')
        revalidatePath('/dashboard')
        revalidatePath('/rfq')
        return { 
            success: true, 
            message: newVerifiedState ? 'Organización homologada para pruebas.' : 'Verificación reiniciada.' 
        }
    } catch (error) {
        return { success: false, message: "Error al cambiar estado de verificación." }
    }
}
