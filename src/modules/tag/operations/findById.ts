import httpStatus from "http-status"

// Local
import prisma from "@/prisma"
import ApiError from "@/utils/api-error"

export default async function (id: string) {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "ID is not specified!")
  }

  return await prisma.tag.findUnique({
    where: { id },
  })
}
