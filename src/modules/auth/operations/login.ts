import { sign } from "jsonwebtoken"

// Locals
import prisma from "@/prisma"
import config from "@/utils/config"
import { LoginPayload } from "../types"

export default async function login(payload: LoginPayload): Promise<string> {
  const { email, password } = payload

  const verifiedUser = await prisma.user.verifyPasswordByEmail(email, password)

  return sign(
    { id: verifiedUser.id },
    config.appSecret,
    { expiresIn: `${String(config.jwtExpiresIn)}m`, algorithm: "HS512" }
  )
}
