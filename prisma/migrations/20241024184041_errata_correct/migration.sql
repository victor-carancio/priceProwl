/*
  Warnings:

  - You are about to drop the column `aboyt` on the `StoreInfoGame` table. All the data in the column will be lost.
  - Added the required column `about` to the `StoreInfoGame` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StoreInfoGame" DROP COLUMN "aboyt",
ADD COLUMN     "about" TEXT NOT NULL;
