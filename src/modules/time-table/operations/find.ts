// Local
import prisma from "@/prisma"

type Query = {
  page?: string
  perPage?: string
  organizationId?: string
}

export default async function (query: Query) {
  const page = parseInt(query?.page as string || "1")
  const perPage = parseInt(query?.perPage as string || "10")
  const whereConditions: any = {}

  if (query?.organizationId && query?.organizationId.length > 0) {
    whereConditions.organizationId = query.organizationId
  }

  const preparedQuery = {
    skip: (page - 1) * perPage,
    take: perPage,
    where: whereConditions,
  }

  return {
    list: await prisma.timeTable.findMany(preparedQuery),
    currentPage: page,
    perPage: perPage,
    total: await prisma.timeTable.count()
  }
}
