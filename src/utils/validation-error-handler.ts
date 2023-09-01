import Joi, { ValidationErrorItem } from "joi"
import { BAD_REQUEST } from "http-status"
import ApiError from "./api-error"

export function passwordErrorHandler(errors: Joi.ErrorReport[]): string | ValidationErrorItem | Error {
  errors.forEach((err) => {
    switch (err.code) {
      case "any.required":
        throw new ApiError(BAD_REQUEST, "Password is required")

      case "string.min":
        throw new ApiError(BAD_REQUEST, `Password must be at least ${err.local.limit} characters long`)

      case "string.max":
        throw new ApiError(BAD_REQUEST, `Password must be at most ${err.local.limit} characters long`)

      default:
        break
    }
  })

  throw new ApiError(BAD_REQUEST, "Password is invalid")
}

