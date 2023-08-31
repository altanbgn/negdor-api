import prisma from "@/prisma"
import { ReviewCreatePayload } from "../types"

export default async function (data: ReviewCreatePayload, user: any) {
  const { title, body, organizationId } = data

  return await prisma.review.create({
    data: {
      title,
      body,
      createdUser: { connect: { id: user.id } },
      organization: { connect: { id: organizationId }}
    },
  })
}
