import httpStatus from "http-status"

// Local
import ApiError from "@/utils/api-error"
import prisma from "@/prisma"
import { RatingUploadPayload } from "../types"

export default async function (id: string, data: RatingUploadPayload) {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
  }

  return await prisma.$transaction(async function(tx: any) {
    const updatedRating = await tx.rating.update({
      where: { id },
      data
    })

    const scoreResult = await tx.rating.aggregate({
      where: { organizationId: updatedRating.organizationId },
      _avg: { value: true }
    })

    await tx.organization.update({
      where: { id: updatedRating.organizationId },
      data: { score: scoreResult._avg.value || 0 }
    })

    return updatedRating
  })
}
