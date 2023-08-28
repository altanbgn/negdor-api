import { sign } from "jsonwebtoken"

// Local
import mailer from "@/mailer"
import config from "@/utils/config"
import type { ForgotPasswordPayload } from "../types"

export default async function (data: ForgotPasswordPayload): Promise<void> {
  const token = sign(
    data,
    config.appSecret!,
    { expiresIn: `${String(config.jwtExpiresIn)}m`, algorithm: "HS512" }
  )

  await mailer.sendMail({
    from: config.mailerUser,
    to: data.email,
    subject: "Negdor - Forgot Password",
    html: `
      <p>
        Click <a href="${config.appUrl}/${config.apiPrefix}/auth/recover-password?token=${token}">here</a> to recover your password.
      </p>
    `
  })

  return
}
