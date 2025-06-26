/*
  Warnings:

  - A unique constraint covering the columns `[storeId,skuId]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Inventory_storeId_skuId_key" ON "Inventory"("storeId", "skuId");
