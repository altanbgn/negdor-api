import httpStatus from "http-status"

// Local
import prisma from "@/prisma"
import ApiError from "@/utils/api-error"
import {
  ContentCreatePayload,
  ContentFindQuery,
  ContentUpdatePayload
} from "./types"

export default class CategoryServices {
  public async find(query: ContentFindQuery) {
    const page = parseInt(query?.page as string || "1")
    const perPage = parseInt(query?.perPage as string || "10")
    const whereConditions: any = {}

    if (query?.search && query?.search.length > 0) {
      whereConditions.value = { search: query.search }
    }

    const preparedQuery = {
      skip: (page - 1) * perPage,
      take: perPage,
      where: whereConditions,
    }

    return {
      list: await prisma.content.findMany(preparedQuery),
      page,
      perPage,
      total: await prisma.content.count()
    }
  }

  public async create(data: ContentCreatePayload) {
    return await prisma.content.create({ data })
  }

  public async findByKey(key: string) {
    if (!key) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
    }

    return await prisma.content.findUnique({
      where: { key },
    })
  }

  public async updateByKey(key: string, payload: ContentUpdatePayload) {
    if (!key) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
    }

    return await prisma.content.update({
      where: { key },
      data: payload
    })
  }

  public async deleteByKey(key: string) {
    if (!key) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
    }

    return await prisma.content.delete({
      where: { key }
    })
  }
}
