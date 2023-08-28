import httpStatus from "http-status"
import ApiError from "@/utils/api-error"
import prisma from "@/prisma"

export default async function (id: string) {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
  }

  const result: any = await prisma.review.findUnique({
    where: { id },
    include: {
      createdUser: {
        select: {
          avatar: true,
          firstname: true,
          username: true,
          lastname: true,
          role: true,
        }
      },
      organization: {
        select: {
          name: true,
          shortDescription: true,
          fullDescription: true,
          director: true,
          emails: true,
          phonenumbers: true,
          locations: true,
        }
      }
    }
  })

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found!")
  }

  return result
}
