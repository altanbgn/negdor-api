import type { PaginationQuery } from "@/types"

export type CreateMenuPayload = {
  title: string
  description: string
  organizationId: string
}

export type UpdateMenuPayload = Partial<Omit<CreateMenuPayload, "organizationId">>

export interface MenuFindQuery extends PaginationQuery {
  search?: string
  organizationId: string
}
