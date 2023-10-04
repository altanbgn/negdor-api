import httpStatus from "http-status"

// Local
import prisma from "@/prisma"
import ApiError from "@/utils/api-error"
import {
  FeatureCreatePayload,
  FeatureUpdatePayload,
  FeatureFindQuery,
} from "./types"

export default class FeatureServices {
  public async find(query: FeatureFindQuery) {
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
      list: await prisma.feature.findMany(preparedQuery),
      currentPage: page,
      perPage: perPage,
      total: await prisma.feature.count()
    }
  }

  public async findById(id: string) {
    if (!id) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
    }

    return await prisma.feature.findUnique({ where: { id } })
  }

  public async create (data: FeatureCreatePayload) {
    return await prisma.feature.create({ data })
  }

  public async updateById (id: string, payload: FeatureUpdatePayload) {
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

    const foundResult = await prisma.feature.findFirst({
      where: { id },
      include: {
        _count: {
          select: { organizations: true }
        }
      }
    })

    if (foundResult?._count.organizations !== 0) {
      throw new ApiError(httpStatus.CONFLICT, "Data is being used. (Has children or related to some data)")
    }

    return await prisma.feature.delete({
      where: { id }
    })
  }
}
