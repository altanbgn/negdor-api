import { Request, Response } from "express"
import httpStatus from "http-status"

// Locals
import operations from "./operations"
import validator from "./validator"
import catchAsync from "@/utils/catch-async"

export default {
  find: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const sanitizedQuery = await validator.querySchema.validateAsync(req.query)

    const result = await operations.find(sanitizedQuery)
    res.status(httpStatus.OK).send({ data: result })
  }),

  findById: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await operations.findById(req.params.id)
    res.status(httpStatus.OK).send({ data: result })
  }),

  create: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const sanitizedPayload = await validator.createSchema.validateAsync(req.body)

    const result = await operations.create(sanitizedPayload)
    res.status(httpStatus.OK).send({ data: result })
  }),

  updateById: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const sanitizedPayload = await validator.updateSchema.validateAsync(req.body)

    const result = await operations.updateById(req.params.id, sanitizedPayload)
    res.status(httpStatus.OK).send({ data: result })
  }),

  deleteById: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await operations.deleteById(req.params.id)
    res.status(httpStatus.OK).send({ data: result })
  })
}
