import Joi from "joi"
import { BAD_REQUEST } from "http-status"
import ApiError from "@/utils/api-error"

const createSchema = Joi.object().keys({
  value: Joi.number()
    .min(0)
    .max(5)
    .required()
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.code) {
          case "any.required":
            throw new ApiError(BAD_REQUEST, "Rating is required")

          case "number.min":
            throw new ApiError(BAD_REQUEST, `Rating must be at least ${err.local.limit} characters long`)

          case "number.max":
            throw new ApiError(BAD_REQUEST, `Rating must be at most ${err.local.limit} characters long`)

          default:
            break
        }
      })

      throw new ApiError(BAD_REQUEST, "Rating is invalid")
    }),
  organizationId: Joi.string().required()
})

const updateSchema = Joi.object().keys({
  value: Joi.number()
    .min(0)
    .max(5)
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.code) {
          case "number.min":
            throw new ApiError(BAD_REQUEST, `Rating must be at least ${err.local.limit} characters long`)

          case "number.max":
            throw new ApiError(BAD_REQUEST, `Rating must be at most ${err.local.limit} characters long`)

          default:
            break
        }
      })

      throw new ApiError(BAD_REQUEST, "Rating is invalid")
    })
})

const findQuerySchema = Joi.object().keys({
  page: Joi.string(),
  perPage: Joi.string(),
  userId: Joi.string(),
  organizationId: Joi.string()
})

export default {
  createSchema,
  updateSchema,
  findQuerySchema
}
