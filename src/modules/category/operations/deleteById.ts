import httpStatus from "http-status"

// Local
import prisma from "@/prisma"
import ApiError from "@/utils/api-error"

export default async function (id: string) {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
  }

  const foundResult = prisma.category.count({
    where: { id },
    include: {
      _count: {
        children: true
      }
    }
  })

  if (foundResult._count !== 0) {
    throw new ApiError(httpStatus.CONFLICT, "Data is being used. (Has children or related to some data)")
  }

  return await prisma.category.delete({
    where: { id }
  })
}
