// Local
import prisma from "@/prisma"

export default async function(query: any) {
  const page = parseInt(query?.page as string || "1")
  const perPage = parseInt(query?.perPage as string || "10")

  let preparedQuery: any = {
    skip: (page - 1) * perPage,
    take: perPage,
    include: {
      categories: {
        select: {
          icon: true,
          value: true,
        },
      },
      _count: {
        select: {
          ratings: true,
          reviews: true,
        },
      },
    },
  }

  if (query?.search && query?.search.length > 0) {
    preparedQuery.where = {
      name: { search: query.search },
    }
  }

  return {
    list: await prisma.organization.findMany(preparedQuery),
    page: page,
    perPage: perPage,
    total: await prisma.organization.count()
  }
}
