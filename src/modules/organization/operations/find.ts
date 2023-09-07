// Local
import prisma from "@/prisma"

type Query = {
  page?: string
  perPage?: string
  search?: string
}

export default async function (query: Query) {
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
          id: true,
          icon: true,
          value: true
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
