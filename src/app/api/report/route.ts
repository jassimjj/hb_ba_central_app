import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const data = await prisma.inventory.findMany({
    include: {
      store: true,
      sku: true,
    },
    orderBy: [{ store: { name: "asc" } }, { sku: { name: "asc" } }],
  });

  // If CSV requested, return as CSV
  const url = new URL(req.url);
  if (url.searchParams.get("format") === "csv") {
    const header = "Store,Location,SKU,Brand,Status,Chronic OOS,Updated At";
    const rows = data.map(inv => [
      inv.store.name,
      inv.store.location,
      inv.sku.name,
      inv.sku.brand,
      inv.status,
      inv.sku.chronicOOS ? "Yes" : "No",
      inv.updatedAt.toISOString(),
    ].map(v => `"${v}"`).join(",")).join("\n");
    const csv = `${header}\n${rows}`;
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=inventory_report.csv",
      },
    });
  }

  // Default: JSON
  return NextResponse.json({ data });
}
