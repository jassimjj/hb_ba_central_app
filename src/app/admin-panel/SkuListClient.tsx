"use client";
import { useState } from "react";

type Sku = {
  id: string;
  name: string;
  brand: string;
  chronicOOS: boolean;
};

export default function SkuListClient({ skus: initialSkus }: { skus: Sku[] }) {
  const [skus, setSkus] = useState<Sku[]>(initialSkus);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleToggle = async (skuId: string, chronicOOS: boolean) => {
    setLoadingId(skuId);
    const res = await fetch("/api/toggle-chronic-oos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skuId, chronicOOS }),
    });
    if (res.ok) {
      setSkus((prev) =>
        prev.map((sku) =>
          sku.id === skuId ? { ...sku, chronicOOS } : sku
        )
      );
    }
    setLoadingId(null);
  };

  return (
    <ul className="mb-6">
      {skus.map((sku) => (
        <li key={sku.id} className="mb-2 flex items-center flex-wrap">
          <span className="font-bold text-pink-600 mr-2">{sku.name}</span>
          <span className="text-xs mr-2">({sku.brand})</span>
          {sku.chronicOOS && (
            <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 rounded text-xs">Chronic OOS</span>
          )}
          <button
            className={`ml-4 px-2 py-1 rounded text-xs font-semibold border transition ${
              sku.chronicOOS
                ? "bg-pink-600 text-white border-pink-600"
                : "bg-white text-pink-600 border-pink-300 hover:bg-pink-100"
            } ${loadingId === sku.id ? "opacity-50" : ""}`}
            disabled={loadingId === sku.id}
            onClick={() => handleToggle(sku.id, !sku.chronicOOS)}
          >
            {sku.chronicOOS ? "Unset Chronic OOS" : "Set Chronic OOS"}
          </button>
        </li>
      ))}
    </ul>
  );
}
