import type { PaginationQuery } from "@/types"

export type OrganizationCreatePayload = {
  name: string
  handle: string
  shortDescription: string
  fullDescription: string
  emails?: Array<string>
  phonenumbers?: Array<string>
  locations?: Array<string>
  socials?: any
  logo?: string
  banner?: string
  images?: Array<string>
  features?: Array<string>
  categories?: Array<string>
  tags?: Array<string>
}

export type OrganizationUpdatePayload = Partial<OrganizationCreatePayload>

export interface OrganizationFindQuery extends PaginationQuery { search?: string }
