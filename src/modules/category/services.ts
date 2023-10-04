import httpStatus from "http-status"

// Local
import prisma from "@/prisma"
import ApiError from "@/utils/api-error"
import { handleConverter } from "@/utils/tools"
import {
  CategoryCreatePayload,
  CategoryFindQuery,
  CategoryUpdatePayload
} from "./types"

export default class CategoryServices {
  public async find(query: CategoryFindQuery) {
    const page = parseInt(query?.page as string || "1")
    const perPage = parseInt(query?.perPage as string || "10")
    const whereConditions: any = {}

    if (query?.search && query?.search.length > 0) {
      whereConditions.value = { search: query.search }
    }

    if (query?.organizationId && query?.organizationId.length > 0) {
      whereConditions.organizationId = query.organizationId
    }

    if (query?.parentId && query?.parentId.length > 0) {
      whereConditions.parentId = query.parentId
    }

    const preparedQuery = {
      skip: (page - 1) * perPage,
      take: perPage,
      where: whereConditions,
      include: { children: true },
    }

    return {
      list: await prisma.category.findMany(preparedQuery),
      currentPage: page,
      perPage: perPage,
      total: await prisma.category.count()
    }
  }

  public async findById(id: string) {
    if (!id) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
    }

    return await prisma.category.findUnique({
      where: { id },
      include: { children: true }
    })
  }

  public async create(data: CategoryCreatePayload) {
    return await prisma.category.create({
      data: { ...data, handle: handleConverter(data.handle || data.value) }
    })
  }

  public async updateById(id: string, payload: CategoryUpdatePayload) {
    if (!id) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
    }

    return await prisma.category.update({
      where: { id },
      data: payload
    })
  }

  public async deleteById(id: string) {
    if (!id) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
    }

    const foundResult = await prisma.category.findFirst({
      where: { id },
      include: {
        _count: {
          select: {
            children: true
          }
        }
      }
    })

    if (foundResult?._count.children !== 0) {
      throw new ApiError(httpStatus.CONFLICT, "Data is being used. (Has children or related to some data)")
    }

    return await prisma.category.delete({
      where: { id }
    })
  }
}
