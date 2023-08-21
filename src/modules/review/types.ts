export type ReviewCreatePayload = {
  title: string,
  body: string
  organizationId: string
}

export type ReviewUpdatePayload = Partial<Omit<ReviewCreatePayload, 'organizationId'>>
