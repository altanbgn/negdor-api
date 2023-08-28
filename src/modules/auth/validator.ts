import Joi from "joi"

const loginSchema = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().required().min(8).max(50)
})

const registerSchema = Joi.object().keys({
  avatar: Joi.string(),
  email: Joi.string().required(),
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  username: Joi.string().required(),
  phonenumber: Joi.string(),
  password: Joi.string().required().min(8).max(50)
})

const changePasswordSchema = Joi.object().keys({
  oldPassword: Joi.string().required().min(8).max(50),
  newPassword: Joi.string().required().min(8).max(50)
})

const forgotPasswordSchema = Joi.object().keys({
  email: Joi.string().email().required()
})

const recoverPasswordSchema = Joi.object().keys({
  password: Joi.string().required().min(8).max(50)
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
