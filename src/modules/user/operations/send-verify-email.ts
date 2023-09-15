import { sign } from "jsonwebtoken"
// Local
import mailer from "@/mailer"
import config from "@/utils/config"

export default async function(user: any): Promise<void> {
  const token = sign(
    { email: user.email },
    config.appSecret!,
    {
      expiresIn: `${String(config.jwtExpiresIn)}m`,
      algorithm: "HS512"
    }
  )

  await mailer.sendMail({
    from: config.mailerUser,
    to: user.email,
    subject: "Negdor - Verify your email",
    html: `
      <h1>Verify your email</h1>
      <p>Click <a href="${config.appUrl}/auth/verify-password?token=${token}">here</a> to verify your email.</p>
    `
  })
}
