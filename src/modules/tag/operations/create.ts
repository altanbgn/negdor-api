import prisma from "@/prisma"
import { TagCreatePayload } from "../types"

export default async function (data: TagCreatePayload) {
  return await prisma.tag.create({ data })
}
