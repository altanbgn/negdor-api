import { ErrorRequestHandler, Request, Response, NextFunction } from "express"
import { Prisma } from "@prisma/client"
import Joi from "joi"
import httpStatus from "http-status"

// Locals
import config from "@/utils/config"
import logger from "@/utils/logger"
import ApiError from "@/utils/api-error"

const prismaErrorHandler = (err: Prisma.PrismaClientKnownRequestError) => {
  switch (err.code) {
    case "P2002": return `Duplicate field value : ${err?.meta?.target || ""}`
    case 'P2003': return `Invalid input data : ${err?.meta?.target || ""}`
    case 'P2014': return `Invalid ID : ${err?.meta?.target || ""}`
    default: return err?.meta?.cause
  }
}

export const errorConverter: ErrorRequestHandler = (err, _req: Request, _res: Response, next: NextFunction) => {
  let error = err

  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode ||
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Joi.ValidationError
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR

    const message = prismaErrorHandler(err) ||
      error?.details?.[0]?.message ||
      error.message ||
      httpStatus[statusCode]

    error = new ApiError(
      statusCode,
      message,
      statusCode !== httpStatus.INTERNAL_SERVER_ERROR,
      err.stack
    )
  }

  next(error)
}

export const errorHandler: ErrorRequestHandler = (err, _req: Request, res: Response, _next: NextFunction) => {
  let { statusCode, message } = err

  if (config.env === "production" && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR]
  }

  res.locals.errorMessage = err.message

  const response = {
    code: statusCode,
    message,
    ...(config.env === "development" && { stack: err.stack })
  }

  if (config.env === "development") {
    logger.error(err)
  }

  res.status(statusCode).send(response)
}
