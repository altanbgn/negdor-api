// Local
import prisma from "@/prisma"

export default async function (query: any) {
  let page = parseInt(query?.page as string || "1")
  let perPage = parseInt(query?.perPage as string || "10")

  let preparedQuery: any = {
    skip: (page - 1) * perPage,
    take: perPage,
    include: { children: true },
  }

  if (query?.parentId && query?.parentId.length > 0) {
    preparedQuery.where = {
      parentId: query.parentId
    }
  }

  if (query?.search && query?.search.length > 0) {
    preparedQuery.where = {
      ...preparedQuery,
      value: { search: query.search }
    }
  }

  return {
    list: await prisma.category.findMany(preparedQuery),
    currentPage: page,
    perPage: perPage,
    total: await prisma.category.count()
  }
}
