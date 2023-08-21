// Local
import prisma from "@/prisma"
import { CreatePayload } from "../types"

export default async function (data: CreatePayload) {
  return await prisma.category.create({ data })
}
