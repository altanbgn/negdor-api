import { UserRole, MemberRole } from "@prisma/client"

// Local
import prisma from "@/prisma"
import { OrganizationCreatePayload } from "../types"

export default async function (data: OrganizationCreatePayload, user: any) {
  await prisma.user.update({
    where: { id: user.id },
    data: { role: UserRole.CLIENT }
  })

  const { tags, ...queryData } = data

  return await prisma.organization.create({
    data: {
      ...queryData,
      metrics: {
        create: {}
      },
      members: {
        create: [
          {
            user: { connect: { id: user.id } },
            role: MemberRole.OWNER
          }
        ]
      }
    }
  })
}
