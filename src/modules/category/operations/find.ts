// Local
import prisma from "@/prisma"

export default async function (query: any) {
  let preparedQuery = {
    page: parseInt(query?.page as string || "1"),
    perPage: parseInt(query?.perPage as string || "10"),
  }

  let result = [];

  if (query?.search && query?.search.length > 0) {
    result = await prisma.category.findMany({
      where: {
        include: { children: true }
      },
      body: {
        search: query.search,
      },
      skip: (preparedQuery.page - 1) * preparedQuery.perPage,
      take: preparedQuery.perPage,
    })
  } else {
    result = await prisma.category.findMany({
      where: {
        include: { children: true }
      },
      skip: (preparedQuery.page - 1) * preparedQuery.perPage,
      take: preparedQuery.perPage,
    })
  }

  return {
    list: result,
    currentPage: preparedQuery.page,
    perPage: preparedQuery.perPage,
    total: await prisma.category.count()
  }
}
