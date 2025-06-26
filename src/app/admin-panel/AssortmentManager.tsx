"use client";
import { useState } from "react";

type Store = { id: string; name: string; inventory: { skuId: string }[] };
type Sku = { id: string; name: string };

type AssortmentManagerProps = {
  stores: Store[];
  skus: Sku[];
};

export default function AssortmentManager({ stores, skus }: AssortmentManagerProps) {
  const [selectedStoreId, setSelectedStoreId] = useState(stores[0]?.id || "");
  const [selectedSkuIds, setSelectedSkuIds] = useState<string[]>(
    stores[0]?.inventory.map(inv => inv.skuId) || []
  );
  const [loading, setLoading] = useState(false);

  const handleStoreChange = (storeId: string) => {
    setSelectedStoreId(storeId);
    const store = stores.find(s => s.id === storeId);
    setSelectedSkuIds(store ? store.inventory.map(inv => inv.skuId) : []);
  };

  const handleToggleSku = (skuId: string) => {
    setSelectedSkuIds(ids =>
      ids.includes(skuId) ? ids.filter(id => id !== skuId) : [...ids, skuId]
    );
  };

  const handleSave = async () => {
    setLoading(true);
    await fetch("/api/assortment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storeId: selectedStoreId, skuIds: selectedSkuIds }),
    });
    setLoading(false);
    // Optionally show a notification
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-pink-700 mb-2">Assortment Management</h3>
      <div className="flex flex-wrap gap-2 mb-2">
        <label className="font-semibold">Store:</label>
        <select
          value={selectedStoreId}
          onChange={e => handleStoreChange(e.target.value)}
          className="px-2 py-1 border rounded"
        >
          {stores.map(store => (
            <option key={store.id} value={store.id}>{store.name}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {skus.map(sku => (
          <label key={sku.id} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={selectedSkuIds.includes(sku.id)}
              onChange={() => handleToggleSku(sku.id)}
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
        {loading ? "Saving..." : "Save Assortment"}
      </button>
    </div>
  );
}
