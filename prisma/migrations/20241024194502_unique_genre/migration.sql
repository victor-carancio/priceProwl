/*
  Warnings:

  - A unique constraint covering the columns `[genre]` on the table `GenresStore` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GenresStore_genre_key" ON "GenresStore"("genre");
