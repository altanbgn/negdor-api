import httpStatus from "http-status"

// Local
import ApiError from "@/utils/api-error"
import prisma from "@/prisma"
import { RatingUploadPayload } from "../types"

export default async function (id: string, data: RatingUploadPayload) {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "ID is not specified!")
  }

  return await prisma.rating.update({
    where: { id },
    data
  })
}
