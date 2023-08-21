import prisma from "@/prisma"
import { CreatePayload } from "../types"

export default async function (data: CreatePayload, user: any) {
  const {
    title,
    body,
    organizationId
  } = data

  return await prisma.review.create({
    data: {
      title,
      body,
      createdUser: { connect: { id: user.id } },
      organization: { connect: { id: organizationId }}
    },
  })
}
