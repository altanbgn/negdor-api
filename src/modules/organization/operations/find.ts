// Local
import prisma from "@/prisma"
import validator from "../validator"

export default async function (query: any) {
  let sanitizedQuery = await validator.querySchema.validateAsync(query)
  let preparedQuery = {
    page: parseInt(sanitizedQuery?.page as string || "1"),
    perPage: parseInt(sanitizedQuery?.perPage as string || "10"),
    include: {
      categories: true,
      _count: { select: { ratings: true, reviews: true } }
    }
  }

  let result = await prisma.organization.findMany({
    where: {
      include: { children: true }
    },
    skip: (preparedQuery.page - 1) * preparedQuery.perPage,
    take: preparedQuery.perPage
  })

  return {
    list: result,
    page: preparedQuery.page,
    perPage: preparedQuery.perPage,
    total: await prisma.organization.count()
  }
}
