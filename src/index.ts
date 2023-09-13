import app from "@/app"
import prisma from "@/prisma"
import config from "@/utils/config"
import logger from "@/utils/logger"

let server: any
prisma.$connect().then(() => {
  logger.info("Connected to SQL Database")
})

server = app.listen(config.port, () => {
  logger.info(`Listening to port ${config.port}`)
  logger.info(`Server is on ${config.env}`)
})

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed")
      process.exit(1)
    })
  } else {
    process.exit(1)
  }
}

const unexpectedErrorHandler = (error: unknown) => {
  logger.error(error)
  exitHandler()
}

process.on("uncaughtException", unexpectedErrorHandler)
process.on("unhandledRejection", unexpectedErrorHandler)

process.on("SIGTERM", () => {
  logger.info("SIGTERM received")
  if (server) {
    server.close()
  }
})
