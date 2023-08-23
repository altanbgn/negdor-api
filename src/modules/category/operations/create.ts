// Local
import prisma from "@/prisma"
import { CategoryCreatePayload } from "../types"

export default async function (data: CategoryCreatePayload) {
  return await prisma.category.create({ data })
}
