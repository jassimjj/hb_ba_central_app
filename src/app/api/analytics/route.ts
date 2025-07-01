import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  // OOS/Low Stock counts by store
  const stores = await prisma.store.findMany({
    include: {
      inventory: true,
    },
    orderBy: { name: "asc" },
  });
  const storeStats = stores.map(store => {
    const oos = store.inventory.filter(inv => inv.status === "OUT_OF_STOCK").length;
    const low = store.inventory.filter(inv => inv.status === "LOW_STOCK").length;
    const total = store.inventory.length;
    return {
      storeId: store.id,
      storeName: store.name,
      oos,
      low,
      total,
    };
  });

  // Top chronic OOS SKUs
  const skus = await prisma.sku.findMany({
    where: { chronicOOS: true },
    orderBy: { name: "asc" },
  });

  // OOS/Low Stock trend (last 7 days)
  // (For demo: just return current counts, as no historical data is tracked)
  const now = new Date();
  const trend = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (6 - i));
    return {
      date: date.toISOString().slice(0, 10),
      oos: null, // Placeholder
      low: null, // Placeholder
    };
  });

  return NextResponse.json({ storeStats, chronicOOS: skus, trend });
}
