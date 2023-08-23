// Local
import prisma from "@/prisma"
import validator from "../validator"

export default async function (query: any) {
  let sanitizedQuery = await validator.querySchema.validateAsync(query)
  let preparedQuery = {
    page: parseInt(sanitizedQuery?.page as string || "1"),
    perPage: parseInt(sanitizedQuery?.perPage as string || "10"),
  }

  let result = await prisma.organization.findMany({
    skip: (preparedQuery.page - 1) * preparedQuery.perPage,
    take: preparedQuery.perPage
  })

  return {
    list: result,
    page: preparedQuery.page,
    perPage: preparedQuery.perPage,
    total: await prisma.menu.count()
  }
}
