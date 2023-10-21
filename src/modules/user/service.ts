import { hash, genSalt } from "bcryptjs"
import { JwtPayload, sign, verify } from "jsonwebtoken"
import httpStatus from "http-status"
import { User } from "@prisma/client"

// Locals
import prisma from "@/prisma"
import mailer from "@/mailer"
import config from "@/utils/config"
import ApiError from "@/utils/api-error"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import {
  UserUpdatePayload,
  ChangePasswordPayload,
  UserFindQuery,
  DecodedData
} from "./types"

export default class UserService {
  public async find(query: UserFindQuery) {
    const page = parseInt(query?.page as string || "1")
    const perPage = parseInt(query?.perPage as string || "10")
    const whereConditions: any = {}

    if (query?.search && query?.search.length > 0) {
      whereConditions.firstname = { search: query.search }
      whereConditions.lastname = { search: query.search }
      whereConditions.username = { search: query.search }
    }

    const preparedQuery = {
      skip: (page - 1) * perPage,
      take: perPage,
      where: whereConditions
    }

    return {
      list: await prisma.user.findMany(preparedQuery),
      page: page,
      perPage: perPage,
      total: await prisma.user.count()
    }
  }

  public async findById(id: string) {
    if (!id) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
    }

    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        avatar: true,
        bio: true,
        firstname: true,
        lastname: true,
        username: true,
        email: true,
        phonenumber: true,
        organizations: true,
        createdAt: true,
        updatedAt: true,
        role: true
      }
    }).catch((error: PrismaClientKnownRequestError) => {
      if (error.code === "P2002") {
        throw new ApiError(httpStatus.BAD_REQUEST, "Can't create another rating for this org")
      }

      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong!")
    })
  }

  public async create(data: any) {
    const checkUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { username: data.username }
        ]
      }
    }).catch((error: PrismaClientKnownRequestError) => {
      if (error.code === "P2002") {
        throw new ApiError(httpStatus.BAD_REQUEST, "User with this email or username already exists!")
      }

      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong!")
    })

    if (checkUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User with this email or username already exists!")
    }

    const salt = await genSalt(12)
    const hashedPassword = await hash(data.newPassword, salt)

    return await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      }
    })
  }

  public async updateById(id: string, data: UserUpdatePayload) {
    if (!id) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
    }

    if (data.email) {
      data.emailVerified = false
    }

    return await prisma.user.update({
      where: { id },
      data
    })
  }

  public async deleteById(id: string) {
    if (!id) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
    }

    return await prisma.user.delete({ where: { id } })
  }

  public async changePassword(data: ChangePasswordPayload, user: User) {
    const verifiedUser = await prisma.user.verifyPasswordById(
      user.id,
      data.oldPassword || ""
    )

    if (!verifiedUser) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Wrong Password!")
    }

    const salt = await genSalt(12)
    const hashedPassword = await hash(data.newPassword, salt)

    const result = await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    })

    return result
  }

  public async sendVerifyEmail(email: string): Promise<void> {
    const token = sign(
      { email: email },
      config.appSecret!,
      {
        expiresIn: `${String(config.jwtExpiresIn)}m`,
        algorithm: "HS512"
      }
    )

    await mailer.sendMail({
      from: config.mailerUser,
      to: email,
      subject: "Negdor - Verify your email",
      html: `
        <h1>Verify your email</h1>
        <p>Click <a href="${config.appUrl}/user/verify-email?token=${token}">here</a> to verify your email.</p>
      `
    })
  }

  public async verifyEmail(user: any, token: string | null | undefined): Promise<void> {
    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid token!")
    }

    const decoded: JwtPayload = verify(
      token,
      config.appSecret!,
      { algorithms: ["HS512"] }
    ) as DecodedData


    if (user.email === decoded.email) {
      await prisma.user.update({
        where: { email: decoded.email },
        data: { emailVerified: true }
      })
    } else {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Wrong token")
    }
  }
}
