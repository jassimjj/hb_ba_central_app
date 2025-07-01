import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, StockStatus } from "@prisma/client";

const prisma = new PrismaClient();

// POST endpoint to reset all inventory statuses except chronic OOS
export async function POST() {
  // Find all SKUs that are NOT chronic OOS
  const skus = await prisma.sku.findMany({ where: { chronicOOS: false } });
  const skuIds = skus.map((sku: { id: string }) => sku.id);

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

// GET endpoint to reset all inventory statuses except chronic OOS
export async function GET() {
  // Find all SKUs that are NOT chronic OOS
  const skus = await prisma.sku.findMany({ where: { chronicOOS: false } });
  const skuIds = skus.map((sku: { id: string }) => sku.id);

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
