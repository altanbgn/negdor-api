export type QueryInclude = {
  children: boolean
}

export type CategoryCreatePayload = {
  value: string
  icon?: string
  parentId?: string
}

export type CategoryUpdatePayload = Partial<CategoryCreatePayload>
