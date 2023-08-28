/*
  Warnings:

  - You are about to drop the `Metrics` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[organizationId,createdUserId]` on the table `Rating` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_userId_fkey";

-- DropForeignKey
ALTER TABLE "Metrics" DROP CONSTRAINT "Metrics_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_createdUserId_fkey";

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_createdUserId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_parentId_fkey";

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "score" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Metrics";

-- CreateIndex
CREATE UNIQUE INDEX "Rating_organizationId_createdUserId_key" ON "Rating"("organizationId", "createdUserId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_createdUserId_fkey" FOREIGN KEY ("createdUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_createdUserId_fkey" FOREIGN KEY ("createdUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
