/*
  Warnings:

  - Added the required column `image_id` to the `Artwork` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_id` to the `CompanyLogo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_id` to the `Cover` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_id` to the `PlatformLogo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_id` to the `Screenshot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Artwork" ADD COLUMN     "image_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "CompanyLogo" ADD COLUMN     "image_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Cover" ADD COLUMN     "image_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PlatformLogo" ADD COLUMN     "image_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Screenshot" ADD COLUMN     "image_id" INTEGER NOT NULL;
