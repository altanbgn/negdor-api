import httpStatus from "http-status"

// Local
import ApiError from "@/utils/api-error"
import prisma from "@/prisma"

export default async function (id: string) {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "ID is not specified!")
  }

  return await prisma.rating.findUnique({
    where: { id },
    include: {
      createdUser: true,
      organization: true
    }
  })
}