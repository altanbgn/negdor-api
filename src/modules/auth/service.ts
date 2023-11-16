import httpStatus from "http-status"
import queryString from "querystring"
import { JwtPayload, verify, sign } from "jsonwebtoken"
import { hash, genSalt } from "bcryptjs"
import { SupportedPlatform } from "@prisma/client"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

// Locals
import prisma from "@/prisma"
import ApiError from "@/utils/api-error"
import config from "@/utils/config"
import mailer from "@/mailer"
import type {
  LoginPayload,
  ForgotPasswordPayload,
  RegisterPayload,
  RecoverPasswordPayload,
  DecodedData
} from "./types"

export default class AuthService {
  public async login(payload: LoginPayload): Promise<string> {
    const { email, password } = payload

    const verifiedUser = await prisma.user.verifyPasswordByEmail(email, password)

    return sign(
      { id: verifiedUser.id },
      config.appSecret,
      { expiresIn: `${String(config.jwtExpiresIn)}m`, algorithm: "HS512" }
    )
  }

  public async register(payload: RegisterPayload): Promise<void> {
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

  public async forgotPassword(data: ForgotPasswordPayload): Promise<void> {
    const token = sign(data, config.appSecret!, {
      expiresIn: `${String(config.jwtExpiresIn)}m`,
      algorithm: "HS512"
    })

    await mailer.sendMail({
      from: config.mailerUser,
      to: data.email,
      subject: "Negdor - Recover password",
      html: `
        <h1>Recover password</h1>
        <p>Click <a href="${config.appUrl}/auth/recover-password?token=${token}">here</a> to recover your password.</p>
      `
    })
  }

  public async recoverPassword(
    token: string | null | undefined,
    data: RecoverPasswordPayload
  ): Promise<void> {
    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid token!")
    }

    const decoded: JwtPayload = verify(
      token,
      config.appSecret!,
      { algorithms: ["HS512"] }
    ) as DecodedData

    const salt = await genSalt(12)
    const hashedPassword = await hash(data.password, salt)

    await prisma.user.update({
      where: { email: decoded.email },
      data: { password: hashedPassword }
    })
  }

  public async loginGoogle(query: any): Promise<string> {
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
        redirect_uri: "https://negdor.com/auth/ggl-login",
      })
    })
    const tokenData = await tokenResponse.json()

    if (!tokenData.access_token && tokenData.error) {
      console.log("TOKEN DATA", tokenData)
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
            firstname: userData.given_name || "",
            lastname: userData.family_name || userData.given_name || "",
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

  // https://www.facebook.com/v18.0/dialog/oauth?client_id=1259476178086338&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fv1%2Fauth%2Flogin-facebook&scope=email,public_profile
  public async loginFacebook(query: any): Promise<string> {
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
    const accessTokenJson = await accessTokenResponse.json()

    if (accessTokenJson?.id || accessTokenJson?.error) {
      throw new ApiError(httpStatus.BAD_REQUEST, accessTokenJson?.error?.message || "Access token error")
    }

    const userDataResponse = await fetch(
      "https://graph.facebook.com/me" +
      `?fields=id,installed,first_name,last_name,email&` +
      `&access_token=${accessTokenJson.access_token}`
    )
    const userData = await userDataResponse.json()

    if (!userData?.id || userData?.error) {
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
}
