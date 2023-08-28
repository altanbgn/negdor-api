import httpStatus from "http-status"
import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

// Local
import prisma from "@/prisma"
import ApiError from "@/utils/api-error"
import { RatingCreatePayload } from "../types"

export default async function(data: RatingCreatePayload, user: any) {
  const { value, organizationId } = data

  return await prisma.$transaction(async function(tx: any) {
    const createdRating = await tx.rating.create({
      data: {
        value,
        createdUser: { connect: { id: user.id } },
        organization: { connect: { id: organizationId } }
      }
    }).catch((error: PrismaClientKnownRequestError) => {
      if (error.code === "P2002") {
        throw new ApiError(httpStatus.BAD_REQUEST, "Can't create another rating for this org")
      }

      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong!")
    })

    const scoreResult = await tx.rating.aggregate({
      where: { organizationId },
      _avg: { value: true },
    })

    await tx.organization.update({
      where: { id: organizationId },
      data: { score: scoreResult._avg.value || 0 }
    })

    return createdRating
  })
}
