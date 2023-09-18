// Local
import prisma from "@/prisma"
import { TimeTableCreatePayload } from "../types"

export default async function (payload: TimeTableCreatePayload) {
  payload.startTime = (new Date(`1970-01-01T${payload.startTime}:00.000Z`)).toISOString()
  payload.endTime = (new Date(`1970-01-01T${payload.endTime}:00.000Z`)).toISOString()

  return await prisma.timeTable.create({ data: payload })
}
