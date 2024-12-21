/*
  Warnings:

  - You are about to drop the `Videos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Videos" DROP CONSTRAINT "Videos_info_game_id_fkey";

-- DropTable
DROP TABLE "Videos";
