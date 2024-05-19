/*
  Warnings:

  - You are about to drop the column `url` on the `StorePrice` table. All the data in the column will be lost.
  - Added the required column `url` to the `StoreGame` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StoreGame" ADD COLUMN     "url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "StorePrice" DROP COLUMN "url";
