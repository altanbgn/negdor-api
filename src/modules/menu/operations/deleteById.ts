import httpStatus from "http-status"

// Local
import prisma from "@/prisma"
import ApiError from "@/utils/api-error"

export default async function (id: string) {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
  }

  const checkChild = await prisma.menu.count({
    where: { menuId: id }
  })

  if (checkChild > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Cannot delete menu with child")
  }

  return await prisma.menu.delete({
    where: { id }
  })
}
