import httpStatus from "http-status"

// Local
import ApiError from "@/utils/api-error"
import prisma from "@/prisma"

export default async function (id: string) {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "ID is not specified!")
  }

  const memberCount = await prisma.member.count({
    where: { organizationId: id }
  })

  if (memberCount > 1) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Organization still has members!")
  }

  await prisma.member.deleteMany({
    where: { organizationId: id }
  })

  return await prisma.organization.delete({
    where: { id }
  })
}
