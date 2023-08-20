export type QueryInclude = {
  children: boolean
}

export type CreatePayload = {
  value: string
  icon?: string
  parentId?: string
}

export type UpdatePayload = Partial<CreatePayload>
