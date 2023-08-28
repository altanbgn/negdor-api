import prisma from "@/prisma"

export default async function (query: any) {
  const page = parseInt(query?.page as string || "1")
  const perPage = parseInt(query?.perPage as string || "10")

  const preparedQuery = {
    skip: (page - 1) * perPage,
    take: perPage,
  }

  return {
    list: await prisma.user.findMany(preparedQuery),
    page: page,
    perPage: perPage,
    total: await prisma.user.count()
  }
}
