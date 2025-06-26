"use client";
import { useState } from "react";

type Inventory = {
  id: string;
  status: string;
  sku: { name: string };
};

type Store = {
  name: string;
  inventory: Inventory[];
};

export default function StoreInventoryClient({ store }: { store: Store }) {
  const [inventory, setInventory] = useState<Inventory[]>(store.inventory);
  const [loadingId, setLoadingId] = useState("");

  const handleStatusChange = async (inventoryId: string, status: string) => {
    setLoadingId(inventoryId + status);
    const res = await fetch("/api/inventory-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inventoryId, status }),
    });
    if (res.ok) {
      setInventory((prev) =>
        prev.map((inv) =>
          inv.id === inventoryId ? { ...inv, status } : inv
        )
      );
    }
    setLoadingId("");
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center py-8 px-2">
      <div className="bg-white p-4 sm:p-8 rounded-lg shadow-md w-full max-w-2xl border border-pink-200 overflow-x-auto">
        <h1 className="text-2xl font-bold mb-4 text-pink-600 text-center">{store.name} Inventory</h1>
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse min-w-[400px]">
            <thead>
              <tr className="bg-pink-100">
                <th className="p-2 border">SKU</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((inv) => (
                <tr key={inv.id}>
                  <td className="p-2 border whitespace-normal break-words">{inv.sku.name}</td>
                  <td className="p-2 border">{inv.status.replace("_", " ")}</td>
                  <td className="p-2 border text-center">
                    {["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"].map((status) => (
                      <button
                        key={status}
                        className={`mx-1 mb-1 px-2 py-1 rounded text-xs font-semibold border transition ${
                          inv.status === status
                            ? "bg-pink-600 text-white border-pink-600"
                            : "bg-white text-pink-600 border-pink-300 hover:bg-pink-100"
                        } ${loadingId === inv.id + status ? "opacity-50" : ""}`}
                        disabled={inv.status === status || loadingId === inv.id + status}
                        onClick={() => handleStatusChange(inv.id, status)}
                      >
                        {status.replace("_", " ")}
                      </button>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
