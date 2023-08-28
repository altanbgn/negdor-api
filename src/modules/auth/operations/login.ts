import { sign } from "jsonwebtoken"

// Locals
import prisma from "@/prisma"
import config from "@/utils/config"
import { LoginPayload } from "../types"

export default async function login(payload: LoginPayload): Promise<string> {
  const { email, password } = payload

  const verifiedUser = await prisma.user.verifyPasswordByEmail(email, password)

  const token = sign(
    {
      id: verifiedUser.id,
      avatar: verifiedUser.avatar,
      email: verifiedUser.email,
      firstname: verifiedUser.firstname,
      lastname: verifiedUser.lastname,
      username: verifiedUser.username,
      phonenumber: verifiedUser.phonenumber,
      role: verifiedUser.role,
      createdAt: verifiedUser.createdAt,
      updatedAt: verifiedUser.updatedAt,
    },
    config.appSecret,
    { expiresIn: `${String(config.jwtExpiresIn)}m`, algorithm: "HS512" }
  )

  return token
}
