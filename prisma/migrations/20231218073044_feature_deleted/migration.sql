/*
  Warnings:

  - You are about to drop the `Feature` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FeatureToOrganization` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_FeatureToOrganization" DROP CONSTRAINT "_FeatureToOrganization_A_fkey";

-- DropForeignKey
ALTER TABLE "_FeatureToOrganization" DROP CONSTRAINT "_FeatureToOrganization_B_fkey";

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "features" TEXT[];

-- DropTable
DROP TABLE "Feature";

-- DropTable
DROP TABLE "_FeatureToOrganization";
