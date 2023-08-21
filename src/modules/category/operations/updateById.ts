import httpStatus from "http-status"

// Local
import prisma from "@/prisma"
import ApiError from "@/utils/api-error"
import { UpdatePayload } from "../types"

export default async function (id: string, payload: UpdatePayload) {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "ID is not specified!")
  }

  return await prisma.category.update({
    where: { id },
    data: payload
  })
}
