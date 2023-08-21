import httpStatus from "http-status"
import ApiError from "@/utils/api-error"
import prisma from "@/prisma"

export default async function (id: string) {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "ID is not specified!")
  }

  const result: any = await prisma.review.findUnique({
    where: { id },
    include: {
      createdUser: true,
      organization: true
    }
  })

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found!")
  }

  return result
}
