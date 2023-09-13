-- CreateEnum
CREATE TYPE "SupportedPlatform" AS ENUM ('FACEBOOK', 'GOOGLE');

-- CreateTable
CREATE TABLE "AppConnection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessId" TEXT NOT NULL,
    "platform" "SupportedPlatform" NOT NULL,

    CONSTRAINT "AppConnection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppConnection_id_key" ON "AppConnection"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AppConnection_userId_platform_key" ON "AppConnection"("userId", "platform");

-- AddForeignKey
ALTER TABLE "AppConnection" ADD CONSTRAINT "AppConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
