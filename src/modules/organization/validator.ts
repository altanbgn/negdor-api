import Joi from "joi"

const createSchema = Joi.object().keys({
  name: Joi.string().required(),
  shortDescription: Joi.string().required(),
  fullDescription: Joi.string().required(),
  director: Joi.string().required(),
  emails: Joi.array().items(Joi.string()),
  phonenumbers: Joi.array().items(Joi.string()),
  locations: Joi.array().items(Joi.string()),
  features: Joi.array().items(Joi.string()),
  logo: Joi.string(),
  banner: Joi.string(),
  images: Joi.array().items(Joi.string()),
  tags: Joi.array().items(Joi.object().keys({
    id: Joi.string()
  }))
})

const updateSchema = Joi.object().keys({
  name: Joi.string(),
  shortDescription: Joi.string(),
  fullDescription: Joi.string(),
  director: Joi.string(),
  emails: Joi.array().items(Joi.string()),
  phonenumbers: Joi.array().items(Joi.string()),
  locations: Joi.array().items(Joi.string()),
  features: Joi.array().items(Joi.string()),
  logo: Joi.string(),
  banner: Joi.string(),
  images: Joi.array().items(Joi.string()),
  categories: Joi.array().items(Joi.object().keys({
    id: Joi.string()
  })),
  tags: Joi.array().items(Joi.object().keys({
    id: Joi.string()
  }))
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
