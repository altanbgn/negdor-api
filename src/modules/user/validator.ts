import Joi from "joi"
import { BAD_REQUEST } from "http-status"
import ApiError from "@/utils/api-error"
import { passwordErrorHandler } from "@/utils/validation-error-handler"

const createSchema = Joi.object().keys({
  avatar: Joi.string(),
  bio: Joi.string(),
  email: Joi
    .string()
    .required()
    .error(new ApiError(BAD_REQUEST, "Email is required")),

  firstname: Joi
    .string()
    .required()
    .error(new ApiError(BAD_REQUEST, "Firstname is required")),

  lastname: Joi
    .string()
    .required()
    .error(new ApiError(BAD_REQUEST, "Lastname is required")),

  username: Joi
    .string()
    .required()
    .error(new ApiError(BAD_REQUEST, "Username is required")),

  phonenumber: Joi
    .string()
    .required()
    .error(new ApiError(BAD_REQUEST, "Phonenumber is required")),

  password: Joi
    .string()
    .required()
    .error(passwordErrorHandler)
})

const updateSchema = Joi.object().keys({
  avatar: Joi.string(),
  bio: Joi.string(),
  firstname: Joi.string(),
  lastname: Joi.string(),
  username: Joi.string()
})

const findQuerySchema = Joi.object().keys({
  page: Joi.string(),
  perPage: Joi.string(),
  search: Joi
    .string()
    .max(255)
    .error(new ApiError(BAD_REQUEST, "Search max length is 255"))
})

const changePasswordSchema = Joi.object().keys({
  oldPassword: Joi
    .string()
    .required()
    .min(8)
    .max(50)
    .error(passwordErrorHandler),

  newPassword: Joi
    .string()
    .required()
    .min(8)
    .max(50)
    .error(passwordErrorHandler)
})

export default {
  createSchema,
  updateSchema,
  findQuerySchema,
  changePasswordSchema
}
