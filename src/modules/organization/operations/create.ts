import { UserRole, MemberRole } from "@prisma/client"

// Local
import prisma from "@/prisma"
import { CreatePayload } from "../types"

export default async function (data: CreatePayload, user: any) {
  await prisma.user.update({
    where: { id: user.id },
    data: { role: UserRole.CLIENT }
  })

  const { categories = [], tags, ...queryData } = data

  return await prisma.organization.create({
    data: {
      ...queryData,
      categories: {
        connect: [...categories]
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
