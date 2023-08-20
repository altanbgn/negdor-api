import ApiError from "@/utils/api-error"

const create = async (data: CreatePayload, user: any) => {
  const isPermitted: boolean = checkPermission(user)

  if (!isPermitted) {
    throw new ApiError(httpStatus.FORBIDDEN, "Insufficient permission!")
  }

  return await prisma.category.create({ data })
}
