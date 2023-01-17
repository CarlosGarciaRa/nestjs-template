/*
  Warnings:

  - You are about to drop the column `tokenOne` on the `UserActivation` table. All the data in the column will be lost.
  - You are about to drop the column `tokenTwo` on the `UserActivation` table. All the data in the column will be lost.
  - Added the required column `token` to the `UserActivation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserActivation" DROP COLUMN "tokenOne",
DROP COLUMN "tokenTwo",
ADD COLUMN     "token" TEXT NOT NULL;
