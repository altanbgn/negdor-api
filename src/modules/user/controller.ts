import { Request, Response } from "express"
import httpStatus from "http-status"

// Locals
import operations from "./operations"
import validator from "./validator"
import catchAsync from "@/utils/catch-async"

export default {
  find: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await operations.find(req.query, res.locals.user)
    res.status(httpStatus.OK).send({ data: result })
  }),

  findMe: catchAsync(async (_req: Request, res: Response): Promise<void> => {
    const result = await operations.findById(res.locals.user.id)
    res.status(httpStatus.OK).send({ data: result })
  }),

  updateMe: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const validatedPayload = await validator.UpdateInputSchema.validateAsync(req.body)

    const result = await operations.updateById(res.locals.user.id, validatedPayload, res.locals.user)
    res.status(httpStatus.OK).send({ data: result })
  }),

  deleteMe: catchAsync(async (_req: Request, res: Response): Promise<void> => {
    const result = await operations.deleteById(res.locals.user.id, res.locals.user)
    res.status(httpStatus.OK).send({ data: result })
  }),

  changePasswordMe: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const validatedPayload = await validator.UpdatePasswordMeInputSchema.validateAsync(req.body)

    const result = await operations.changePasswordById(res.locals.user.id, validatedPayload, res.locals.user)
    res.status(httpStatus.OK).send({ data: result })
  }),

  create: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const validatedPayload = await validator.CreateInputSchema.validateAsync(req.body)

    const result = await operations.changePasswordById(res.locals.user.id, validatedPayload, res.locals.user)
    res.status(httpStatus.CREATED).send({ data: result })
  }),

  findById: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await operations.findById(req.params.id)
    res.status(httpStatus.OK).send({ data: result })
  }),

  updateById: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const validatedPayload = await validator.UpdateInputSchema.validateAsync(req.body)

    const result = await operations.updateById(req.params.id, validatedPayload, res.locals.user)
    res.status(httpStatus.OK).send({ data: result })
  }),

  deleteById: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await operations.deleteById(req.params.id, res.locals.user)
    res.status(httpStatus.OK).send({ data: result })
  }),

  changePasswordById: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const validatedPayload = await validator.UpdatePasswordByIdInputSchema.validateAsync(req.body)

    const result = await operations.changePasswordById(req.params.id, validatedPayload, res.locals.user)
    res.status(httpStatus.OK).send({ data: result })
  })
}
