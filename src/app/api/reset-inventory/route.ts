import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, StockStatus } from "@prisma/client";

const prisma = new PrismaClient();

// POST endpoint to reset all inventory statuses except chronic OOS
export async function POST(req: NextRequest) {
  // Find all SKUs that are NOT chronic OOS
  const skus = await prisma.sku.findMany({ where: { chronicOOS: false } });
  const skuIds = skus.map(sku => sku.id);

  // Update all inventory records for these SKUs to IN_STOCK
  await prisma.inventory.updateMany({
    where: {
      skuId: { in: skuIds },
    },
    data: {
      status: StockStatus.IN_STOCK,
    },
  });

  return NextResponse.json({ success: true });
}
