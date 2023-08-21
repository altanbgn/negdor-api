import httpStatus from "http-status"

// Local
import prisma from "@/prisma"
import ApiError from "@/utils/api-error"
import { UpdatePayload } from "../types"

export default async function (id: string, data: UpdatePayload) {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "ID is not specified!")
  }

  const { categories = [], tags, ...queryData } = data

  return await prisma.organization.update({
    where: { id },
    data: {
      ...queryData,
      categories: {
        connect: [...categories]
      }
    }
  })
}
