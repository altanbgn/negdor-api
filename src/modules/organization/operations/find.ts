// Local
import prisma from "@/prisma"

export default async function(query: any) {
  const page = parseInt(query?.page as string || "1");
  const perPage = parseInt(query?.perPage as string || "10");

  let preparedQuery = {
    skip: (page - 1) * perPage,
    take: perPage,
    include: {
      categories: true,
      _count: {
        select: {
          rating: true,
          reviews: true
        }
      }
    },
  }

  let result = await prisma.organization.findMany(preparedQuery)

  return {
    list: result,
    page: page,
    perPage: perPage,
    total: await prisma.organization.count()
  }
}
