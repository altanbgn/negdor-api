// Local
import prisma from "@/prisma"

type Query = {
  page?: string
  perPage?: string
  search?: string
  organizationId?: string
  parentId?: string
}

export default async function (query: Query) {
  const page = parseInt(query?.page as string || "1")
  const perPage = parseInt(query?.perPage as string || "10")
  const whereConditions: any = {}

  if (query?.search && query?.search.length > 0) {
    whereConditions.value = { search: query.search }
  }

  if (query?.organizationId && query?.organizationId.length > 0) {
    whereConditions.organizationId = query.organizationId
  }

  if (query?.parentId && query?.parentId.length > 0) {
    whereConditions.parentId = query.parentId
  }

  const preparedQuery = {
    skip: (page - 1) * perPage,
    take: perPage,
    where: whereConditions,
    include: { children: true },
  }

  return {
    list: await prisma.category.findMany(preparedQuery),
    currentPage: page,
    perPage: perPage,
    total: await prisma.category.count()
  }
}
