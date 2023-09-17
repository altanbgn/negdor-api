import Joi from "joi"
import { BAD_REQUEST } from "http-status"
import ApiError from "@/utils/api-error"

const createSchema = Joi.object().keys({
  weekday: Joi
    .string()
    .valid("MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY")
    .required()
    .error(new ApiError(BAD_REQUEST, "Invalid weekday")),
  startTime: Joi
    .string()
    .required()
    .error(new ApiError(BAD_REQUEST, "Invalid start time")),
  endTime: Joi
    .string()
    .required()
    .error(new ApiError(BAD_REQUEST, "Invalid end time")),
  organizationId: Joi
    .string()
    .required()
    .error(new ApiError(BAD_REQUEST, "Invalid organization id"))
})

const updateSchema = Joi.object().keys({
  weekday: Joi
    .string()
    .valid("MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY")
    .error(new ApiError(BAD_REQUEST, "Invalid weekday")),
  startTime: Joi.date(),
  endTime: Joi.date()
})

const findQuerySchema = Joi.object().keys({
  page: Joi.string(),
  perPage: Joi.string(),
  organization: Joi.string()
})

export default {
  createSchema,
  updateSchema,
  findQuerySchema
}
