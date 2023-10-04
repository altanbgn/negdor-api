import httpStatus from "http-status"
import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

// Local
import prisma from "@/prisma"
import ApiError from "@/utils/api-error"
import {
  RatingCreatePayload,
  RatingUploadPayload,
  RatingFindQuery
} from "./types"

export default class RatingService {
  public async find(query: RatingFindQuery) {
    const page = parseInt(query?.page as string || "1")
    const perPage = parseInt(query?.perPage as string || "10")
    const whereConditions: any = {}

    if (query?.organizationId && query?.organizationId.length > 0) {
      whereConditions.organizationId = query.organizationId
    }

    if (query?.userId && query?.userId.length > 0) {
      whereConditions.createdUserId = query.userId
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
        }
      }
    }

    return {
      list: await prisma.rating.findMany(preparedQuery),
      page: page,
      perPage: perPage,
      total: await prisma.rating.count()
    }
  }

  public async findById(id: string) {
    if (!id) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
    }

    return await prisma.rating.findUnique({
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
        organization: true
      }
    })
  }

  public async create(data: RatingCreatePayload, user: any) {
    const { value, organizationId } = data

    return await prisma.$transaction(async function(tx) {
      const createdRating = await tx.rating.create({
        data: {
          value,
          createdUser: { connect: { id: user.id } },
          organization: { connect: { id: organizationId } }
        }
      }).catch((error: PrismaClientKnownRequestError) => {
        if (error.code === "P2002") {
          throw new ApiError(httpStatus.BAD_REQUEST, "Can't create another rating for this org")
        }

        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong!")
      })

      const scoreResult = await tx.rating.aggregate({
        where: { organizationId },
        _avg: { value: true },
      })

      await tx.organization.update({
        where: { id: organizationId },
        data: { score: scoreResult._avg.value || 0 }
      })

      return createdRating
    })
  }

  public async updateById(id: string, data: RatingUploadPayload) {
    if (!id) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
    }

    return await prisma.$transaction(async function(tx: any) {
      const updatedRating = await tx.rating.update({
        where: { id },
        data
      })

      const scoreResult = await tx.rating.aggregate({
        where: { organizationId: updatedRating.organizationId },
        _avg: { value: true }
      })

      await tx.organization.update({
        where: { id: updatedRating.organizationId },
        data: { score: scoreResult._avg.value || 0 }
      })

      return updatedRating
    })
  }

  public async deleteById(id: string) {
    if (!id) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid id")
    }

    return await prisma.$transaction(async function(tx: any) {
      const deletedRating = await tx.rating.delete({
        where: { id }
      })

      const scoreResult = await tx.rating.aggregate({
        where: { organizationId: deletedRating.organizationId },
        _avg: { value: true }
      })

      await tx.organization.update({
        where: { id: deletedRating.organizationId },
        data: { score: scoreResult._avg.value || 0 }
      })

      return deletedRating
    })
  }
}
