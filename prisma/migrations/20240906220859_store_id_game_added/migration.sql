/*
  Warnings:

  - Added the required column `storeIdGame` to the `StoreGame` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StoreGame" ADD COLUMN     "storeIdGame" TEXT NOT NULL;
