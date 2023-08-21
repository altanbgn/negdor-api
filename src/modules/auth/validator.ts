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
  password: Joi.string().required(),
})

export default {
  loginSchema,
  registerSchema,
}
