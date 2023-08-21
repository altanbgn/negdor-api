import { Request, Response } from "express"
import httpStatus from "http-status"

// Locals
import type { LoginPayload, RegisterPayload } from "./types"
import validator from "./validator"
import operations from "./operations"
import catchAsync from "@/utils/catch-async"

export default {
  login: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const sanitizedPayload: LoginPayload = await validator.loginSchema.validateAsync(req.body)

    const result = await operations.login(sanitizedPayload)
    res.status(httpStatus.CREATED).send({ data: result })
  }),

  register: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const sanitizedPayload: RegisterPayload = await validator.registerSchema.validateAsync(req.body)

    const result = await operations.register(sanitizedPayload)
    res.status(httpStatus.CREATED).send({ data: result })
  }),
}
