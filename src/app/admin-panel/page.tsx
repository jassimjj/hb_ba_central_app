import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../api/auth/[...nextauth]/route";
import SkuListClient from "./SkuListClient";
import StoreListClient from "./StoreListClient";
import SkuCrudClient from "./SkuCrudClient";
import UserListClient from "./UserListClient";
import { useEffect, useState } from "react";
import AssortmentManager from "./AssortmentManager";
import GlobalFavoritesManager from "./GlobalFavoritesManager";

const prisma = new PrismaClient();

function ReportTable() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/report")
      .then(res => res.json())
      .then(res => {
        setData(res.data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-pink-700">Inventory Report</h3>
        <a
          href="/api/report?format=csv"
          className="bg-pink-600 text-white px-3 py-1 rounded text-xs hover:bg-pink-700"
        >
          Download CSV
        </a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[600px] text-xs">
          <thead>
            <tr className="bg-pink-100">
              <th className="p-2 border">Store</th>
              <th className="p-2 border">Location</th>
              <th className="p-2 border">SKU</th>
              <th className="p-2 border">Brand</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Chronic OOS</th>
              <th className="p-2 border">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center p-4">Loading...</td></tr>
            ) : (
              data.map((inv, i) => (
                <tr key={inv.id || i}>
                  <td className="p-2 border">{inv.store.name}</td>
                  <td className="p-2 border">{inv.store.location}</td>
                  <td className="p-2 border">{inv.sku.name}</td>
                  <td className="p-2 border">{inv.sku.brand}</td>
                  <td className="p-2 border">{inv.status.replace("_", " ")}</td>
                  <td className="p-2 border">{inv.sku.chronicOOS ? "Yes" : "No"}</td>
                  <td className="p-2 border">{new Date(inv.updatedAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AuditLogTable() {
  const [logs, setLogs] = useState<any[]>([]);
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
              logs.map((log: any) => (
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

export default function AdminPanel() {
  return (
    <div>
      <ReportTable />
      <AuditLogTable />
    </div>
  );
}
