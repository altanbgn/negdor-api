// Local
import prisma from "@/prisma"

export default async function (query: any) {
  const page = parseInt(query?.page as string || "1")
  const perPage = parseInt(query?.perPage as string || "10")

  let preparedQuery: any = {
    skip: (page - 1) * perPage,
    take: perPage,
  }

  if (query?.search && query?.search.length > 0) {
    preparedQuery.where = {
      title: { search: query.search },
    }
  }

  return {
    list: await prisma.menuItem.findMany(preparedQuery),
    page: page,
    perPage: perPage,
    total: await prisma.menuItem.count()
  }
}
