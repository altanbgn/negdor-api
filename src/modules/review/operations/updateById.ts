import httpStatus from "http-status"

// Local
import ApiError from "@/utils/api-error"
import { ReviewUpdatePayload } from "../types"
import prisma from "@/prisma"

export default async function (id: string, data: ReviewUpdatePayload) {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
  }

  return await prisma.review.update({
    where: { id },
    data
  })
}
