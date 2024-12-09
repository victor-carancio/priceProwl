/*
  Warnings:

  - You are about to drop the column `infoGameId` on the `Rating` table. All the data in the column will be lost.
  - You are about to drop the column `infoGameId` on the `RatingOnInfoGame` table. All the data in the column will be lost.
  - You are about to drop the column `ratingId` on the `RatingOnInfoGame` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[info_game_id,rating_id]` on the table `RatingOnInfoGame` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `info_game_id` to the `RatingOnInfoGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating_id` to the `RatingOnInfoGame` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RatingOnInfoGame" DROP CONSTRAINT "RatingOnInfoGame_infoGameId_fkey";

-- DropForeignKey
ALTER TABLE "RatingOnInfoGame" DROP CONSTRAINT "RatingOnInfoGame_ratingId_fkey";

-- DropIndex
DROP INDEX "RatingOnInfoGame_infoGameId_ratingId_key";

-- AlterTable
ALTER TABLE "Rating" DROP COLUMN "infoGameId",
ADD COLUMN     "info_game_id" INTEGER;

-- AlterTable
ALTER TABLE "RatingOnInfoGame" DROP COLUMN "infoGameId",
DROP COLUMN "ratingId",
ADD COLUMN     "info_game_id" INTEGER NOT NULL,
ADD COLUMN     "rating_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RatingOnInfoGame_info_game_id_rating_id_key" ON "RatingOnInfoGame"("info_game_id", "rating_id");

-- AddForeignKey
ALTER TABLE "RatingOnInfoGame" ADD CONSTRAINT "RatingOnInfoGame_info_game_id_fkey" FOREIGN KEY ("info_game_id") REFERENCES "InfoGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingOnInfoGame" ADD CONSTRAINT "RatingOnInfoGame_rating_id_fkey" FOREIGN KEY ("rating_id") REFERENCES "Rating"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
