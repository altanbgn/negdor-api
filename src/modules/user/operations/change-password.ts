import httpStatus from "http-status"
import { genSalt, hash } from "bcryptjs"
import { User } from "@prisma/client"

// Local
import prisma from "@/prisma"
import ApiError from "@/utils/api-error"
import type { ChangePasswordPayload } from "../types"

export default async function (data: ChangePasswordPayload, user: User) {
  const verifiedUser = await prisma.user.verifyPasswordById(
    user.id,
    data.oldPassword || ""
  )

  if (!verifiedUser) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Wrong Password!")
  }

  const salt = await genSalt(12)
  const hashedPassword = await hash(data.newPassword, salt)

  const result = await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword }
  })

  return result
}