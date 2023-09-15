-- DropForeignKey
ALTER TABLE "AppConnection" DROP CONSTRAINT "AppConnection_userId_fkey";

-- AddForeignKey
ALTER TABLE "AppConnection" ADD CONSTRAINT "AppConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
