import httpStatus from "http-status"

// Local
import prisma from "@/prisma"
import ApiError from "@/utils/api-error"
import { TimeTableUpdatePayload } from "../types"

export default async function (id: string, payload: TimeTableUpdatePayload) {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
  }

  if (payload.startTime) {
    payload.startTime = (new Date(`1970-01-01T${payload.startTime}:00.000Z`)).toISOString()
  }

  if (payload.endTime) {
    payload.endTime = (new Date(`1970-01-01T${payload.endTime}:00.000Z`)).toISOString()
  }

  return await prisma.timeTable.update({
    where: { id },
    data: payload
  })
}
