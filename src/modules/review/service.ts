import httpStatus from "http-status"

// Local
import prisma from "@/prisma"
import ApiError from "@/utils/api-error"
import {
  ReviewCreatePayload,
  ReviewUpdatePayload,
  ReviewFindQuery
} from "./types"

export default class ReviewService {
  public async find(query: ReviewFindQuery) {
    const page = parseInt(query?.page as string || "1")
    const perPage = parseInt(query?.perPage as string || "10")
    const whereConditions: any = {}

    if (query?.userId && query?.userId.length > 0) {
      whereConditions.createdUserId = query.userId
    }

    if (query?.organizationId && query?.organizationId.length > 0) {
      whereConditions.organizationId = query.organizationId
    }

    const preparedQuery = {
      skip: (page - 1) * perPage,
      take: perPage,
      where: whereConditions,
      include: {
        createdUser: {
          select: {
            avatar: true,
            firstname: true,
            username: true,
            lastname: true,
            role: true,
          }
        },
        organization: {
          select: {
            name: true,
            shortDescription: true,
            fullDescription: true,
            director: true,
            emails: true,
            phonenumbers: true,
            locations: true,
          }
        }
      }
    }

    return {
      list: await prisma.review.findMany(preparedQuery),
      page: page,
      perPage: perPage,
      total: await prisma.review.count()
    }
  }

  public async findById(id: string) {
    if (!id) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
    }

    const result: any = await prisma.review.findUnique({
      where: { id },
      include: {
        createdUser: {
          select: {
            avatar: true,
            firstname: true,
            username: true,
            lastname: true,
            role: true,
          }
        },
        organization: {
          select: {
            name: true,
            shortDescription: true,
            fullDescription: true,
            director: true,
            emails: true,
            phonenumbers: true,
            locations: true,
          }
        }
      }
    })

    if (!result) {
      throw new ApiError(httpStatus.NOT_FOUND, "Not found!")
    }

    return result
  }

  public async create(data: ReviewCreatePayload, user: any) {
    const { title, body, organizationId } = data

    return await prisma.review.create({
      data: {
        title,
        body,
        createdUser: { connect: { id: user.id } },
        organization: { connect: { id: organizationId } }
      },
    })
  }

  public async updateById(id: string, data: ReviewUpdatePayload) {
    if (!id) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
    }

    return await prisma.review.update({
      where: { id },
      data
    })
  }

  public async deleteById(id: string) {
    if (!id) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
    }

    return await prisma.review.delete({ where: { id } })
  }
}
