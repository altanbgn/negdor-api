import httpStatus from "http-status"
import { genSalt, hash } from "bcryptjs"
import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

// Locals
import prisma from "@/prisma"
import ApiError from "@/utils/api-error"
import { RegisterPayload } from "../types"

export default async function register(payload: RegisterPayload): Promise<void> {
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

  await prisma.user.create({
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
  })
}
