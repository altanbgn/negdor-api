import { Request, Response } from "express"
import httpStatus from "http-status"

// Locals
import catchAsync from "@/utils/catch-async"
import validator from "./validator"
import operations from "./operations"
import type {
  LoginPayload,
  RegisterPayload,
  ChangePasswordPayload,
  ForgotPasswordPayload
} from "./types"

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

    await operations.recoverPassword(req.headers.authorization, sanitizedPayload)
    res.status(httpStatus.OK).send({ message: "Password reset successfully!" })
  })
}
