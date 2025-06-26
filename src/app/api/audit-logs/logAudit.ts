import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function logAudit({
  userId,
  action,
  target,
  targetId,
  message,
}: {
  userId?: string;
  action: string;
  target: string;
  targetId?: string;
  message: string;
}) {
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      target,
      targetId,
      message,
    },
  });
}
