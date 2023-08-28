// Local
import prisma from "@/prisma"

export default async function(query: any) {
  const page = parseInt(query?.page as string || "1")
  const perPage = parseInt(query?.perPage as string || "10")

  let preparedQuery: any = {
    skip: (page - 1) * perPage,
    take: perPage,
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

  if (query?.search && query?.search.length > 0) {
    preparedQuery.where = {
      value: { search: query.search }
    }
  }

  return {
    list: await prisma.rating.findMany(preparedQuery),
    page: page,
    perPage: perPage,
    total: await prisma.rating.count()
  }
}
