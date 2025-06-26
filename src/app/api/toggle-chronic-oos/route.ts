import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Toggle chronic OOS for a SKU
export async function POST(req: NextRequest) {
  const { skuId, chronicOOS } = await req.json();
  if (!skuId || typeof chronicOOS !== "boolean") {
    return NextResponse.json({ error: "Missing skuId or chronicOOS" }, { status: 400 });
  }
  const updated = await prisma.sku.update({
    where: { id: skuId },
    data: { chronicOOS },
  });
  return NextResponse.json({ success: true, updated });
}
