/*
  Warnings:

  - A unique constraint covering the columns `[accessId]` on the table `AppConnection` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AppConnection_accessId_key" ON "AppConnection"("accessId");

-- CreateIndex
CREATE INDEX "AppConnection_accessId_idx" ON "AppConnection"("accessId");
