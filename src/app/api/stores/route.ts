import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create or update a store
export async function POST(req: NextRequest) {
  const { id, name, location } = await req.json();
  if (!name || !location) {
    return NextResponse.json({ error: "Missing name or location" }, { status: 400 });
  }
  let store;
  if (id) {
    store = await prisma.store.update({ where: { id }, data: { name, location } });
  } else {
    store = await prisma.store.create({ data: { name, location } });
  }
  return NextResponse.json({ success: true, store });
}

// Delete a store
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.store.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
