// Local
import prisma from "@/prisma"
import type { ChangePasswordPayload } from "../types"

export default async function (
  data: ChangePasswordPayload,
  user: any
) {
  const newPassword = await prisma.user.generatePasswordById(user.id, data.oldPassword, data.newPassword)

  return await prisma.user.update({
    where: { id: user.id },
    data: { password: newPassword }
  })
}
