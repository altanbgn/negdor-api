import type { PaginationQuery } from "@/types"

export type RatingCreatePayload = {
  value: number
  organizationId: string
}

export type RatingUploadPayload = Partial<Omit<RatingCreatePayload, "organizationId">>

export interface RatingFindQuery extends PaginationQuery {
  userId?: string
  organizationId?: string
}
