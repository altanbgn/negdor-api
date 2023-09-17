/*
  Warnings:

  - A unique constraint covering the columns `[weekday,organizationId]` on the table `TimeTable` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TimeTable_weekday_organizationId_key" ON "TimeTable"("weekday", "organizationId");
