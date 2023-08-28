import Joi from "joi"

const loginSchema = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().required()
})

const registerSchema = Joi.object().keys({
  avatar: Joi.string(),
  email: Joi.string().required(),
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  username: Joi.string().required(),
  phonenumber: Joi.string(),
  password: Joi.string().required()
})

const changePasswordSchema = Joi.object().keys({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required()
})

const forgotPasswordSchema = Joi.object().keys({
  email: Joi.string().email().required()
})

const recoverPasswordSchema = Joi.object().keys({
  password: Joi.string().required()
})

const recoverPasswordQuerySchema = Joi.object().keys({
  token: Joi.string().required()
})

export default {
  loginSchema,
  registerSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  recoverPasswordSchema,
  recoverPasswordQuerySchema
}
