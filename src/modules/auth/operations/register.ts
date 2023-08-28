import httpStatus from "http-status"
import { genSalt, hash } from "bcryptjs"
import { sign } from "jsonwebtoken"
import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

// Locals
import prisma from "@/prisma"
import config from "@/utils/config"
import ApiError from "@/utils/api-error"
import { RegisterPayload } from "../types"

export default async function register(payload: RegisterPayload): Promise<string> {
  const {
    email,
    firstname,
    lastname,
    username,
    phonenumber,
    password
  } = payload

  const salt = await genSalt(12)
  const hashedPassword = await hash(password, salt)

  const user = await prisma.user.create({
    data: {
      email,
      firstname,
      lastname,
      username,
      phonenumber,
      password: hashedPassword
    }
  }).catch((error: PrismaClientKnownRequestError) => {
    if (error.code === "P2002") {
      throw new ApiError(httpStatus.BAD_REQUEST, "User with this email already exists!")
    }

    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong!")
  })

  const token = sign(
    user,
    config.appSecret!,
    { expiresIn: `${String(config.jwtExpiresIn)}m`, algorithm: "HS512" }
  )

  return token
}
