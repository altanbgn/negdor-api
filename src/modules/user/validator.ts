import Joi from "joi"

const createSchema = Joi.object().keys({
  avatar: Joi.string(),
  email: Joi.string().required(),
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  username: Joi.string().required(),
  phonenumber: Joi.string(),
  password: Joi.string().required()
})

const updateSchema = Joi.object().keys({
  avatar: Joi.string(),
  firstname: Joi.string(),
  lastname: Joi.string(),
  username: Joi.string()
})

const updatePasswordByIdInputSchema = Joi.object().keys({
  newPassword: Joi.string().required()
})

const updatePasswordMeInputSchema = Joi.object().keys({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required()
})

export default {
  createSchema,
  updateSchema,
  updatePasswordByIdInputSchema,
  updatePasswordMeInputSchema
}
