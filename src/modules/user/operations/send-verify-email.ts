import { sign } from "jsonwebtoken"
// Local
import mailer from "@/mailer"
import config from "@/utils/config"

export default async function(email: string): Promise<void> {
  const token = sign(
    { email: email },
    config.appSecret!,
    {
      expiresIn: `${String(config.jwtExpiresIn)}m`,
      algorithm: "HS512"
    }
  )

  await mailer.sendMail({
    from: config.mailerUser,
    to: email,
    subject: "Negdor - Verify your email",
    html: `
      <h1>Verify your email</h1>
      <p>Click <a href="${config.appUrl}/user/verify-email?token=${token}">here</a> to verify your email.</p>
    `
  })
}
