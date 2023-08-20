import dotenv from "dotenv"

dotenv.config()

export default {
  port: parseInt(process.env.PORT || "3000"),
  env: process.env.NODE_ENV || "development",
  appUrl: process.env.APP_URL || `http://localhost:${process.env.PORT}`,
  appSecret: process.env.APP_SECRET || "default app secret",
  apiVersion: process.env.API_VERSION || "1.0.0",
  apiPrefix: process.env.API_PREFIX || "v1",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || 3
}
