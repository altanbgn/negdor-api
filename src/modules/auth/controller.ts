import { Request, Response } from "express"
import httpStatus from "http-status"

// Locals
import catchAsync from "@/utils/catch-async"
import type {
  LoginPayload,
  RegisterPayload,
  ChangePasswordPayload,
  ForgotPasswordPayload
} from "./types"
import validator from "./validator"
import operations from "./operations"

export default {
  /* `/auth/login` - POST */
  login: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const sanitizedPayload: LoginPayload = await validator.loginSchema.validateAsync(req.body)

    const result = await operations.login(sanitizedPayload)
    res.status(httpStatus.CREATED).send({ data: result })
  }),

  /* `/auth/register` - POST */
  register: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const sanitizedPayload: RegisterPayload = await validator.registerSchema.validateAsync(req.body)

    const result = await operations.register(sanitizedPayload)
    res.status(httpStatus.CREATED).send({ data: result })
  }),

  /* `/auth/change-password` - POST */
  changePassword: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const sanitizedPayload: ChangePasswordPayload = await validator.changePasswordSchema.validateAsync(req.body)

    const result = await operations.changePassword(sanitizedPayload, res.locals.user)
    res.status(httpStatus.OK).send({ data: result })
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

    console.log(req.headers.authorization)

    await operations.recoverPassword(req.headers.authorization, sanitizedPayload)
    res.status(httpStatus.OK).send({ message: "Password reset successfully!" })
  })
}
