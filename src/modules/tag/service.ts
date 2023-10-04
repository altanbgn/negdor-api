import httpStatus from "http-status"

// Local
import prisma from "@/prisma"
import ApiError from "@/utils/api-error"
import {
  TagCreatePayload,
  TagUpdatePayload,
  TagFindQuery
} from "./types"

export default class TagService {
  public async find(query: TagFindQuery) {
    const page = parseInt(query?.page as string || "1")
    const perPage = parseInt(query?.perPage as string || "10")
    const whereConditions: any = {}

    if (query?.search && query?.search.length > 0) {
      whereConditions.value = { search: query.search }
    }

    const preparedQuery = {
      skip: (page - 1) * perPage,
      take: perPage,
      where: whereConditions
    }

    return {
      list: await prisma.tag.findMany(preparedQuery),
      page: page,
      perPage: perPage,
      total: await prisma.tag.count()
    }
  }

  public async findById(id: string) {
    if (!id) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
    }

    return await prisma.tag.findUnique({ where: { id } })
  }

  public async create(data: TagCreatePayload) {
    return await prisma.tag.create({ data })
  }

  public async updateById(id: string, data: TagUpdatePayload) {
    if (!id) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
    }

    return await prisma.tag.update({ where: { id }, data })
  }

  public async deleteById(id: string) {
    if (!id) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
    }

    return await prisma.tag.delete({ where: { id } })
  }
}
