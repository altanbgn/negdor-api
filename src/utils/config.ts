import dotenv from "dotenv"

dotenv.config()

export default {
  port: parseInt(process.env.PORT || "3000", 10),
  env: process.env.NODE_ENV || "development",
  appUrl: process.env.APP_URL || `http://localhost:${process.env.PORT}`,
  appSecret: process.env.APP_SECRET || "default app secret",
  apiVersion: process.env.API_VERSION || "1.0.0",
  apiPrefix: process.env.API_PREFIX || "v1",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || 3,
  mailerUser: process.env.MAILER_USER || "default mailer user",
  mailerPass: process.env.MAILER_PASS || "default mailer pass",
  facebookAppId: process.env.FACEBOOK_APP_ID || "default facebook client id",
  facebookAppSecret: process.env.FACEBOOK_APP_SECRET || "default facebook client secret",
  googleAppId: process.env.GOOGLE_APP_ID || "default google app id",
  googleAppSecret: process.env.GOOGLE_APP_SECRET || "default google app id"
}
