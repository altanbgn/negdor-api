import Joi from "joi"

const createSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  image: Joi.string().required(),
})

const updateSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  price: Joi.number(),
  image: Joi.string(),
})

const querySchema = Joi.object({
  page: Joi.string(),
  perPage: Joi.string(),
  search: Joi.string().max(255),
})

export default {
  createSchema,
  updateSchema,
  querySchema
}
