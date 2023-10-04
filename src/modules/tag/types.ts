import { PaginationQuery } from "@/types"

export type TagCreatePayload = {
  value: string
  icon?: string
}

export type TagUpdatePayload = Partial<TagCreatePayload>

export interface TagFindQuery extends PaginationQuery { search?: string }
