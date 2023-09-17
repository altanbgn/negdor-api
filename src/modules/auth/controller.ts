import { Request, Response } from "express"
import httpStatus from "http-status"

// Locals
import catchAsync from "@/utils/catch-async"
import type { LoginPayload, RegisterPayload, ChangePasswordPayload, ForgotPasswordPayload } from "./types"
import validator from "./validator"
import operations from "./operations"

export default {
  /* `/auth/login-facebook` - GET */
  loginFacebook: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await operations.loginFacebook(req.query)
    res.status(httpStatus.OK).send({ data: result })
  }),

  /* `/auth/login-google` - GET */
  loginGoogle: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await operations.loginGoogle(req.query)
    res.status(httpStatus.OK).send({ data: result })
  }),

  /* `/auth/login` - POST */
  login: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const sanitizedPayload: LoginPayload = await validator.loginSchema.validateAsync(req.body)

    const result = await operations.login(sanitizedPayload)
    res.status(httpStatus.CREATED).send({ data: result })
  }),

  /* `/auth/register` - POST */
  register: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const sanitizedPayload: RegisterPayload = await validator.registerSchema.validateAsync(req.body)

    await operations.register(sanitizedPayload)
    res.status(httpStatus.CREATED).send({ message: "User registered successfully!" })
  }),

  /* `/auth/forgot-password` - POST */
  forgotPassword: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const sanitizedPayload: ForgotPasswordPayload = await validator.forgotPasswordSchema.validateAsync(req.body)

    await operations.forgotPassword(sanitizedPayload)
    res.status(httpStatus.OK).send({ message: "Password reset email sent successfully!" })
  }),

  /* `/auth/recover-password` - POST */
  recoverPassword: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const sanitizedPayload = await validator.recoverPasswordSchema.validateAsync(req.body)

    await operations.recoverPassword(req.query.token as string, sanitizedPayload)
    res.status(httpStatus.OK).send({ message: "Password reset successfully!" })
  })
}
