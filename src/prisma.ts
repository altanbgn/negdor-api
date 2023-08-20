import { PrismaClient } from "@prisma/client"
import config from "@/utils/config"

const initialPrisma = new PrismaClient()
const extendedPrisma: any = global.prisma || initialPrisma.$extends({
  result: {
    organization: {
      averageRating: {
        needs: { id: true },
        async compute(organization) {
          const result = await initialPrisma.rating.aggregate({
            where: { organizationId: organization.id },
            _avg: { value: true }
          })

          return `${result._avg.value}`
        }
      }
    }
  }
})

// Prevent multiple instances of Prisma Client in development
declare const global: IPrismaGlobal

// Add prisma to the NodeJS global type
export interface IPrismaGlobal extends Global {
  prisma: typeof extendedPrisma
}

const prisma = global.prisma || extendedPrisma

if (config.env === 'development') global.prisma = prisma

export default extendedPrisma
