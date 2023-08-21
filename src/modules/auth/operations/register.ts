import { genSalt, hash } from "bcryptjs"
import { sign } from "jsonwebtoken"
import httpStatus from "http-status"

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

  const checkUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] }
  })

  if (checkUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User with this email already exists!")
  }

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
  })

  const token = sign(
    user,
    config.appSecret,
    { expiresIn: `${String(config.jwtExpiresIn)}m`, algorithm: "HS512" }
  )

  return token
}
