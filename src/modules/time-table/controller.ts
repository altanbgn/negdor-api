import { Request, Response } from "express"
import httpStatus from "http-status"

// Locals
import TimeTableService from "./service"
import validator from "./validator"
import catchAsync from "@/utils/catch-async"

const service = new TimeTableService()

export default class TimeTableController {
  /* `/time-table/list` - GET */
  find = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const sanitizedQuery = await validator.findQuerySchema.validateAsync(req.query)
    const result = await service.find(sanitizedQuery)

    res.status(httpStatus.OK).send({ data: result })
  })

  /* `/time-table/:id` - GET */
  findById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await service.findById(req.params.id)
    res.status(httpStatus.OK).send({ data: result })
  })

  /* `/time-table` - POST */
  create = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const sanitizedPayload = await validator.createSchema.validateAsync(req.body)

    const result = await service.create(sanitizedPayload)
    res.status(httpStatus.CREATED).send({ data: result })
  })

  /* `/time-table/:id` - PUT */
  updateById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const sanitizedPayload = await validator.updateSchema.validateAsync(req.body)

    const result = await service.updateById(req.params.id, sanitizedPayload)
    res.status(httpStatus.OK).send({ data: result })
  })

  /* `/time-table/:id` - DELETE */
  deleteById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await service.deleteById(req.params.id)
    res.status(httpStatus.OK).send({ data: result })
  })
}
