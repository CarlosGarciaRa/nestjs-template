/*
  Warnings:

  - You are about to drop the `UserActivation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserActivation" DROP CONSTRAINT "UserActivation_userId_fkey";

-- DropTable
DROP TABLE "UserActivation";
