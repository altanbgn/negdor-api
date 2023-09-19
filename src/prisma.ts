import httpStatus from "http-status"
import { compare } from "bcryptjs"

// Local
import { PrismaClient } from "@prisma/client"
import ApiError from "./utils/api-error"

export const prismaCore = new PrismaClient()
export default prismaCore.$extends({
  model: {
    user: {
      async verifyPasswordByEmail(email: string, password: string) {
        const foundUser = await prismaCore.user.findUnique({ where: { email } })

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
        const foundUser = await prismaCore.user.findUnique({ where: { id } })

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
    },
    timeTable: {
      startTime: {
        compute(data: any) {
          return data.startTime.toISOString().slice(11, -1).slice(0, 5)
        }
      },
      endTime: {
        compute(data: any) {
          return data.endTime.toISOString().slice(11, -1).slice(0, 5)
        }
      }
    }
  }
})
