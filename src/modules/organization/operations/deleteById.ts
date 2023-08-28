import httpStatus from "http-status"

// Local
import ApiError from "@/utils/api-error"
import prisma from "@/prisma"

export default async function (id: string) {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
  }

  return await prisma.organization.delete({
    where: { id }
  })
}
