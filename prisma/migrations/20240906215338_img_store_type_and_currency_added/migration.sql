-- AlterTable
ALTER TABLE "StoreGame" ADD COLUMN     "imgStore" TEXT NOT NULL DEFAULT '-',
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'Official';

-- AlterTable
ALTER TABLE "StorePrice" ALTER COLUMN "currency" SET DEFAULT 'CLP';
