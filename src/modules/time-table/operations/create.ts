// Local
import prisma from "@/prisma"
import { TimeTableCreatePayload } from "../types"

export default async function (payload: TimeTableCreatePayload) {
  return await prisma.timeTable.create({ data: payload })
}
