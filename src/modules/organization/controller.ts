import { Request, Response } from "express"
import httpStatus from "http-status"

// Locals
import OrganizationService from "./service"
import validator from "./validator"
import catchAsync from "@/utils/catch-async"
import type { OrganizationCreatePayload, OrganizationUpdatePayload } from "./types"

const service = new OrganizationService()

export default class OrganizationController {
  /* `/organization/list` - GET */
  find = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const sanitizedQuery = await validator.findQuerySchema.validateAsync(req.query)
    const result = await service.find(sanitizedQuery)
    res.status(httpStatus.OK).send({ data: result })
  })

  /* `/organization/:id` - GET */
  findById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await service.findById(req.params.id)
    res.status(httpStatus.OK).send({ data: result })
  })

  /* `/organization` - POST */
  create = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const sanitizedPayload: OrganizationCreatePayload = await validator.createSchema.validateAsync(req.body)

    const result = await service.create(sanitizedPayload, res.locals.user)
    res.status(httpStatus.CREATED).send({ data: result })
  })

  /* `/organization/:id` - PUT */
  updateById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const sanitizedPayload: OrganizationUpdatePayload = await validator.updateSchema.validateAsync(req.body)

    const result = await service.updateById(req.params.id, sanitizedPayload)
    res.status(httpStatus.OK).send({ data: result })
  })

  /* `/organization/:id` - DELETE */
  deleteById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await service.deleteById(req.params.id)
    res.status(httpStatus.OK).send({ data: result })
  })
}
