import Joi from "joi"

const createSchema = Joi.object().keys({
  value: Joi.number().min(0).max(5).required(),
  organizationId: Joi.string().required()
})

const updateSchema = Joi.object().keys({
  value: Joi.number().min(0).max(5),
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
