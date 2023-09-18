export type TimeTableCreatePayload = {
  weekday: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY"
  startTime: string
  endTime: string
  organizationId: string
}

export type TimeTableUpdatePayload = Partial<Omit<TimeTableCreatePayload, "organizationId">>
