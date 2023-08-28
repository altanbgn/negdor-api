import { Request, Response } from "express"
import httpStatus from "http-status"

// Locals
import operations from "./operations"
import validator from "./validator"
import catchAsync from "@/utils/catch-async"

export default {
  /* `/menu/list` - GET */
  find: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const sanitizedQuery = await validator.findQuerySchema.validateAsync(req.query)

    const result = await operations.find(sanitizedQuery)
    res.status(httpStatus.OK).send({ data: result })
  }),

  /* `/menu/:id` - GET */
  findById: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await operations.findById(req.params.id)
    res.status(httpStatus.OK).send({ data: result })
  }),

  /* `/menu` - POST */
  create: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const sanitizedPayload = await validator.createSchema.validateAsync(req.body)

    const result = await operations.create(sanitizedPayload)
    res.status(httpStatus.CREATED).send({ data: result })
  }),

  /* `/menu/:id` - PUT */
  updateById: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const sanitizedPayload = await validator.updateSchema.validateAsync(req.body)

    const result = await operations.updateById(req.params.id, sanitizedPayload)
    res.status(httpStatus.OK).send({ data: result })
  }),

  /* `/menu/:id` - DELETE */
  deleteById: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await operations.deleteById(req.params.id)
    res.status(httpStatus.OK).send({ data: result })
  })
}
