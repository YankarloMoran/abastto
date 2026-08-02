import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { VerificationClient } from "./verification-client"

export default async function VerificationPage() {
    const session = await auth()
    if (!session?.user?.companyId) redirect("/login")

    const company = await prisma.company.findUnique({
        where: { id: session.user.companyId },
        include: { documents: true }
    })

    if (!company) redirect("/login")

    return (
        <VerificationClient
            company={{
                id: company.id,
                isVerified: company.isVerified,
                kycStatus: company.kycStatus,
                documents: company.documents.map(d => ({
                    type: d.type,
                    url: d.url,
                    status: d.status
                }))
            }}
        />
    )
}
