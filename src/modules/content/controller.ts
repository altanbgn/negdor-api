import { Request, Response } from "express"
import httpStatus from "http-status"

// Locals
import ContentService from "./service"
import validator from "./validator"
import catchAsync from "@/utils/catch-async"

const services = new ContentService()

export default class ContentController {
  create = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const sanitizedPayload = await validator.createSchema.validateAsync(req.body)

    const result = await services.create(sanitizedPayload)
    res.status(httpStatus.CREATED).send({ data: result })
  })

  find = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const sanitizedQuery = await validator.findQuerySchema.validateAsync(req.query)
    const result = await services.find(sanitizedQuery)

    res.status(httpStatus.OK).send({ data: result })
  })

  findByKey = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await services.findByKey(req.params.key)
    res.status(httpStatus.OK).send({ data: result })
  })

  updateByKey = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const sanitizedPayload = await validator.updateSchema.validateAsync(req.body)

    const result = await services.updateByKey(req.params.key, sanitizedPayload)
    res.status(httpStatus.OK).send({ data: result })
  })

  deleteByKey = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await services.deleteByKey(req.params.key)
    res.status(httpStatus.OK).send({ data: result })
  })
}
