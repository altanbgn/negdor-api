import prisma from "@/prisma"

export default async function (data: any) {
  return await prisma.menuItem.create({
    data
  })
}
