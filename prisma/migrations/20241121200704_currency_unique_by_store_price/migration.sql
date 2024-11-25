/*
  Warnings:

  - A unique constraint covering the columns `[id,currency]` on the table `StorePrice` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StorePrice_id_currency_key" ON "StorePrice"("id", "currency");
