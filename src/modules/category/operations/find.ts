import prisma from "@/prisma"
import validator from "../validator"

export default async function (query: any) {
  let validatedQuery = await validator.QuerySchema.validateAsync(query)
  let preparedQuery = {
    page: parseInt(validatedQuery?.page as string || "1"),
    perPage: parseInt(query?.perPage as string || "10"),
  }

  let result = await prisma.category.findMany({
    where: {
      include: { children: true }
    },
    skip: (preparedQuery.page - 1) * preparedQuery.perPage,
    take: preparedQuery.perPage,

  })

  return {
    list: result,
    currentPage: preparedQuery.page,
    perPage: preparedQuery.perPage,
    total: await prisma.category.count()
  }
}
