"use client";
import { useEffect, useState } from "react";

type Sku = { id: string; name: string };

type GlobalFavoritesManagerProps = {
  skus: Sku[];
};

export default function GlobalFavoritesManager({ skus }: GlobalFavoritesManagerProps) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/global-favorites")
      .then(res => res.json())
      .then(res => setFavoriteIds(res.favorites.map((f: any) => f.skuId)));
  }, []);

  const handleToggle = (skuId: string) => {
    setFavoriteIds(ids =>
      ids.includes(skuId) ? ids.filter(id => id !== skuId) : [...ids, skuId]
    );
  };

  const handleSave = async () => {
    setLoading(true);
    await fetch("/api/global-favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skuIds: favoriteIds }),
    });
    setLoading(false);
    // Optionally show a notification
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-pink-700 mb-2">Global Favorite SKUs</h3>
      <div className="flex flex-wrap gap-2 mb-2">
        {skus.map(sku => (
          <label key={sku.id} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={favoriteIds.includes(sku.id)}
              onChange={() => handleToggle(sku.id)}
            />
            <span>{sku.name}</span>
          </label>
        ))}
      </div>
      <button
        onClick={handleSave}
        className="bg-pink-600 text-white px-3 py-1 rounded"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Favorites"}
      </button>
    </div>
  );
}
