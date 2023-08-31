import Joi from "joi"

const createSchema = Joi.object().keys({
  title: Joi.string().required(),
  description: Joi.string().required()
})

const updateSchema = Joi.object().keys({
  title: Joi.string(),
  description: Joi.string()
})

const findQuerySchema = Joi.object().keys({
  page: Joi.string(),
  perPage: Joi.string(),
  search: Joi.string().max(255),
  organizationId: Joi.string()
})

export default {
  createSchema,
  updateSchema,
  findQuerySchema
}
