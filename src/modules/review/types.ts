import type { PaginationQuery } from "@/types"

export interface ReviewFindQuery extends PaginationQuery {
  userId?: string
  organizationId?: string
}

export type ReviewCreatePayload = {
  title: string
  body: string
  organizationId: string
}

export type ReviewUpdatePayload = Partial<Omit<ReviewCreatePayload, "organizationId">>
