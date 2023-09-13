import { sign } from "jsonwebtoken"
import { SupportedPlatform } from "@prisma/client"

// // Locals
import prisma from "@/prisma"
import config from "@/utils/config"
import ApiError from "@/utils/api-error"
import httpStatus from "http-status"
// https://www.facebook.com/v18.0/dialog/oauth?client_id=3600630626873133&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fv1%2Fauth%2Flogin-facebook

export default async function loginFacebook(payload: any): Promise<string> {
  if (!payload && typeof payload !== "string") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid query")
  }

  const accessTokenUrl = "https://graph.facebook.com/v18.0/oauth/access_token?" +
    `client_id=${config.fbAppId}&` +
    `client_secret=${config.fbAppSecret}&` +
    `redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fv1%2Fauth%2Flogin-facebook&` +
    `code=${payload}`

  const accessTokenResponse = await fetch(accessTokenUrl)
  const accessTokenData = await accessTokenResponse.json()

  const userInfoResponse = await fetch(`https://graph.facebook.com/me?fields=id,installed,first_name,last_name,email,profile_pic&access_token=${accessTokenData.access_token}`)
  const userInfoData = await userInfoResponse.json()

  if (userInfoData.installed) {
    const appConnection = await prisma.appConnection.findFirst({
      where: {
        accessId: userInfoData.id,
        platform: SupportedPlatform.FACEBOOK
      },
      include: {
        user: true
      }
    })

    if (appConnection) {
      const token = sign({
          id: appConnection.user.id,
          avatar: appConnection.user.avatar,
          email: appConnection.user.email,
          firstname: appConnection.user.firstname,
          lastname: appConnection.user.lastname,
          username: appConnection.user.username,
          phonenumber: appConnection.user.phonenumber,
          role: appConnection.user.role,
          createdAt: appConnection.user.createdAt,
          updatedAt: appConnection.user.updatedAt
        },
        config.appSecret,
        { expiresIn: `${String(config.jwtExpiresIn)}m`, algorithm: "HS512" }
      )

      return token
    }
  } else {

  }
}
