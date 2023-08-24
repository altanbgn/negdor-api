// Local
import prisma from "@/prisma"

export default async function (query: any) {
  let preparedQuery = {
    page: parseInt(query?.page as string || "1"),
    perPage: parseInt(query?.perPage as string || "10"),
  }

  let result = await prisma.menu.findMany({
    skip: (preparedQuery.page - 1) * preparedQuery.perPage,
    take: preparedQuery.perPage,
    body: {
      search: query?.search || "",
    },
  })

  return {
    list: result,
    page: preparedQuery.page,
    perPage: preparedQuery.perPage,
    total: await prisma.menu.count()
  }
}
