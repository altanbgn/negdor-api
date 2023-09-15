import { sign } from "jsonwebtoken"
import httpStatus from "http-status"
import { SupportedPlatform } from "@prisma/client"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

// Locals
import prisma from "@/prisma"
import config from "@/utils/config"
import ApiError from "@/utils/api-error"

// https://www.facebook.com/v18.0/dialog/oauth?client_id=3600630626873133&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fv1%2Fauth%2Flogin-facebook&scope=email,public_profile,user_photos

export default async function loginFacebook(query: any): Promise<string> {
  if (!query && typeof query !== "object") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid query")
  }

  if (query?.error) {
    throw new ApiError(httpStatus.OK, query?.error_description || "Invalid query")
  }

  const accessTokenResponse = await fetch("https://graph.facebook.com/v18.0/oauth/access_token" +
    `?client_id=${config.facebookAppId}&` +
    `&client_secret=${config.facebookAppSecret}&` +
    `&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fv1%2Fauth%2Flogin-facebook&` +
    `&code=${query.code}`
  )
  const accessToken = await accessTokenResponse.json()

  if (accessToken?.id || accessToken?.error) {
    throw new ApiError(httpStatus.BAD_REQUEST, accessToken?.error?.message || "Access token error")
  }

  const userDataResponse = await fetch(
    "https://graph.facebook.com/me" +
    `?fields=id,installed,first_name,last_name,email&` +
    `&access_token=${accessToken.access_token}`
  )
  const userData = await userDataResponse.json()

  if (userData?.id || userData?.error) {
    throw new ApiError(httpStatus.BAD_REQUEST, userData?.error?.message || "User info error")
  }

  const appConnection = await prisma.appConnection.findFirst({
    where: {
      accessId: userData.id,
      platform: SupportedPlatform.FACEBOOK
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
          platform: SupportedPlatform.FACEBOOK,
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
          firstname: userData.first_name,
          lastname: userData.last_name,
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
          platform: SupportedPlatform.FACEBOOK,
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
