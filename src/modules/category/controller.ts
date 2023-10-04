import { Request, Response } from "express"
import httpStatus from "http-status"

// Locals
import CategoryServices from "./services"
import validator from "./validator"
import catchAsync from "@/utils/catch-async"

const services = new CategoryServices()

export default class CategoryController {
  find = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const sanitizedQuery = await validator.findQuerySchema.validateAsync(req.query)
    const result = await services.find(sanitizedQuery)

    res.status(httpStatus.OK).send({ data: result })
  })

  findById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await services.findById(req.params.id)
    res.status(httpStatus.OK).send({ data: result })
  })

  create = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const sanitizedPayload = await validator.createSchema.validateAsync(req.body)

    const result = await services.create(sanitizedPayload)
    res.status(httpStatus.CREATED).send({ data: result })
  })

  updateById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const sanitizedPayload = await validator.updateSchema.validateAsync(req.body)

    const result = await services.updateById(req.params.id, sanitizedPayload)
    res.status(httpStatus.OK).send({ data: result })
  })

  deleteById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await services.deleteById(req.params.id)
    res.status(httpStatus.OK).send({ data: result })
  })
}
