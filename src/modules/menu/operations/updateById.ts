import httpStatus from "http-status"

// Local
import prisma from "@/prisma"
import ApiError from "@/utils/api-error"
import { UpdateMenuPayload } from "../types"

export default async function(id: string, data: UpdateMenuPayload) {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
  }

  return await prisma.menu.update({
    where: { id },
    data
  })
}
