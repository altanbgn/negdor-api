import type { PaginationQuery } from "@/types"

export type CategoryCreatePayload = {
  value: string
  handle?: string
  icon?: string
  parentId?: string
}

export type CategoryUpdatePayload = Partial<CategoryCreatePayload>

export interface CategoryFindQuery extends PaginationQuery {
  search?: string
  organizationId?: string
  parentId?: string
}
