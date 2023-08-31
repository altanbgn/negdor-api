import prisma from "@/prisma"

export default async function(query: any) {
  const page = parseInt(query?.page as string || "1")
  const perPage = parseInt(query?.perPage as string || "10")
  const userId = query?.userId as string || null

  let preparedQuery: any = {
    skip: (page - 1) * perPage,
    take: perPage,
    include: {
      createdUser: {
        select: {
          avatar: true,
          firstname: true,
          username: true,
          lastname: true,
          role: true,
        }
      },
      organization: {
        select: {
          name: true,
          shortDescription: true,
          fullDescription: true,
          director: true,
          emails: true,
          phonenumbers: true,
          locations: true,
        }
      }
    }
  }

  if (query?.userId && query?.userId.length > 0) {
    preparedQuery.where = { createdUserId: userId }
  }

  return {
    list: await prisma.rating.findMany(preparedQuery),
    page: page,
    perPage: perPage,
    total: await prisma.rating.count()
  }
}
