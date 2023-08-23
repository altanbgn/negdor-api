import httpStatus from "http-status"
import { genSalt, hash, compare } from "bcryptjs"

// Local
import prisma from "@/prisma"
import ApiError from "@/utils/api-error"
import { ChangePasswordPayload } from "../types"

export default async function (
  id: string,
  data: ChangePasswordPayload,
  user: any
) {
  if (user.id === id) {
    const foundUser = await prisma.user.findUnique({ where: { id } })

    if (!foundUser) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found!")
    }

    if (!data?.oldPassword) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Wrong Password!")
    }

    const checkPassword = await compare(data.oldPassword, foundUser.password)

    if (!checkPassword) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Wrong Password!")
    }
  }

  const salt = await genSalt(12)
  const hashedPassword = await hash(data.newPassword, salt)

  return await prisma.user.update({
    where: { id },
    data: {
      password: hashedPassword
    }
  })
}
