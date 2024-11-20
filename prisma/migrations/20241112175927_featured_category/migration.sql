-- CreateTable
CREATE TABLE "FeatureCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "FeatureCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeaturedGameCategory" (
    "id" SERIAL NOT NULL,
    "game_id" INTEGER NOT NULL,
    "store_id" INTEGER NOT NULL,
    "feature_category_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeaturedGameCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FeaturedGameCategory" ADD CONSTRAINT "FeaturedGameCategory_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeaturedGameCategory" ADD CONSTRAINT "FeaturedGameCategory_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "StoreGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeaturedGameCategory" ADD CONSTRAINT "FeaturedGameCategory_feature_category_id_fkey" FOREIGN KEY ("feature_category_id") REFERENCES "FeatureCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
