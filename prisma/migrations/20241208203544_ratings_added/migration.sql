-- CreateTable
CREATE TABLE "Rating" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "descriptors" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "infoGameId" INTEGER,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rating_name_key" ON "Rating"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_name_descriptors_key" ON "Rating"("name", "descriptors");

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_infoGameId_fkey" FOREIGN KEY ("infoGameId") REFERENCES "InfoGame"("id") ON DELETE SET NULL ON UPDATE CASCADE;
