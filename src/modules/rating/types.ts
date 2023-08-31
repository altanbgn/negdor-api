export type RatingCreatePayload = {
  value: number
  organizationId: string
}

export type RatingUploadPayload = Partial<Omit<RatingCreatePayload, "organizationId">>

export type Query = {
  page?: string
  perPage?: string
  userId?: string
  organizationId?: string
}
