/*
  Warnings:

  - You are about to drop the column `edition` on the `StorePrice` table. All the data in the column will be lost.
  - Added the required column `edition` to the `StoreGame` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StoreGame" ADD COLUMN     "edition" TEXT NOT NULL,
ADD COLUMN     "gamepass" BOOLEAN;

-- AlterTable
ALTER TABLE "StorePrice" DROP COLUMN "edition";
