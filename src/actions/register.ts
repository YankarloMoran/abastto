'use server'

import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'

const RegisterUserSchema = z.object({
    name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
    email: z.string().email({ message: 'Por favor ingresa un correo válido.' }),
    password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
    role: z.enum(['BUYER', 'SUPPLIER', 'ADMIN']).optional().default('BUYER'),
})

const RegisterCompanySchema = z.object({
    nit: z.string().min(5, { message: 'El NIT debe ser válido.' }),
    companyName: z.string().min(2, { message: 'El nombre de la empresa es obligatorio.' }),
    industry: z.enum(['AGRICULTURA', 'CONSTRUCCION', 'ESTADO_GOBIERNO', 'MANUFACTURA', 'MEDICAL_SALUD', 'RETAIL_COMERCIO', 'SERVICIOS_PROFESIONALES', 'TECNOLOGIA', 'TRANSPORTE_LOGISTICA', 'OTRO']),
    department: z.enum(['ALTA_VERAPAZ', 'BAJA_VERAPAZ', 'CHIMALTENANGO', 'CHIQUIMULA', 'EL_PROGRESO', 'ESCUINTLA', 'GUATEMALA', 'HUEHUETENANGO', 'IZABAL', 'JALAPA', 'JUTIAPA', 'PETEN', 'QUETZALTENANGO', 'QUICHE', 'RETALHULEU', 'SACATEPEQUEZ', 'SAN_MARCOS', 'SANTA_ROSA', 'SOLOLA', 'SUCHITEPEQUEZ', 'TOTONICAPAN', 'ZACAPA']),
})


export type State = {
    errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
        role?: string[]
        nit?: string[]
        companyName?: string[]
        industry?: string[]
        department?: string[]
    }
    message?: string | null
    success?: boolean
}

/**
 * Server Action para registrar un nuevo usuario en la plataforma.
 * Actúa de manera dual:
 * 1. Flujo de Invitación: Si recibe un `inviteToken`, vincula al nuevo usuario a la empresa existente.
 * 2. Flujo Normal: Si no hay token, crea una nueva Empresa y asiga al usuario como su 'OWNER'.
 * Ambas operaciones están protegidas por transacciones de base de datos.
 */
export async function registerUser(prevState: State, formData: FormData): Promise<State> {
    const inviteToken = formData.get('inviteToken') as string | null

    const rawRole = formData.get('role') as string | null
    const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        role: rawRole && ['BUYER', 'SUPPLIER', 'ADMIN'].includes(rawRole) ? rawRole : 'BUYER',
    }

    const userFields = RegisterUserSchema.safeParse(userData)
    if (!userFields.success) {
        return {
            errors: userFields.error.flatten().fieldErrors,
            message: 'Errores en los datos personales.',
        }
    }

    const { name, email, password, role } = userFields.data
    const hashedPassword = await bcrypt.hash(password, 10)

    let successRedirect = false;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            return { errors: { email: ['El correo ya está en uso.'] }, message: 'Error al registrarse.' } as State
        }

        if (inviteToken) {
            // INVITATION FLOW -> Join existing company
            const invitation = await prisma.invitation.findUnique({
                where: { token: inviteToken },
                include: { company: { include: { users: { select: { role: true }, take: 1 } } } }
            })

            if (!invitation || new Date(invitation.expiresAt) < new Date()) {
                return { message: 'La invitación es inválida o expiró. Solicita a tu administrador una nueva.' }
            }

            // Inherit the role of the company (SUPPLIER or BUYER)
            const companyPrimaryRole = invitation.company.users[0]?.role || 'BUYER'

            // Transaction: Create user, link to company, delete invitation
            await prisma.$transaction(async (tx) => {
                await tx.user.create({
                    data: {
                        name,
                        email,
                        password: hashedPassword,
                        companyRole: invitation.role, // from invitation
                        companyId: invitation.companyId,
                        role: companyPrimaryRole
                    }
                })

                await tx.invitation.delete({ where: { id: invitation.id } })
            })

            successRedirect = true;

        } else {
            // REGULAR FLOW -> Create new company AND User as OWNER
            const companyData = {
                nit: formData.get('nit'),
                companyName: formData.get('companyName'),
                industry: formData.get('industry'),
                department: formData.get('department'),
            }

            const companyFields = RegisterCompanySchema.safeParse(companyData)
            if (!companyFields.success) {
                return {
                    errors: companyFields.error.flatten().fieldErrors,
                    message: 'Errores en los datos de la empresa.',
                }
            }

            const { nit, companyName, industry, department } = companyFields.data

            const existingCompany = await prisma.company.findUnique({ where: { nit } })
            if (existingCompany) {
                return { errors: { nit: ['El NIT ya está registrado.'] }, message: 'Error al registrarse.' } as State
            }

            await prisma.$transaction(async (tx) => {
                const company = await tx.company.create({
                    data: {
                        nit,
                        name: companyName,
                        industry,
                        department,
                    },
                })

                const validRole = (role === 'SUPPLIER') ? 'SUPPLIER' : 'BUYER'

                await tx.user.create({
                    data: {
                        name,
                        email,
                        password: hashedPassword,
                        role: validRole,
                        companyRole: 'OWNER',
                        companyId: company.id,
                    },
                })
            })

            successRedirect = true;
        }

    } catch (error) {
        console.error(error)
        return {
            message: 'Error de base de datos: No se pudo procesar tu registro.',
        }
    }

    if (successRedirect) {
        return {
            success: true,
            message: '¡Cuenta y entidad corporativa creadas exitosamente!'
        }
    }

    return {};
}
