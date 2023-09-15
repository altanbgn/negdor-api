import httpStatus from "http-status"
import { JwtPayload, verify } from "jsonwebtoken"

// Local
import prisma from "@/prisma"
import ApiError from "@/utils/api-error"
import config from "@/utils/config"

type DecodedData = {
  email: string
  iat: number
  exp: number
}

export default async function (token: string | null | undefined): Promise<void> {
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid token!")
  }

  const decoded: JwtPayload = verify(token.split(" ")[1], config.appSecret!, {
    algorithms: ["HS512"]
  }) as DecodedData

  await prisma.user.update({
    where: { email: decoded.email },
    data: { emailVerified: true }
  })
}
