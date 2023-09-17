import httpStatus from "http-status"

// Local
import prisma from "@/prisma"
import ApiError from "@/utils/api-error"
import { TimeTableUpdatePayload } from "../types"

export default async function (id: string, payload: TimeTableUpdatePayload) {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
  }

  return await prisma.timeTable.update({
    where: { id },
    data: payload
  })
}
