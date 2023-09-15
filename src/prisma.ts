import httpStatus from "http-status"
import { compare } from "bcryptjs"

// Local
import { PrismaClient } from "@prisma/client"
import ApiError from "./utils/api-error"

const prisma = new PrismaClient()
const prismaExtended = prisma.$extends({
  model: {
    user: {
      async verifyPasswordByEmail(email: string, password: string) {
        const foundUser = await prisma.user.findUnique({ where: { email } })

        if (!foundUser) {
          throw new ApiError(httpStatus.NOT_FOUND, "User not found!")
        }

        const checkPassword = await compare(password, foundUser.password || "")

        if (!checkPassword) {
          throw new ApiError(httpStatus.UNAUTHORIZED, "Wrong Password!")
        }

        return foundUser
      },
      async verifyPasswordById(id: string, password: string) {
        const foundUser = await prisma.user.findUnique({ where: { id } })

        if (!foundUser) {
          throw new ApiError(httpStatus.NOT_FOUND, "User not found!")
        }

        const checkPassword = await compare(password, foundUser.password || "")

        if (!checkPassword) {
          throw new ApiError(httpStatus.UNAUTHORIZED, "Wrong Password!")
        }

        return foundUser
      }
    }
  },
  result: {
    user: {
      password: {
        compute() {
          return "********"
        }
      }
    }
  }
})

export default prismaExtended
