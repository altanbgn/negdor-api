import Joi from "joi"
import { BAD_REQUEST } from "http-status"
import ApiError from "@/utils/api-error"

const createSchema = Joi.object({
  title: Joi
    .string()
    .required()
    .error(new ApiError(BAD_REQUEST, "Title is required")),

  description: Joi
    .string()
    .required()
    .error(new ApiError(BAD_REQUEST, "Description is required")),

  price: Joi
    .number()
    .required()
    .error(new ApiError(BAD_REQUEST, "Price is required")),

  image: Joi
    .string()
    .required()
    .error(new ApiError(BAD_REQUEST, "Image is required")),

  menuId: Joi
    .string()
    .required()
    .error(new ApiError(BAD_REQUEST, "Menu is required")),
})

const updateSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  price: Joi.number(),
  image: Joi.string(),
  menuId: Joi.string()
})

const findQuerySchema = Joi.object({
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
