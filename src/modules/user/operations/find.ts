import prisma from "@/prisma"

export default async function (query: any) {
  const preparedQuery = {
    page: parseInt(query?.page as string || "1"),
    perPage: parseInt(query?.perPage as string || "10")
  }

  const result = await prisma.user.findMany({
    skip: (preparedQuery.page - 1) * preparedQuery.perPage,
    take: preparedQuery.perPage,
  })

  return {
    list: result,
    page: preparedQuery.page,
    perPage: preparedQuery.perPage,
    total: await prisma.user.count()
  }
}
