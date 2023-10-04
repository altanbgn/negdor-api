/*
  Warnings:

  - You are about to drop the column `features` on the `Organization` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[handle]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `handle` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Menu" DROP CONSTRAINT "Menu_organizationId_fkey";

-- DropIndex
DROP INDEX "Organization_id_name_idx";

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "features",
ADD COLUMN     "handle" TEXT NOT NULL,
ADD COLUMN     "socials" JSONB;

-- AlterTable
ALTER TABLE "TimeTable" ALTER COLUMN "endTime" SET DATA TYPE TIME,
ALTER COLUMN "startTime" SET DATA TYPE TIME;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT;

-- CreateTable
CREATE TABLE "Feature" (
    "id" TEXT NOT NULL,
    "icon" TEXT,
    "value" TEXT NOT NULL,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FeatureToOrganization" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Feature_id_key" ON "Feature"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Feature_value_key" ON "Feature"("value");

-- CreateIndex
CREATE INDEX "Feature_id_value_idx" ON "Feature"("id", "value");

-- CreateIndex
CREATE UNIQUE INDEX "_FeatureToOrganization_AB_unique" ON "_FeatureToOrganization"("A", "B");

-- CreateIndex
CREATE INDEX "_FeatureToOrganization_B_index" ON "_FeatureToOrganization"("B");

-- CreateIndex
CREATE INDEX "Menu_id_title_idx" ON "Menu"("id", "title");

-- CreateIndex
CREATE INDEX "MenuItem_id_idx" ON "MenuItem"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_handle_key" ON "Organization"("handle");

-- CreateIndex
CREATE INDEX "Organization_id_handle_name_idx" ON "Organization"("id", "handle", "name");

-- CreateIndex
CREATE INDEX "TimeTable_id_idx" ON "TimeTable"("id");

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FeatureToOrganization" ADD CONSTRAINT "_FeatureToOrganization_A_fkey" FOREIGN KEY ("A") REFERENCES "Feature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FeatureToOrganization" ADD CONSTRAINT "_FeatureToOrganization_B_fkey" FOREIGN KEY ("B") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
