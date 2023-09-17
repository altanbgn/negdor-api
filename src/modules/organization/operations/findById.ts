import httpStatus from "http-status"

// Local
import prisma from "@/prisma"
import ApiError from "@/utils/api-error"

export default async function (id: string) {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
  }

  const result: any = await prisma.organization.findUnique({
    where: { id },
    include: {
      categories: {
        select: {
          id: true,
          icon: true,
          value: true
        }
      },
      timeTable: {
        select: {
          id: true,
          weekday: true,
          startTime: true,
          endTime: true,
        }
      },
    },
  })

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found!")
  }

  return result
}
