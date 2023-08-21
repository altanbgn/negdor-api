import { hash, genSalt } from "bcryptjs"
import httpStatus from "http-status"

// Locals
import prisma from "@/prisma"
import ApiError from "@/utils/api-error"

export default async function (data: any) {
  const checkUser = await prisma.user.findFirst({
    where: { OR: [{ email: data.email }, { username: data.username }] }
  })

  if (checkUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User with this email or username already exists!")
  }

  const salt = await genSalt(12)
  const hashedPassword = await hash(data.newPassword, salt)

  return await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    }
  })
}
