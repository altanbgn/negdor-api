import httpStatus from "http-status"

// Local
import ApiError from "@/utils/api-error"
import prisma from "@/prisma"

export default async function (id: string) {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
  }

  const memberCount = await prisma.member.count({
    where: { organizationId: id }
  })

  if (memberCount > 1) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Organization still has members!")
  }

  const result = await prisma.$transaction(async function (tx: any) {
    const metricsDeleted = await tx.metrics.deleteMany({
      where: { organizationId: id }
    })

    const memberDeleted = await tx.member.deleteMany({
      where: { organizationId: id }
    })

    if (!memberDeleted || !metricsDeleted) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong!")
    }

    return await prisma.organization.delete({
      where: { id }
    })
  })

  if (!result) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong!")
  }
}
