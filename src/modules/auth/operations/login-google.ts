import { sign } from "jsonwebtoken"
import httpStatus from "http-status"
import { SupportedPlatform } from "@prisma/client"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

// Local
import prisma from "@/prisma"
import config from "@/utils/config"
import ApiError from "@/utils/api-error"

// Will generate google login url
// const stringifiedParams = queryString.stringify({
//   client_id: config.googleAppId,
//   redirect_uri: "http://localhost:4000/v1/auth/login-google",
//   scope: [
//     "https://www.googleapis.com/auth/userinfo.email",
//     "https://www.googleapis.com/auth/userinfo.profile",
//   ].join(" "),
//   response_type: "code",
//   access_type: "offline",
//   prompt: "consent"
// })
//
// console.log("LOGIN URL :", `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`)

export default async function loginGoogle(query: any): Promise<string> {
  if (!query || query?.error) {
    throw new ApiError(httpStatus.OK, query?.error_description || "Invalid query")
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      code: query?.code,
      grant_type: "authorization_code",
      client_id: config.googleAppId,
      client_secret: config.googleAppSecret,
      redirect_uri: "http://localhost:4000/v1/auth/login-google",
    })
  })
  const tokenData = await tokenResponse.json()

  if (!tokenData.access_token && tokenData.error) {
    throw new ApiError(httpStatus.BAD_REQUEST, tokenData?.error_description || "Access token error")
  }

  const userDataResponse = await fetch("https://www.googleapis.com/oauth2/v1/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` }
  })
  const userData = await userDataResponse.json()

  if (!userData.id || userData.error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, tokenData.error?.message || "User info error")
  }

  const appConnection = await prisma.appConnection.findUnique({
    where: {
      accessId: userData.id,
      platform: SupportedPlatform.GOOGLE
    },
    include: { user: true }
  })

  if (appConnection) {
    return sign(
      { id: appConnection.user.id },
      config.appSecret,
      { expiresIn: `${String(config.jwtExpiresIn)}m`, algorithm: "HS512" }
    )
  } else {
    const user = await prisma.user.findFirst({
      where: { email: userData.email }
    })

    if (user) {
      await prisma.appConnection.create({
        data: {
          accessId: userData.id,
          platform: SupportedPlatform.GOOGLE,
          user: { connect: { id: user.id } }
        }
      })

      return sign(
        { id: user.id },
        config.appSecret,
        { expiresIn: `${String(config.jwtExpiresIn)}m`, algorithm: "HS512" }
      )
    } else {
      const user = await prisma.user.create({
        data: {
          firstname: userData.given_name,
          lastname: userData.family_name,
          email: userData.email,
          username: userData.email,
        }
      }).catch((error: PrismaClientKnownRequestError) => {
        if (error.code === "P2002") {
          throw new ApiError(httpStatus.BAD_REQUEST, "User with this email already exists!")
        }

        throw error
      })

      await prisma.appConnection.create({
        data: {
          accessId: userData.id,
          platform: SupportedPlatform.GOOGLE,
          user: { connect: { id: user.id } }
        }
      })

      return sign(
        { id: user.id },
        config.appSecret,
        { expiresIn: `${String(config.jwtExpiresIn)}m`, algorithm: "HS512" }
      )
    }
  }
}
