import prisma from "@/prisma"
import { CreateMenuItemPayload } from "../types"

export default async function (data: CreateMenuItemPayload) {
  return await prisma.menuItem.create({ data })
}
