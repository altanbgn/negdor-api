import httpStatus from "http-status"

// Local
import ApiError from "@/utils/api-error"
import { UpdatePayload } from "../types"
import prisma from "@/prisma"

export default async function (id: string, data: UpdatePayload) {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "ID is not specified!")
  }

  return await prisma.review.update({
    where: { id },
    data
  })
}
