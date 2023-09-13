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

    res.locals.user = verifiedUser
    next()
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

    if (
      res.locals.user.role === UserRole.MODERATOR ||
      res.locals.user.role === UserRole.ADMIN
    ) {
      next()
      return
    }

    const result = await prisma[model].findUnique({
      where: { id: req.params.id }
    });

    if (!result) {
      throw new ApiError(httpStatus.NOT_FOUND, "Not found!")
    }

    if (
      result.createdUserId &&
      (result.createdUserId === res.locals.user.id)
    ) {
      next();
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

    let authorized = false;

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

export const requireMemberRole = (...args: MemberRole[]) => catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!res.locals.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Login required!")
    }

    const result = await prisma.member.findFirst({
      where: {
        userId: res.locals.user.id,
        organizationId: req.params?.id
      }
    })

    if (!result) {
      throw new ApiError(httpStatus.NOT_FOUND, "Not found!")
    }

    let authorized = false;

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
