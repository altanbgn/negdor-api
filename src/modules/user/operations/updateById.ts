import httpStatus from "http-status"

// Local
import prisma from "@/prisma"
import ApiError from "@/utils/api-error"
import { UserUpdatePayload } from "../types"

export default async function(id: string, data: UserUpdatePayload) {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
  }

  if (data.email) {
    data.emailVerified = false
  }

  return await prisma.user.update({
    where: { id },
    data
  })
}
