import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create or update a SKU
export async function POST(req: NextRequest) {
  const { id, name, brand } = await req.json();
  if (!name || !brand) {
    return NextResponse.json({ error: "Missing name or brand" }, { status: 400 });
  }
  let sku;
  if (id) {
    sku = await prisma.sku.update({ where: { id }, data: { name, brand } });
  } else {
    sku = await prisma.sku.create({ data: { name, brand } });
  }
  return NextResponse.json({ success: true, sku });
}

// Delete a SKU
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.sku.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
