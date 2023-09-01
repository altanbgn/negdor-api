import Joi from "joi"
import { BAD_REQUEST } from "http-status"
import ApiError from "@/utils/api-error"
import { passwordErrorHandler } from "@/utils/validation-error-handler"

const loginSchema = Joi.object().keys({
  email: Joi
    .string()
    .required()
    .error(new ApiError(BAD_REQUEST, "Email is required")),

  password: Joi.string()
    .min(8)
    .max(50)
    .required()
    .error((errors) => passwordErrorHandler(errors))
})

const registerSchema = Joi.object().keys({
  avatar: Joi.string(),

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

  phonenumber: Joi.string(),

  password: Joi
    .string()
    .required()
    .min(8)
    .max(50)
    .error(passwordErrorHandler)
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

const forgotPasswordSchema = Joi.object().keys({
  email: Joi
    .string()
    .email()
    .required()
    .error(new ApiError(BAD_REQUEST, "Email is required"))
})

const recoverPasswordSchema = Joi.object().keys({
  password: Joi
    .string()
    .required()
    .min(8)
    .max(50)
    .error(passwordErrorHandler)
})

const recoverPasswordQuerySchema = Joi.object().keys({
  token: Joi
    .string()
    .required()
    .error(new ApiError(BAD_REQUEST, "Token is required"))
})

export default {
  loginSchema,
  registerSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  recoverPasswordSchema,
  recoverPasswordQuerySchema
}
