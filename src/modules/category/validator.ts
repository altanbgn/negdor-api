import Joi from "joi"
import { BAD_REQUEST } from "http-status"
import ApiError from "@/utils/api-error"

const createSchema = Joi.object().keys({
  icon: Joi.string(),
  handle: Joi
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .error(new ApiError(BAD_REQUEST, "Key must be lowercase and contain only letters and numbers")),
  parentId: Joi.string(),
  value: Joi
    .string()
    .required()
    .error(new ApiError(BAD_REQUEST, "Value is required"))
})

const updateSchema = Joi.object().keys({
  icon: Joi.string(),
  handle: Joi
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .error(new ApiError(BAD_REQUEST, "Key must be lowercase and contain only letters and numbers")),
  parentId: Joi.string(),
  value: Joi.string()
})

const findQuerySchema = Joi.object().keys({
  page: Joi.string(),
  perPage: Joi.string(),
  parentId: Joi.string(),
  search: Joi
    .string()
    .max(255)
    .error(new ApiError(BAD_REQUEST, "Search max length is 255"))
})

export default {
  createSchema,
  updateSchema,
  findQuerySchema
}
