import httpStatus from "http-status"

// Local
import prisma from "@/prisma"
import ApiError from "@/utils/api-error"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

export default async function(id: string) {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
  }

  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      avatar: true,
      firstname: true,
      lastname: true,
      username: true,
      email: true,
      phonenumber: true,
      organizations: true,
      createdAt: true,
      updatedAt: true,
      role: true
    }
  })
    .catch((error: PrismaClientKnownRequestError) => {
      if (error.code === "P2002") {
        throw new ApiError(httpStatus.BAD_REQUEST, "Can't create another rating for this org")
      }

      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong!")
    })
}
