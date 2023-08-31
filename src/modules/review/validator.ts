import Joi from "joi"

const createSchema = Joi.object().keys({
  title: Joi.string().required(),
  body: Joi.string().required(),
  organizationId: Joi.string().required()
})

const updateSchema = Joi.object().keys({
  title: Joi.string(),
  body: Joi.string()
})

const findQuerySchema = Joi.object().keys({
  page: Joi.string(),
  perPage: Joi.string(),
  userId: Joi.string(),
  organizationId: Joi.string()
})

export default {
  createSchema,
  updateSchema,
  findQuerySchema
}
