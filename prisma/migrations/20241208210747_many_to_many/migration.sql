-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_infoGameId_fkey";

-- CreateTable
CREATE TABLE "RatingOnInfoGame" (
    "infoGameId" INTEGER NOT NULL,
    "ratingId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "RatingOnInfoGame_infoGameId_ratingId_key" ON "RatingOnInfoGame"("infoGameId", "ratingId");

-- AddForeignKey
ALTER TABLE "RatingOnInfoGame" ADD CONSTRAINT "RatingOnInfoGame_infoGameId_fkey" FOREIGN KEY ("infoGameId") REFERENCES "InfoGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingOnInfoGame" ADD CONSTRAINT "RatingOnInfoGame_ratingId_fkey" FOREIGN KEY ("ratingId") REFERENCES "Rating"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
