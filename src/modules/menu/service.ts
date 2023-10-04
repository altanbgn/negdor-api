import httpStatus from "http-status"

// Local
import prisma from "@/prisma"
import ApiError from "@/utils/api-error"
import {
  CreateMenuPayload,
  UpdateMenuPayload,
  MenuFindQuery
} from "./types"

export default class MenuService {
  public async find(query: MenuFindQuery) {
    const page = parseInt(query?.page as string || "1")
    const perPage = parseInt(query?.perPage as string || "10")
    const whereConditions: any = {}

    if (query?.search && query?.search.length > 0) {
      whereConditions.title = { search: query.search }
    }

    if (query?.organizationId && query?.organizationId.length > 0) {
      whereConditions.organizationId = query.organizationId
    }

    const preparedQuery = {
      skip: (page - 1) * perPage,
      take: perPage,
      where: whereConditions,
    }

    return {
      list: await prisma.menu.findMany(preparedQuery),
      page: page,
      perPage: perPage,
      total: await prisma.menu.count()
    }
  }

  public async findById(id: string) {
    if (!id) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
    }

    const result: any = await prisma.menu.findUnique({
      where: { id },
      include: { items: true },
    })

    if (!result) {
      throw new ApiError(httpStatus.NOT_FOUND, "Not found!")
    }

    return result
  }

  public async create(payload: CreateMenuPayload) {
    return await prisma.menu.create({ data: payload })
  }

  public async updateById(id: string, data: UpdateMenuPayload) {
    if (!id) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
    }

    return await prisma.menu.update({
      where: { id },
      data
    })
  }

  public async deleteById(id: string) {
    if (!id) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
    }

    return await prisma.menu.delete({ where: { id } })
  }
}
