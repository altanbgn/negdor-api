// Local
import prisma from "@/prisma"

export default async function (payload: any) {
  return await prisma.menu.create({ data: payload })
}
