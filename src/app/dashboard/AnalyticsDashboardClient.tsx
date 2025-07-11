"use client";
import { useEffect, useState } from "react";

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <div className={`flex-1 bg-white rounded shadow p-4 border-t-4 ${color} min-w-[120px]`}>
      <div className="text-xs text-gray-500 mb-1">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

export default function AnalyticsDashboardClient() {
  type StoreStat = { storeId: string; storeName: string; oos: number; low: number; total: number };
  type ChronicOOS = { id: string; name: string };
  const [stats, setStats] = useState<{ storeStats: StoreStat[]; chronicOOS: ChronicOOS[] } | null>(null);
  useEffect(() => {
    fetch("/api/analytics").then(res => res.json()).then(setStats);
  }, []);
  if (!stats) return <div className="text-center p-8">Loading analytics...</div>;
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4 mb-6">
        {stats.storeStats.map((s) => (
          <div key={s.storeId} className="flex-1 min-w-[200px]">
            <div className="font-semibold text-pink-700 mb-1">{s.storeName}</div>
            <div className="flex gap-2">
              <StatCard title="OOS" value={s.oos} color="border-red-400" />
              <StatCard title="Low Stock" value={s.low} color="border-yellow-400" />
              <StatCard title="Total SKUs" value={s.total} color="border-pink-400" />
            </div>
          </div>
        ))}
      </div>
      <div>
        <div className="font-semibold text-pink-700 mb-2">Chronic OOS SKUs</div>
        <ul className="flex flex-wrap gap-2">
          {stats.chronicOOS.length === 0 ? (
            <li className="text-gray-500">None</li>
          ) : (
            stats.chronicOOS.map((sku) => (
              <li key={sku.id} className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs">{sku.name}</li>
            ))
          )}
        </ul>
      </div>
      {/* Trend chart placeholder */}
      <div>
        <div className="font-semibold text-pink-700 mb-2">OOS/Low Stock Trend (7 days)</div>
        <div className="text-xs text-gray-500">(Trend chart coming soon)</div>
      </div>
    </div>
  );
}
