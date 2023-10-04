import httpStatus from "http-status"

// Local
import prisma from "@/prisma"
import ApiError from "@/utils/api-error"
import {
  CreateMenuItemPayload,
  UpdateMenuItemPayload,
  MenuItemFindQuery
} from "./types"

export default class MenuItemService {
  public async find(query: MenuItemFindQuery) {
    const page = parseInt(query?.page as string || "1")
    const perPage = parseInt(query?.perPage as string || "10")
    const whereConditions: any = {}

    if (query?.search && query?.search.length > 0) {
      whereConditions.title = { search: query.search }
    }

    const preparedQuery = {
      skip: (page - 1) * perPage,
      take: perPage,
      where: whereConditions
    }

    return {
      list: await prisma.menuItem.findMany(preparedQuery),
      page: page,
      perPage: perPage,
      total: await prisma.menuItem.count()
    }
  }

  public async findById(id: string) {
    if (!id) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
    }

    const result: any = await prisma.menuItem.findUnique({
      where: { id },
    })

    if (!result) {
      throw new ApiError(httpStatus.NOT_FOUND, "Not found!")
    }

    return result
  }

  public async create(data: CreateMenuItemPayload) {
    return await prisma.menuItem.create({ data })
  }

  public async updateById(id: string, data: UpdateMenuItemPayload) {
    if (!id) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
    }

    return await prisma.menuItem.update({
      where: { id },
      data
    })
  }

  public async deleteById(id: string) {
    if (!id) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
    }

    return await prisma.menuItem.delete({ where: { id } })
  }
}
