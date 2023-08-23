import prisma from "@/prisma"
import { UserUpdatePayload } from "../types"

export default async function(id: string, data: UserUpdatePayload) {
  return await prisma.user.update({
    where: { id },
    data
  })
}
