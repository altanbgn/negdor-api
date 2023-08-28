import httpStatus from "http-status"
import { genSalt, hash, compare } from "bcryptjs"

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

        const checkPassword = await compare(password, foundUser.password)

        if (!checkPassword) {
          throw new ApiError(httpStatus.UNAUTHORIZED, "Wrong Password!")
        }

        return foundUser
      },
      async generatePasswordById(id: string, oldPassword: string, newPassword: string) {
        const foundUser = await prisma.user.findUnique({ where: { id } })

        if (!foundUser) {
          throw new ApiError(httpStatus.NOT_FOUND, "User not found!")
        }

        const checkPassword = await compare(oldPassword, foundUser.password)

        if (!checkPassword) {
          throw new ApiError(httpStatus.UNAUTHORIZED, "Wrong Password!")
        }

        const salt = await genSalt(12)
        const hashedPassword = await hash(newPassword, salt)

        if (!hashedPassword) {
          throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong!")
        }

        return hashedPassword
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
