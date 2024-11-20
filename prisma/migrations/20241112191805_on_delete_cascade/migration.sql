-- DropForeignKey
ALTER TABLE "FeaturedGameCategory" DROP CONSTRAINT "FeaturedGameCategory_feature_category_id_fkey";

-- DropForeignKey
ALTER TABLE "FeaturedGameCategory" DROP CONSTRAINT "FeaturedGameCategory_game_id_fkey";

-- DropForeignKey
ALTER TABLE "FeaturedGameCategory" DROP CONSTRAINT "FeaturedGameCategory_store_id_fkey";

-- AddForeignKey
ALTER TABLE "FeaturedGameCategory" ADD CONSTRAINT "FeaturedGameCategory_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeaturedGameCategory" ADD CONSTRAINT "FeaturedGameCategory_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "StoreGame"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeaturedGameCategory" ADD CONSTRAINT "FeaturedGameCategory_feature_category_id_fkey" FOREIGN KEY ("feature_category_id") REFERENCES "FeatureCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
