import type { PaginationQuery } from "@/types"

export type TimeTableCreatePayload = {
  weekday: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY"
  startTime: string
  endTime: string
  organizationId: string
}

export type TimeTableUpdatePayload = Partial<Omit<TimeTableCreatePayload, "organizationId">>

export interface TimeTableFindQuery extends PaginationQuery { organizationId?: string }
