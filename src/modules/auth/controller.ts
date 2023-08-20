import { Request, Response } from "express"
import httpStatus from "http-status"

// Locals
import type { LoginBody, RegisterBody } from "./types"
import validator from "./validator"
import operations from "./operations"
import catchAsync from "@/utils/catch-async"

export default {
  login: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const validatedData: LoginBody = await validator.loginInputSchema.validateAsync(req.body)

    const result = await operations.login(validatedData)
    res.status(httpStatus.CREATED).send({ data: result })
  }),

  register: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const validatedData: RegisterBody = await validator.registerInputSchema.validateAsync(req.body)

    const result = await operations.register(validatedData)
    res.status(httpStatus.CREATED).send({ data: result })
  }),
}
