import httpStatus from "http-status"
import { genSalt, hash } from "bcryptjs"

// Local
import prisma from "@/prisma"
import ApiError from "@/utils/api-error"
import type { ChangePasswordPayload } from "../types"

export default async function(
  data: ChangePasswordPayload,
  user: any
) {
  const verifiedUser = await prisma.user.verifyPasswordById(user.id, data.oldPassword)

  if (!verifiedUser) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Wrong Password!")
  }

  const salt = await genSalt(12)
  const hashedPassword = await hash(data.newPassword, salt)

  return await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword }
  })
}
