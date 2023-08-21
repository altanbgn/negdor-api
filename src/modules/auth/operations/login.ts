import { compare } from "bcryptjs"
import { sign } from "jsonwebtoken"
import httpStatus from "http-status"

// Locals
import prisma from "@/prisma"
import config from "@/utils/config"
import ApiError from "@/utils/api-error"
import { LoginPayload } from "../types"

export default async function login(payload: LoginPayload): Promise<string> {
  const { email, password } = payload

  const foundUser = await prisma.user.findUnique({ where: { email } })

  if (!foundUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!")
  }

  const checkPassword = await compare(password, foundUser.password)

  if (!checkPassword) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Wrong Password!")
  }

  const token = sign(
    foundUser,
    config.appSecret,
    { expiresIn: `${String(config.jwtExpiresIn)}m`, algorithm: "HS512" }
  )

  return token
}
