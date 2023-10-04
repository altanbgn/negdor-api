import { Request, Response } from "express"
import httpStatus from "http-status"

// Locals
import UserService from "./service"
import validator from "./validator"
import catchAsync from "@/utils/catch-async"

const service = new UserService()

export default class UserController {
  /* `/user/list` - GET */
  find = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const sanitizedQuery = await validator.findQuerySchema.validateAsync(req.query)
    const result = await service.find(sanitizedQuery)
    res.status(httpStatus.OK).send({ data: result })
  })

  /* `/user/:id` - GET */
  findById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await service.findById(req.params.id)
    res.status(httpStatus.OK).send({ data: result })
  })

  /* `/user` - POST */
  create = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const sanitizedPayload = await validator.createSchema.validateAsync(req.body)

    const result = await service.create(sanitizedPayload)
    res.status(httpStatus.CREATED).send({ data: result })
  })

  /* `/user/:id` - PUT */
  updateById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const sanitizedPayload = await validator.updateSchema.validateAsync(req.body)

    const result = await service.updateById(req.params.id, sanitizedPayload)
    res.status(httpStatus.OK).send({ data: result })
  })

  /* `/user/:id` - DELETE */
  deleteById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await service.deleteById(req.params.id)
    res.status(httpStatus.OK).send({ data: result })
  })

  /* `/user/send-verify-email` - GET */
  sendVerifyEmail = catchAsync(async (_req: Request, res: Response): Promise<void> => {
    await service.sendVerifyEmail(res.locals.user.email)
    res.status(httpStatus.OK).send({ message: "Verification email sent successfully!" })
  })

  /* `/user/verify-email` - GET */
  verifyEmail = catchAsync(async (req: Request, res: Response): Promise<void> => {
    await service.verifyEmail(res.locals.user, req.query.token as string)
    res.status(httpStatus.OK).send({ message: "Email verified!" })
  })

  /* `/user/change-password` - POST */
  changePassword = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const sanitizedPayload = await validator.changePasswordSchema.validateAsync(req.body)

    const result = await service.changePassword(sanitizedPayload, res.locals.user)
    res.status(httpStatus.OK).send({ data: result })
  })

  /**
   * User's own service
   */

  /* `/user/me` - GET */
  findMe = catchAsync(async (_req: Request, res: Response): Promise<void> => {
    const result = await service.findById(res.locals.user.id)
    res.status(httpStatus.OK).send({ data: result })
  })


  /* `/user/me` - GET */
  updateMe = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const sanitizedPayload = await validator.updateSchema.validateAsync(req.body)

    const result = await service.updateById(res.locals.user.id, sanitizedPayload)
    res.status(httpStatus.OK).send({ data: result })
  })

  /* `/user/:id` - DELETE */
  deleteMe = catchAsync(async (_req: Request, res: Response): Promise<void> => {
    const result = await service.deleteById(res.locals.user.id)
    res.status(httpStatus.OK).send({ data: result })
  })
}
