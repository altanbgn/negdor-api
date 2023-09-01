import Joi from "joi"
import { BAD_REQUEST } from "http-status"
import ApiError from "@/utils/api-error"

const createSchema = Joi.object().keys({
  icon: Joi.string(),
  parentId: Joi.string(),
  value: Joi
    .string()
    .required()
    .error(new ApiError(BAD_REQUEST, "Value is required"))
})

const updateSchema = Joi.object().keys({
  icon: Joi.string(),
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
