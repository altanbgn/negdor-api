// Local
import prisma from "@/prisma"
import { RatingCreatePayload } from "../types"

export default async function (data: RatingCreatePayload, user: any) {
  const { value, organizationId } = data

  return await prisma.rating.create({
    data: {
      value,
      createdUser: { connect: { id: user.id } },
      organization: { connect: { id: organizationId } }
    }
  })
}
