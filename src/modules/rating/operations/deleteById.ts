import httpStatus from "http-status"

// Local
import ApiError from "@/utils/api-error"
import prisma from "@/prisma"

export default async function (id: string) {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
  }

  return await prisma.$transaction(async function(tx: any) {
    const deletedRating = await tx.rating.delete({
      where: { id }
    })

    const scoreResult = await tx.rating.aggregate({
      where: { organizationId: deletedRating.organizationId },
      _avg: { value: true }
    })

    await tx.organization.update({
      where: { id: deletedRating.organizationId },
      data: { score: scoreResult._avg.value || 0 }
    })

    return deletedRating
  })
}
