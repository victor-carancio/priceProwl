/*
  Warnings:

  - You are about to drop the column `store_info_game_id` on the `GenresStore` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "GenresStore" DROP CONSTRAINT "GenresStore_store_info_game_id_fkey";

-- AlterTable
ALTER TABLE "GenresStore" DROP COLUMN "store_info_game_id";

-- CreateTable
CREATE TABLE "GenreStoreInStoreInfoGame" (
    "genre_store_id" INTEGER NOT NULL,
    "store_info_game_id" INTEGER NOT NULL,

    CONSTRAINT "GenreStoreInStoreInfoGame_pkey" PRIMARY KEY ("genre_store_id","store_info_game_id")
);

-- AddForeignKey
ALTER TABLE "GenreStoreInStoreInfoGame" ADD CONSTRAINT "GenreStoreInStoreInfoGame_genre_store_id_fkey" FOREIGN KEY ("genre_store_id") REFERENCES "GenresStore"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenreStoreInStoreInfoGame" ADD CONSTRAINT "GenreStoreInStoreInfoGame_store_info_game_id_fkey" FOREIGN KEY ("store_info_game_id") REFERENCES "StoreInfoGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
