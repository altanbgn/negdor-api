import httpStatus from "http-status"

// Local
import prisma from "@/prisma"
import ApiError from "@/utils/api-error"
import { UpdateMenuItemPayload } from "../types"

export default async function (id: string, data: UpdateMenuItemPayload) {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
  }

  return await prisma.menuItem.update({
    where: { id },
    data
  })
}
