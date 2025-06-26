import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST: Set global favorite SKUs (for all users)
export async function POST(req: NextRequest) {
  const { skuIds } = await req.json();
  if (!Array.isArray(skuIds)) {
    return NextResponse.json({ error: "Missing skuIds" }, { status: 400 });
  }
  // Remove all global favorites (userId = null)
  await prisma.favoriteSku.deleteMany({ where: { userId: null } });
  // Add new global favorites
  for (const skuId of skuIds) {
    await prisma.favoriteSku.create({ data: { skuId, userId: null } });
  }
  return NextResponse.json({ success: true });
}

// GET: Get all global favorite SKUs
export async function GET() {
  const favorites = await prisma.favoriteSku.findMany({ where: { userId: null }, include: { sku: true } });
  return NextResponse.json({ favorites });
}
