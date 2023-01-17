-- DropForeignKey
ALTER TABLE "UserActivation" DROP CONSTRAINT "UserActivation_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserActivation" ADD CONSTRAINT "UserActivation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
