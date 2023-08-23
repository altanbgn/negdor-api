-- DropIndex
DROP INDEX "Category_id_idx";

-- DropIndex
DROP INDEX "Member_id_idx";

-- DropIndex
DROP INDEX "Rating_id_idx";

-- DropIndex
DROP INDEX "Review_id_idx";

-- CreateTable
CREATE TABLE "Metrics" (
    "id" TEXT NOT NULL,
    "ratingAverage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Menu" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "image" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Metrics_id_key" ON "Metrics"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Metrics_organizationId_key" ON "Metrics"("organizationId");

-- CreateIndex
CREATE INDEX "Metrics_id_organizationId_idx" ON "Metrics"("id", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Menu_id_key" ON "Menu"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MenuItem_id_key" ON "MenuItem"("id");

-- CreateIndex
CREATE INDEX "Category_id_value_idx" ON "Category"("id", "value");

-- CreateIndex
CREATE INDEX "Member_id_userId_organizationId_idx" ON "Member"("id", "userId", "organizationId");

-- CreateIndex
CREATE INDEX "Rating_id_organizationId_idx" ON "Rating"("id", "organizationId");

-- CreateIndex
CREATE INDEX "Review_id_organizationId_idx" ON "Review"("id", "organizationId");

-- AddForeignKey
ALTER TABLE "Metrics" ADD CONSTRAINT "Metrics_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
