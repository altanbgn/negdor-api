import httpStatus from "http-status"

// Local
import prisma from "@/prisma"
import ApiError from "@/utils/api-error"
import { TagUpdatePayload } from "../types"

export default async function (id: string, data: TagUpdatePayload) {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
  }

  return await prisma.tag.update({
    where: { id },
    data
  })
}
