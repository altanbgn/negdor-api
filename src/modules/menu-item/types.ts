import type { PaginationQuery } from "@/types"

export type CreateMenuItemPayload = {
  title: string
  description: string
  price: number
  image: string
  menuId: string
}

export type UpdateMenuItemPayload = Partial<CreateMenuItemPayload>

export interface MenuItemFindQuery extends PaginationQuery { search?: string }
