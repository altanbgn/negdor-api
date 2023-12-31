import { Request, Response, NextFunction } from "express"
import { verify } from "jsonwebtoken"
import httpStatus from "http-status"
import { MemberRole, UserRole } from "@prisma/client"

// Locals
import prisma from "@/prisma"
import config from "@/utils/config"
import ApiError from "@/utils/api-error"
import catchAsync from "@/utils/catch-async"

export const verifyLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const header = req.headers.authorization

    if (!header) {
      next()
      return
    }

    const bearer = header.split(" ")
    const bearerHeader = bearer[1]
    const verifiedUser = verify(bearerHeader, config.appSecret)

    if (!verifiedUser) {
      next()
      return
    }

    const foundUser = await prisma.user.findUnique({
      where: { id: verifiedUser["id"] || "" }
    })

    if (foundUser) {
      res.locals.user = foundUser
      next()
    } else {
      next()
    }
  }
)

export const requireLogin = catchAsync(
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (res.locals.user) {
      next()
    } else {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Login required!")
    }
  }
)

export const requireOwnership = (model: string) => catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!res.locals.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Login required!")
    }

    if (res.locals.user.role.includes([UserRole.MODERATOR, UserRole.ADMIN])) {
      next()
      return
    }

    const result = await prisma[model].findUnique({
      where: { id: req.params.id }
    })

    if (!result) {
      throw new ApiError(httpStatus.NOT_FOUND, "Not found!")
    }

    if (
      result.createdUserId &&
      (result.createdUserId === res.locals.user.id)
    ) {
      next()
      return
    }

    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized!")
  }
)

export const requireUserRole = (...args: UserRole[]) => catchAsync(
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!res.locals.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Login required!")
    }

    if (res.locals.user.role === UserRole.ADMIN) {
      next()
      return
    }

    let authorized = false

    args.forEach((role: UserRole) => {
      if (res.locals.user.role === role) {
        authorized = true
        return
      }
    })

    if (authorized) {
      next()
      return
    }

    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized!")
  }
)

export const requireMemberRole = (model: string, ...args: MemberRole[]) => catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!res.locals.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Login required!")
    }

    if (res.locals.user?.role === UserRole.ADMIN) {
      next()
      return
    }

    let result: any = null

    if (model === "organization") {
      result = await prisma.member.findFirst({
        where: {
          organizationId: req.params.id,
          userId: res.locals.user.id,
        }
      })
    } else {
      if (req.body.organizationId) {
        result = await prisma.member.findFirst({
          where: {
            organizationId: req.body.organizationId,
            userId: res.locals.user.id
          }
        })
      } else if (req.params.id) {
        const row = await prisma[model].findFirst({
          where: { id: req.params.id },
        })

        if (row?.organizationId) {
          result = await prisma.member.findFirst({
            where: {
              organizationId: row.organizationId,
              userId: res.locals.user.id
            }
          })
        }
      }
    }

    if (!result) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized!")
    }

    let authorized = false

    args.forEach((role: MemberRole) => {
      if (result.role === role) {
        authorized = true
        return
      }
    })

    if (authorized) {
      next()
      return
    }

    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized!")
  }
)
