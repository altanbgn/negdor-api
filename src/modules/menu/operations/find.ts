// Local
import prisma from "@/prisma"

export default async function (query: any) {
  let page = parseInt(query?.page as string || "1")
  let perPage = parseInt(query?.perPage as string || "10")

  let preparedQuery: any = {
    skip: (page - 1) * perPage,
    take: perPage,
  }

  if (query?.search && query?.search.length > 0) {
    preparedQuery.body = { search: query.search }
  }

  let result = await prisma.menu.findMany(preparedQuery)

  return {
    list: result,
    page: page,
    perPage: perPage,
    total: await prisma.menu.count()
  }
}
