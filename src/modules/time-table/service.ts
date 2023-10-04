import httpStatus from "http-status"

// Local
import prisma from "@/prisma"
import ApiError from "@/utils/api-error"
import {
  TimeTableCreatePayload,
  TimeTableUpdatePayload,
  TimeTableFindQuery
} from "./types"

export default class TimeTableService {
  public async find(query: TimeTableFindQuery) {
    const page = parseInt(query?.page as string || "1")
    const perPage = parseInt(query?.perPage as string || "10")
    const whereConditions: any = {}

    if (query?.organizationId && query?.organizationId.length > 0) {
      whereConditions.organizationId = query.organizationId
    }

    const preparedQuery = {
      skip: (page - 1) * perPage,
      take: perPage,
      where: whereConditions,
    }

    return {
      list: await prisma.timeTable.findMany(preparedQuery),
      currentPage: page,
      perPage: perPage,
      total: await prisma.timeTable.count()
    }
  }

  public async findById(id: string) {
    if (!id) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
    }

    return await prisma.timeTable.findUnique({ where: { id } })
  }

  public async create(payload: TimeTableCreatePayload) {
    payload.startTime = (new Date(`1970-01-01T${payload.startTime}:00.000Z`)).toISOString()
    payload.endTime = (new Date(`1970-01-01T${payload.endTime}:00.000Z`)).toISOString()

    return await prisma.timeTable.create({ data: payload })
  }

  public async updateById(id: string, payload: TimeTableUpdatePayload) {
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

  public async deleteById(id: string) {
    if (!id) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
    }

    return await prisma.timeTable.delete({ where: { id } })
  }
}
