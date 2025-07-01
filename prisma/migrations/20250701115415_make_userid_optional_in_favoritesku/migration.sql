-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FavoriteSku" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "skuId" TEXT NOT NULL,
    CONSTRAINT "FavoriteSku_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "FavoriteSku_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "Sku" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_FavoriteSku" ("id", "skuId", "userId") SELECT "id", "skuId", "userId" FROM "FavoriteSku";
DROP TABLE "FavoriteSku";
ALTER TABLE "new_FavoriteSku" RENAME TO "FavoriteSku";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
