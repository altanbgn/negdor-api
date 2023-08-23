import Joi from "joi"

const createSchema = Joi.object().keys({
  title: Joi.string().required(),
  body: Joi.string().required(),
  organizationId: Joi.string().required()
})

const updateSchema = Joi.object().keys({
  title: Joi.string(),
  body: Joi.string(),
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