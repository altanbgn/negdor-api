import { Request, Response, NextFunction } from "express"
import { verify } from "jsonwebtoken"
import httpStatus from "http-status"

// Locals
import config from "@/utils/config"
import ApiError from "@/utils/api-error"
import catchAsync from "@/utils/catch-async"

const verifyToken = (header: string | undefined) => {
  if (header) {
    const bearer = header.split(" ")
    const bearerToken = bearer[1]
    const verifiedUser = verify(bearerToken, config.appSecret)

    return verifiedUser
  }

  return undefined
}

export const requireLogin = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const bearerHeader = req.headers.authorization

  if (!bearerHeader) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Login required!")
  }

  const verifiedUser = verifyToken(bearerHeader)

  if (!verifiedUser) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Login required!")
  }

  res.locals.user = verifiedUser
  next()
})

export const optionalLogin = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const bearerHeader = req.headers.authorization
  const verifiedUser = verifyToken(bearerHeader)

  if (verifiedUser) {
    res.locals.user = verifiedUser
  }

  next()
})
