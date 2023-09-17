export type CreateMenuPayload = {
  title: string
  description: string
  organizationId: string
}

export type UpdateMenuPayload = Partial<Omit<CreateMenuPayload, "organizationId">>
