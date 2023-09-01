import Joi from "joi"
import { BAD_REQUEST } from "http-status"
import ApiError from "@/utils/api-error"

const createSchema = Joi.object().keys({
  title: Joi.string().required(),
  description: Joi
    .string()
    .required()
    .error(new ApiError(BAD_REQUEST, "Description is required"))
})

const updateSchema = Joi.object().keys({
  title: Joi.string(),
  description: Joi.string()
})

const findQuerySchema = Joi.object().keys({
  page: Joi.string(),
  perPage: Joi.string(),
  organizationId: Joi.string(),
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
