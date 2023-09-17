export type TimeTableCreatePayload = {
  weekday: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY"
  startTime: Date
  endTime: Date
  organizationId: string
}

export type TimeTableUpdatePayload = Partial<Omit<TimeTableCreatePayload, "organizationId">>
