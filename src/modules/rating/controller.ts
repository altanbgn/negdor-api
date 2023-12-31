import { Request, Response } from "express"
import httpStatus from "http-status"

// Locals
import RatingService from "./service"
import validator from "./validator"
import catchAsync from "@/utils/catch-async"
import { RatingCreatePayload, RatingUploadPayload } from "./types"

const service = new RatingService()

export default class RatingController {
  /* `/rating/list` - GET */
  find = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const sanitizedQuery = await validator.findQuerySchema.validateAsync(req.query)

    const result = await service.find(sanitizedQuery)
    res.status(httpStatus.OK).send({ data: result })
  })

  /* `/rating/:id` - GET */
  findById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await service.findById(req.params.id)
    res.status(httpStatus.OK).send({ data: result })
  })

  /* `/rating` - POST */
  create = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const sanitizedPayload: RatingCreatePayload = await validator.createSchema.validateAsync(req.body)

    const result = await service.create(sanitizedPayload, res.locals.user)
    res.status(httpStatus.CREATED).send({ data: result })
  })

  /* `/rating/:id` - PUT */
  updateById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const sanitizedPayload: RatingUploadPayload = await validator.updateSchema.validateAsync(req.body)

    const result = await service.updateById(req.params.id, sanitizedPayload)
    res.status(httpStatus.OK).send({ data: result })
  })

  /* `/rating/:id` - DELETE */
  deleteById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await service.deleteById(req.params.id)
    res.status(httpStatus.OK).send({ data: result })
  })
}
