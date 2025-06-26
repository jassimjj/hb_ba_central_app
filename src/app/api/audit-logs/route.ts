import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Fetch audit logs (optionally filter by userId, action, target)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const action = searchParams.get("action");
  const target = searchParams.get("target");
  const where: any = {};
  if (userId) where.userId = userId;
  if (action) where.action = action;
  if (target) where.target = target;
  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: true },
  });
  return NextResponse.json({ logs });
}
