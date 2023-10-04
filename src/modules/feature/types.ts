import { PaginationQuery } from "@/types"

export type FeatureCreatePayload = {
  icon?: string
  value: string
  handle?: string
  parentId?: string
}

export type FeatureUpdatePayload = Partial<FeatureCreatePayload>

export interface FeatureFindQuery extends PaginationQuery { search?: string }
