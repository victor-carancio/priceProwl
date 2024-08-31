/*
  Warnings:

  - You are about to drop the `AgeRatings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Language` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LanguageSupport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlayerPerspective` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlayerPerspectiveOnInfoGame` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Screenshot` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CurrencyTypes" AS ENUM ('USD', 'CLP');

-- CreateEnum
CREATE TYPE "PlatformsTypes" AS ENUM ('PC');

-- DropForeignKey
ALTER TABLE "AgeRatings" DROP CONSTRAINT "AgeRatings_info_game_id_fkey";

-- DropForeignKey
ALTER TABLE "LanguageSupport" DROP CONSTRAINT "LanguageSupport_info_game_id_fkey";

-- DropForeignKey
ALTER TABLE "LanguageSupport" DROP CONSTRAINT "LanguageSupport_language_id_fkey";

-- DropForeignKey
ALTER TABLE "PlayerPerspectiveOnInfoGame" DROP CONSTRAINT "PlayerPerspectiveOnInfoGame_info_game_id_fkey";

-- DropForeignKey
ALTER TABLE "PlayerPerspectiveOnInfoGame" DROP CONSTRAINT "PlayerPerspectiveOnInfoGame_player_perspective_id_fkey";

-- DropForeignKey
ALTER TABLE "Screenshot" DROP CONSTRAINT "Screenshot_info_game_id_fkey";

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "platform" "PlatformsTypes" NOT NULL DEFAULT 'PC';

-- AlterTable
ALTER TABLE "StorePrice" ADD COLUMN     "currency" "CurrencyTypes" NOT NULL DEFAULT 'USD';

-- DropTable
DROP TABLE "AgeRatings";

-- DropTable
DROP TABLE "Language";

-- DropTable
DROP TABLE "LanguageSupport";

-- DropTable
DROP TABLE "PlayerPerspective";

-- DropTable
DROP TABLE "PlayerPerspectiveOnInfoGame";

-- DropTable
DROP TABLE "Screenshot";
