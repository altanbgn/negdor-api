export type TagCreatePayload = {
  value: string
  icon?: string
}

export type TagUpdatePayload = Partial<TagCreatePayload>
