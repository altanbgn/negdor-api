import httpStatus from "http-status"
import { JwtPayload, verify } from "jsonwebtoken"
import { hash, genSalt } from "bcryptjs"

// Local
import prisma from "@/prisma"
import ApiError from "@/utils/api-error"
import config from "@/utils/config"
import type { RecoverPasswordPayload } from "../types"

type DecodedData = {
  email: string,
  iat: number,
  exp: number
}

export default async function (
  token: string | null | undefined,
  data: RecoverPasswordPayload
): Promise<void> {
  if (!token) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid Token!")
  }

  const decoded: JwtPayload = verify(
    token.split(" ")[1],
    config.appSecret!,
    { algorithms: ["HS512"] }
  ) as DecodedData

  const salt = await genSalt(12)
  const hashedPassword = await hash(data.password, salt)

  await prisma.user.update({
    where: { email: decoded.email },
    data: { password: hashedPassword }
  })

  return
}
