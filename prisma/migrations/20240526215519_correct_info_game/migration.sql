/*
  Warnings:

  - You are about to drop the column `game_id` on the `InfoGame` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "InfoGame" DROP CONSTRAINT "InfoGame_game_id_fkey";

-- AlterTable
ALTER TABLE "InfoGame" DROP COLUMN "game_id";

-- CreateTable
CREATE TABLE "GameOnInfoGame" (
    "game_id" INTEGER NOT NULL,
    "info_game_id" INTEGER NOT NULL,

    CONSTRAINT "GameOnInfoGame_pkey" PRIMARY KEY ("game_id","info_game_id")
);

-- AddForeignKey
ALTER TABLE "GameOnInfoGame" ADD CONSTRAINT "GameOnInfoGame_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameOnInfoGame" ADD CONSTRAINT "GameOnInfoGame_info_game_id_fkey" FOREIGN KEY ("info_game_id") REFERENCES "InfoGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
