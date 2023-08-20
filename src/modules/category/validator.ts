import Joi from "joi"

const CreateInputSchema = Joi.object().keys({
  icon: Joi.string(),
  parentId: Joi.string(),
  value: Joi.string().required(),
})

const UpdateInputSchema = Joi.object().keys({
  icon: Joi.string(),
  parentId: Joi.string(),
  value: Joi.string(),
})

const QuerySchema = Joi.object().keys({
  page: Joi.string(),
  perPage: Joi.string(),
  search: Joi.string().max(300),
})

export default {
  CreateInputSchema,
  UpdateInputSchema,
  QuerySchema
}
