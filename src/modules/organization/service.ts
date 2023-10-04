import httpStatus from "http-status"

// Local
import prisma from "@/prisma"
import { UserRole, MemberRole } from "@prisma/client"
import ApiError from "@/utils/api-error"
import { handleConverter } from "@/utils/tools"
import {
  OrganizationCreatePayload,
  OrganizationUpdatePayload,
  OrganizationFindQuery
} from "./types"

export default class OrganizationService {
  public async find(query: OrganizationFindQuery) {
    const page = parseInt((query?.page as string) || "1", 10)
    const perPage = parseInt((query?.perPage as string) || "10", 10)
    const whereConditions: any = {}

    if (query?.search && query?.search.length > 0) {
      whereConditions.name = { search: query.search }
    }

    const preparedQuery = {
      skip: (page - 1) * perPage,
      take: perPage,
      where: whereConditions,
      include: {
        categories: {
          select: {
            icon: true,
            value: true
          }
        },
        timeTable: {
          select: {
            weekday: true,
            startTime: true,
            endTime: true,
          }
        },
        _count: {
          select: {
            ratings: true,
            reviews: true
          }
        }
      }
    }

    return {
      list: await prisma.organization.findMany(preparedQuery),
      page,
      perPage,
      total: await prisma.organization.count()
    }
  }

  public async findById(id: string) {
    if (!id) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
    }

    const result: any = await prisma.organization.findUnique({
      where: { id },
      include: {
        categories: {
          select: {
            id: true,
            icon: true,
            value: true
          }
        },
        timeTable: {
          select: {
            id: true,
            weekday: true,
            startTime: true,
            endTime: true,
          }
        },
      },
    })

    if (!result) {
      throw new ApiError(httpStatus.NOT_FOUND, "Not found!")
    }

    return result
  }

  public async create(data: OrganizationCreatePayload, user: any) {
    await prisma.user.update({
      where: { id: user.id },
      data: { role: UserRole.CLIENT }
    })

    const { categories = [], features = [], tags, ...queryData } = data

    const result = await prisma.organization.create({
      data: {
        ...queryData,
        handle: handleConverter(queryData.handle || queryData.name),
        features: {
          connect: features.map((featureId: string) => ({ id: featureId }))
        },
        categories: {
          connect: categories.map((categoryId: string) => ({ id: categoryId }))
        },
        members: {
          create: [
            {
              user: { connect: { id: user.id } },
              role: MemberRole.OWNER
            }
          ]
        }
      }
    })

    return result
  }

  public async updateById(id: string, data: OrganizationUpdatePayload | any) {
    if (!id) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
    }

    const { categories = [], tags, ...queryData } = data

    return await prisma.organization.update({
      where: { id },
      include: {
        categories: true,
        tags: true
      },
      data: {
        ...queryData,
        categories: {
          set: categories.map((categoryId: string) => ({ id: categoryId }))
        }
      }
    })
  }

  public async deleteById(id: string) {
    if (!id) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
    }

    return await prisma.organization.delete({ where: { id } })
  }
}
