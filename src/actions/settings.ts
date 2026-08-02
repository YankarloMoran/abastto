'use server'

import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const CompanyProfileSchema = z.object({
    name: z.string().min(2, { message: 'La Razón Social / Nombre debe tener al menos 2 caracteres.' }),
    nit: z.string().regex(/^[0-9]+(-[0-9A-Z])?$/, { message: 'El NIT debe tener un formato válido (Ej: 123456-7 o 1234567).' }),
    logo: z.string().optional().nullable(),
    description: z.string().max(1000, { message: 'La descripción no puede exceder los 1000 caracteres.' }).optional().nullable(),
    website: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    industry: z.enum([
        'AGRICULTURA', 'CONSTRUCCION', 'ESTADO_GOBIERNO', 'MANUFACTURA',
        'MEDICAL_SALUD', 'RETAIL_COMERCIO', 'SERVICIOS_PROFESIONALES',
        'TECNOLOGIA', 'TRANSPORTE_LOGISTICA', 'OTRO'
    ]),
    department: z.enum([
        'ALTA_VERAPAZ', 'BAJA_VERAPAZ', 'CHIMALTENANGO', 'CHIQUIMULA',
        'EL_PROGRESO', 'ESCUINTLA', 'GUATEMALA', 'HUEHUETENANGO',
        'IZABAL', 'JALAPA', 'JUTIAPA', 'PETEN', 'QUETZALTENANGO',
        'QUICHE', 'RETALHULEU', 'SACATEPEQUEZ', 'SAN_MARCOS',
        'SANTA_ROSA', 'SOLOLA', 'SUCHITEPEQUEZ', 'TOTONICAPAN', 'ZACAPA'
    ])
})

export type SettingsState = {
    errors?: {
        name?: string[]
        nit?: string[]
        industry?: string[]
        department?: string[]
        logo?: string[]
        description?: string[]
        website?: string[]
        phone?: string[]
    }
    message?: string | null
}

export async function updateCompanyProfile(prevState: SettingsState, formData: FormData): Promise<SettingsState> {
    try {
        const session = await auth()
        if (!session?.user || !session.user.companyId) {
            return { message: 'Debes iniciar sesión para realizar esta acción.' }
        }

        // Must be OWNER or ADMIN to edit company details
        if (session.user.companyRole !== 'OWNER' && session.user.companyRole !== 'ADMIN') {
            return { message: 'No tienes permisos suficientes (Requieres ser ADMIN o OWNER) para editar el perfil de la empresa.' }
        }

        const data = {
            name: formData.get('name'),
            nit: formData.get('nit'),
            logo: formData.get('logo') || null,
            description: formData.get('description') || null,
            website: formData.get('website') || null,
            phone: formData.get('phone') || null,
            industry: formData.get('industry'),
            department: formData.get('department'),
        }

        const validatedFields = CompanyProfileSchema.safeParse(data)

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                message: 'Faltan campos o son inválidos. Revisa el formulario.'
            }
        }

        const { name, nit, logo, description, website, phone, industry, department } = validatedFields.data

        // Check if NIT is already used by ANOTHER company
        const existingCompany = await prisma.company.findUnique({ where: { nit } })
        if (existingCompany && existingCompany.id !== session.user.companyId) {
            return {
                errors: { nit: ['Este NIT ya está registrado por otra cuenta empresarial.'] },
                message: 'El NIT proporcionado no está disponible.'
            }
        }

        // Update Company
        await prisma.company.update({
            where: { id: session.user.companyId },
            data: { 
                name, 
                nit, 
                logo: logo || null, 
                description: description || null, 
                website: website || null, 
                phone: phone || null, 
                industry, 
                department 
            }
        })

        revalidatePath('/settings')
        revalidatePath('/dashboard')
        revalidatePath(`/company/${session.user.companyId}`)
        revalidatePath('/network')

        return { message: '¡Perfil de la empresa actualizado exitosamente!' }
    } catch (error) {
        console.error("Update Company Error:", error)
        return { message: 'Ocurrió un error inesperado al actualizar el perfil.' }
    }
}
