export type RatingCreatePayload = {
  value: number
  organizationId: string
}

export type RatingUploadPayload = Partial<Omit<RatingCreatePayload, 'organizationId'>>
