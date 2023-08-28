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

const findQuerySchema = Joi.object().keys({
  page: Joi.string(),
  perPage: Joi.string(),
  search: Joi.string().max(255),
})

export default {
  createSchema,
  updateSchema,
  findQuerySchema
}
