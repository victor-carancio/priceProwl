/*
  Warnings:

  - You are about to drop the column `first_release_date` on the `InfoGame` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `InfoGame` table. All the data in the column will be lost.
  - You are about to drop the column `storyline` on the `InfoGame` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `InfoGame` table. All the data in the column will be lost.
  - You are about to drop the column `version_title` on the `InfoGame` table. All the data in the column will be lost.
  - You are about to drop the column `imgStore` on the `StoreGame` table. All the data in the column will be lost.
  - You are about to drop the column `storeIdGame` on the `StoreGame` table. All the data in the column will be lost.
  - You are about to drop the `AlternativeName` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AlternativeNameOnInfoGame` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Artwork` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Company` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CompanyLogo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Cover` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GameEngine` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GameEngineOnInfoGame` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GameOnInfoGame` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Genre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GenreStoreInStoreInfoGame` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GenresStore` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InvolvedCompany` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Keyword` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KeywordOnInfoGame` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Platform` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlatformLogo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlatformOnInfoGame` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReleaseDate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ScreenshotsStore` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StoreInfoGame` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Video` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VideosStore` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[store_game_id]` on the table `InfoGame` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `about` to the `InfoGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `InfoGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `developer` to the `InfoGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publisher` to the `InfoGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `release_date` to the `InfoGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storeIdGame` to the `InfoGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `store_game_id` to the `InfoGame` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AlternativeNameOnInfoGame" DROP CONSTRAINT "AlternativeNameOnInfoGame_alternative_name_id_fkey";

-- DropForeignKey
ALTER TABLE "AlternativeNameOnInfoGame" DROP CONSTRAINT "AlternativeNameOnInfoGame_info_game_id_fkey";

-- DropForeignKey
ALTER TABLE "Artwork" DROP CONSTRAINT "Artwork_info_game_id_fkey";

-- DropForeignKey
ALTER TABLE "CompanyLogo" DROP CONSTRAINT "CompanyLogo_company_id_fkey";

-- DropForeignKey
ALTER TABLE "Cover" DROP CONSTRAINT "Cover_info_game_id_fkey";

-- DropForeignKey
ALTER TABLE "GameEngineOnInfoGame" DROP CONSTRAINT "GameEngineOnInfoGame_game_engine_id_fkey";

-- DropForeignKey
ALTER TABLE "GameEngineOnInfoGame" DROP CONSTRAINT "GameEngineOnInfoGame_info_game_id_fkey";

-- DropForeignKey
ALTER TABLE "GameOnInfoGame" DROP CONSTRAINT "GameOnInfoGame_game_id_fkey";

-- DropForeignKey
ALTER TABLE "GameOnInfoGame" DROP CONSTRAINT "GameOnInfoGame_info_game_id_fkey";

-- DropForeignKey
ALTER TABLE "GameOnInfoGame" DROP CONSTRAINT "GameOnInfoGame_store_info_game_id_fkey";

-- DropForeignKey
ALTER TABLE "GenreOnInfoGame" DROP CONSTRAINT "GenreOnInfoGame_genre_id_fkey";

-- DropForeignKey
ALTER TABLE "GenreStoreInStoreInfoGame" DROP CONSTRAINT "GenreStoreInStoreInfoGame_genre_store_id_fkey";

-- DropForeignKey
ALTER TABLE "GenreStoreInStoreInfoGame" DROP CONSTRAINT "GenreStoreInStoreInfoGame_store_info_game_id_fkey";

-- DropForeignKey
ALTER TABLE "InvolvedCompany" DROP CONSTRAINT "InvolvedCompany_company_id_fkey";

-- DropForeignKey
ALTER TABLE "InvolvedCompany" DROP CONSTRAINT "InvolvedCompany_info_game_id_fkey";

-- DropForeignKey
ALTER TABLE "KeywordOnInfoGame" DROP CONSTRAINT "KeywordOnInfoGame_info_game_id_fkey";

-- DropForeignKey
ALTER TABLE "KeywordOnInfoGame" DROP CONSTRAINT "KeywordOnInfoGame_keyword_id_fkey";

-- DropForeignKey
ALTER TABLE "PlatformLogo" DROP CONSTRAINT "PlatformLogo_platform_id_fkey";

-- DropForeignKey
ALTER TABLE "PlatformOnInfoGame" DROP CONSTRAINT "PlatformOnInfoGame_info_game_id_fkey";

-- DropForeignKey
ALTER TABLE "PlatformOnInfoGame" DROP CONSTRAINT "PlatformOnInfoGame_platform_id_fkey";

-- DropForeignKey
ALTER TABLE "ReleaseDate" DROP CONSTRAINT "ReleaseDate_platform_id_fkey";

-- DropForeignKey
ALTER TABLE "ScreenshotsStore" DROP CONSTRAINT "ScreenshotsStore_store_info_game_id_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_info_game_id_fkey";

-- DropForeignKey
ALTER TABLE "VideosStore" DROP CONSTRAINT "VideosStore_store_info_game_id_fkey";

-- AlterTable
CREATE SEQUENCE infogame_id_seq;
ALTER TABLE "InfoGame" DROP COLUMN "first_release_date",
DROP COLUMN "name",
DROP COLUMN "storyline",
DROP COLUMN "summary",
DROP COLUMN "version_title",
ADD COLUMN     "about" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "developer" TEXT NOT NULL,
ADD COLUMN     "imgStore" TEXT NOT NULL DEFAULT '-',
ADD COLUMN     "publisher" TEXT NOT NULL,
ADD COLUMN     "release_date" TEXT NOT NULL,
ADD COLUMN     "storeIdGame" TEXT NOT NULL,
ADD COLUMN     "store_game_id" INTEGER NOT NULL,
ADD COLUMN     "supportedLanguages" TEXT DEFAULT '-',
ADD COLUMN     "website" TEXT DEFAULT '-',
ALTER COLUMN "id" SET DEFAULT nextval('infogame_id_seq');
ALTER SEQUENCE infogame_id_seq OWNED BY "InfoGame"."id";

-- AlterTable
ALTER TABLE "StoreGame" DROP COLUMN "imgStore",
DROP COLUMN "storeIdGame";

-- DropTable
DROP TABLE "AlternativeName";

-- DropTable
DROP TABLE "AlternativeNameOnInfoGame";

-- DropTable
DROP TABLE "Artwork";

-- DropTable
DROP TABLE "Company";

-- DropTable
DROP TABLE "CompanyLogo";

-- DropTable
DROP TABLE "Cover";

-- DropTable
DROP TABLE "GameEngine";

-- DropTable
DROP TABLE "GameEngineOnInfoGame";

-- DropTable
DROP TABLE "GameOnInfoGame";

-- DropTable
DROP TABLE "Genre";

-- DropTable
DROP TABLE "GenreStoreInStoreInfoGame";

-- DropTable
DROP TABLE "GenresStore";

-- DropTable
DROP TABLE "InvolvedCompany";

-- DropTable
DROP TABLE "Keyword";

-- DropTable
DROP TABLE "KeywordOnInfoGame";

-- DropTable
DROP TABLE "Platform";

-- DropTable
DROP TABLE "PlatformLogo";

-- DropTable
DROP TABLE "PlatformOnInfoGame";

-- DropTable
DROP TABLE "ReleaseDate";

-- DropTable
DROP TABLE "ScreenshotsStore";

-- DropTable
DROP TABLE "StoreInfoGame";

-- DropTable
DROP TABLE "Video";

-- DropTable
DROP TABLE "VideosStore";

-- CreateTable
CREATE TABLE "Videos" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "info_game_id" INTEGER NOT NULL,

    CONSTRAINT "Videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Genres" (
    "id" SERIAL NOT NULL,
    "genre" TEXT NOT NULL,

    CONSTRAINT "Genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Screenshots" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "thumbUrl" TEXT,
    "info_game_id" INTEGER NOT NULL,

    CONSTRAINT "Screenshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categories" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoriesOnInfoGame" (
    "category_id" INTEGER NOT NULL,
    "info_game_id" INTEGER NOT NULL,

    CONSTRAINT "CategoriesOnInfoGame_pkey" PRIMARY KEY ("category_id","info_game_id")
);

-- CreateTable
CREATE TABLE "PcRequirements" (
    "id" SERIAL NOT NULL,
    "minimum" TEXT NOT NULL DEFAULT '-',
    "recommended" TEXT NOT NULL DEFAULT '-',
    "info_game_id" INTEGER NOT NULL,

    CONSTRAINT "PcRequirements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Genres_genre_key" ON "Genres"("genre");

-- CreateIndex
CREATE UNIQUE INDEX "Categories_category_key" ON "Categories"("category");

-- CreateIndex
CREATE UNIQUE INDEX "PcRequirements_info_game_id_key" ON "PcRequirements"("info_game_id");

-- CreateIndex
CREATE UNIQUE INDEX "InfoGame_store_game_id_key" ON "InfoGame"("store_game_id");

-- AddForeignKey
ALTER TABLE "InfoGame" ADD CONSTRAINT "InfoGame_store_game_id_fkey" FOREIGN KEY ("store_game_id") REFERENCES "StoreGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Videos" ADD CONSTRAINT "Videos_info_game_id_fkey" FOREIGN KEY ("info_game_id") REFERENCES "InfoGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenreOnInfoGame" ADD CONSTRAINT "GenreOnInfoGame_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "Genres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Screenshots" ADD CONSTRAINT "Screenshots_info_game_id_fkey" FOREIGN KEY ("info_game_id") REFERENCES "InfoGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesOnInfoGame" ADD CONSTRAINT "CategoriesOnInfoGame_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesOnInfoGame" ADD CONSTRAINT "CategoriesOnInfoGame_info_game_id_fkey" FOREIGN KEY ("info_game_id") REFERENCES "InfoGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PcRequirements" ADD CONSTRAINT "PcRequirements_info_game_id_fkey" FOREIGN KEY ("info_game_id") REFERENCES "InfoGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
