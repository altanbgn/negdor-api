import Joi from "joi"
import { BAD_REQUEST } from "http-status"
import ApiError from "@/utils/api-error"

const createSchema = Joi.object().keys({
  title: Joi
    .string()
    .required()
    .error(new ApiError(BAD_REQUEST, "Title is required")),

  body: Joi
    .string()
    .required()
    .error(new ApiError(BAD_REQUEST, "Body is required")),

  organizationId: Joi
    .string()
    .required()
    .error(new ApiError(BAD_REQUEST, "Organization is required")),
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
