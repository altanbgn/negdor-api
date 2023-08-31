// Local
import prisma from "@/prisma"

type Query = {
  page?: string
  perPage?: string
  userId?: string
  organizationId?: string
}

export default async function(query: Query) {
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
