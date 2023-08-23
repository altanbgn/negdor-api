import httpStatus from "http-status"

// Local
import prisma from "@/prisma"
import ApiError from "@/utils/api-error"

export default async function (id: string) {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
  }

  const result: any = await prisma.menu.findUnique({
    where: { id },
    include: {
      items: true
    },
  })

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found!")
  }

  return result
}
