import httpStatus from "http-status"

// Local
import prisma from "@/prisma"
import ApiError from "@/utils/api-error"

export default async function (id: string) {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
  }

  return await prisma.category.findUnique({
    where: { id },
    include: { children: true }
  })
}
