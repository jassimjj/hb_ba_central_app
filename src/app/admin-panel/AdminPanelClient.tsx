"use client";
import StoreListClient from "./StoreListClient";
import SkuCrudClient from "./SkuCrudClient";
import UserListClient from "./UserListClient";
import AssortmentManager from "./AssortmentManager";
import GlobalFavoritesManager from "./GlobalFavoritesManager";
import { useEffect, useState } from "react";

function AuditLogTable() {
  const [logs, setLogs] = useState<{ id: string; user?: { name?: string }; action: string; target: string; targetId?: string; message: string; createdAt: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/audit-logs")
      .then(res => res.json())
      .then(res => {
        setLogs(res.logs);
        setLoading(false);
      });
  }, []);

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-pink-700 mb-2">Audit Logs</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[600px] text-xs">
          <thead>
            <tr className="bg-pink-100">
              <th className="p-2 border">Time</th>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Action</th>
              <th className="p-2 border">Target</th>
              <th className="p-2 border">Message</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center p-4">Loading...</td></tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td className="p-2 border">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="p-2 border">{log.user?.name || "System"}</td>
                  <td className="p-2 border">{log.action}</td>
                  <td className="p-2 border">{log.target}{log.targetId ? ` (${log.targetId})` : ""}</td>
                  <td className="p-2 border">{log.message}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type StoreWithInventory = {
  id: string;
  name: string;
  location: string;
  inventory: { skuId: string }[];
};

export default function AdminPanelClient({ stores, skus, users }: { 
  stores: StoreWithInventory[]; 
  skus: { id: string; name: string; brand: string; chronicOOS: boolean }[]; 
  users: { id: string; name: string }[] 
}) {
  // Create stores data for StoreListClient (only needs id, name, location)
  const storesForList = stores.map(store => ({
    id: store.id,
    name: store.name,
    location: store.location
  }));

  // Create stores data for AssortmentManager (needs id, name, inventory)
  const storesForAssortment = stores.map(store => ({
    id: store.id,
    name: store.name,
    inventory: store.inventory
  }));
  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center py-8 px-2">
      <div className="bg-white p-4 sm:p-8 rounded-lg shadow-md w-full max-w-4xl border border-pink-200 overflow-x-auto">
        <h1 className="text-3xl font-bold mb-6 text-pink-600 text-center">Admin Panel</h1>
        <h2 className="text-xl font-semibold mb-2 text-pink-700">Stores</h2>
        <StoreListClient stores={storesForList} />
        <h2 className="text-xl font-semibold mb-2 text-pink-700">SKUs</h2>
        <SkuCrudClient skus={skus} />
        <h2 className="text-xl font-semibold mb-2 text-pink-700">Users</h2>
        <UserListClient initialUsers={users} stores={storesForList} />
        <h2 className="text-xl font-semibold mb-2 text-pink-700">Assortment</h2>
        <AssortmentManager stores={storesForAssortment} skus={skus} />
        <h2 className="text-xl font-semibold mb-2 text-pink-700">Global Favorites</h2>
        <GlobalFavoritesManager skus={skus} />
        <AuditLogTable />
        <div className="text-center text-pink-500">Reporting features coming soon.</div>
      </div>
    </div>
  );
}
