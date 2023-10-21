import Joi from "joi"
import { BAD_REQUEST } from "http-status"
import ApiError from "@/utils/api-error"

const createSchema = Joi.object().keys({
  handle: Joi
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .error(new ApiError(BAD_REQUEST, "Handle must be lowercase and contain only letters and numbers")),

  name: Joi
    .string()
    .required()
    .error(new ApiError(BAD_REQUEST, "Name is required")),

  shortDescription: Joi
    .string()
    .required()
    .error(new ApiError(BAD_REQUEST, "Short description is required")),

  fullDescription: Joi
    .string()
    .required()
    .error(new ApiError(BAD_REQUEST, "Full description is required")),

  director: Joi
    .string()
    .required()
    .error(new ApiError(BAD_REQUEST, "Director is required")),

  emails: Joi.array().items(Joi.string()),
  phonenumbers: Joi.array().items(Joi.string()),
  locations: Joi.array().items(Joi.string()),
  socials: Joi.any(),

  logo: Joi.string(),
  banner: Joi.string(),

  images: Joi.array().items(Joi.string()),
  features: Joi.array().items(Joi.string()),
  categories: Joi.array().items(Joi.string()),

  tags: Joi.array().items(Joi.object().keys({ id: Joi.string() }))
})

const updateSchema = Joi.object().keys({
  name: Joi.string(),
  handle: Joi
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .error(new ApiError(BAD_REQUEST, "Handle must be lowercase and contain only letters and numbers")),
  shortDescription: Joi.string(),
  fullDescription: Joi.string(),
  director: Joi.string(),

  emails: Joi.array().items(Joi.string()),
  phonenumbers: Joi.array().items(Joi.string()),
  locations: Joi.array().items(Joi.string()),
  socials: Joi.any(),

  logo: Joi.string(),
  banner: Joi.string(),

  images: Joi.array().items(Joi.string()),
  features: Joi.array().items(Joi.string()),
  categories: Joi.array().items(Joi.string()),

  tags: Joi.array().items(Joi.object().keys({ id: Joi.string() }))
})

const findQuerySchema = Joi.object().keys({
  page: Joi.string(),
  perPage: Joi.string(),
  search: Joi
    .string()
    .max(255)
    .error(new ApiError(BAD_REQUEST, "Search max length is 255")),
})

export default {
  createSchema,
  updateSchema,
  findQuerySchema
}
