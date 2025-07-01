import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST: Update assortment for a store (assign/unassign SKUs)
export async function POST(req: NextRequest) {
  const { storeId, skuIds } = await req.json();
  if (!storeId || !Array.isArray(skuIds)) {
    return NextResponse.json({ error: "Missing storeId or skuIds" }, { status: 400 });
  }
  // Remove all inventory for this store not in skuIds
  await prisma.inventory.deleteMany({
    where: {
      storeId,
      skuId: { notIn: skuIds },
    },
  });
  // Add inventory for any new skuIds
  for (const skuId of skuIds) {
    await prisma.inventory.upsert({
      where: { storeId_skuId: { storeId, skuId } },
      update: {},
      create: { storeId, skuId, status: "IN_STOCK" },
    });
  }
  return NextResponse.json({ success: true });
}
