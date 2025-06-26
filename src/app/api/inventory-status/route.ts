import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, StockStatus } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { inventoryId, status } = await req.json();
  if (!inventoryId || !status) {
    return NextResponse.json({ error: "Missing inventoryId or status" }, { status: 400 });
  }
  if (!Object.values(StockStatus).includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  const updated = await prisma.inventory.update({
    where: { id: inventoryId },
    data: { status },
  });
  return NextResponse.json({ success: true, updated });
}
