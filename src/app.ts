import express from "express"
import helmet from "helmet"
import compression from "compression"
import cors from "cors"
import httpStatus from "http-status"

// Local
import config from "@/utils/config"
import ApiError from "@/utils/api-error"
import { errorConverter, errorHandler } from "@/middlewares/error"
import routes from "@/routes"

const app = express()

app.disable("x-powered-by")

app.use(helmet())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(compression())
app.use(cors({
  credentials: true,
  origin: config.env === "development" ? "*" : [
    config.appUrl || ""
  ]
}))

app.use(`/${config.apiPrefix}`, routes)

app.use((_req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'))
})

app.use(errorConverter)
app.use(errorHandler)

export default app
