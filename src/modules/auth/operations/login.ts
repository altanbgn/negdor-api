import { sign } from "jsonwebtoken"

// Locals
import prisma from "@/prisma"
import config from "@/utils/config"
import { LoginPayload } from "../types"

export default async function login(payload: LoginPayload): Promise<string> {
  const { email, password } = payload

  const foundUser = await prisma.user.verifyPasswordByEmail(email, password)

  const token = sign(
    foundUser,
    config.appSecret,
    { expiresIn: `${String(config.jwtExpiresIn)}m`, algorithm: "HS512" }
  )

  return token
}
