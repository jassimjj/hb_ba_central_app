import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Fetch alerts for a user (or global if userId is null)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const alerts = await prisma.alert.findMany({
    where: {
      OR: [
        { userId },
        { userId: null }, // global alerts
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json({ alerts });
}

// POST: Create an alert
export async function POST(req: NextRequest) {
  const { userId, message, type } = await req.json();
  if (!message || !type) {
    return NextResponse.json({ error: "Missing message or type" }, { status: 400 });
  }
  const alert = await prisma.alert.create({
    data: { userId, message, type },
  });
  return NextResponse.json({ alert });
}

// PATCH: Mark alert as read
export async function PATCH(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.alert.update({ where: { id }, data: { read: true } });
  return NextResponse.json({ success: true });
}
