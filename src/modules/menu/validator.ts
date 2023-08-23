import Joi from "joi"

const createSchema = Joi.object().keys({
  name: Joi.string().required(),
  description: Joi.string().required()
})

const updateSchema = Joi.object().keys({
  name: Joi.string(),
  description: Joi.string()
})

const querySchema = Joi.object().keys({
  page: Joi.string(),
  perPage: Joi.string(),
  search: Joi.string().max(255),
})

export default {
  createSchema,
  updateSchema,
  querySchema
}
