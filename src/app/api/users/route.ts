import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

// Create or update a user
export async function POST(req: NextRequest) {
  const { id, name, email, password, role, storeIds } = await req.json();
  if (!name || !email || !role) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  let user;
  if (id) {
    user = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        ...(password ? { password: await hash(password, 10) } : {}),
        role,
        stores: { set: storeIds?.map((sid: string) => ({ id: sid })) || [] },
      },
    });
  } else {
    user = await prisma.user.create({
      data: {
        name,
        email,
        password: await hash(password || "changeme", 10),
        role,
        stores: { connect: storeIds?.map((sid: string) => ({ id: sid })) || [] },
      },
    });
  }
  return NextResponse.json({ success: true, user });
}

// Delete a user
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
