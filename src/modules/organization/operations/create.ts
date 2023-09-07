import { UserRole, MemberRole } from "@prisma/client"

// Local
import prisma from "@/prisma"
import { OrganizationCreatePayload } from "../types"

export default async function (data: OrganizationCreatePayload, user: any) {
  await prisma.user.update({
    where: { id: user.id },
    data: { role: UserRole.CLIENT }
  })

  const { categories = [], tags, ...queryData } = data

  const result = await prisma.organization.create({
    data: {
      ...queryData,
      categories: {
        connect: categories.map((categoryId: string) => ({ id: categoryId }))
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

  return result
}
