import type { PaginationQuery } from "@/types"

export type ContentCreatePayload = {
  key: string
  value: string
}

export type ContentUpdatePayload = Partial<ContentCreatePayload>

export interface ContentFindQuery extends PaginationQuery {
  search?: string
}
