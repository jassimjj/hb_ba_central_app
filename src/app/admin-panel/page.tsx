import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/authOptions";
import AdminPanelClient from "./AdminPanelClient";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function AdminPanelPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch all stores, SKUs, and users
  const stores = await prisma.store.findMany({
    select: {
      id: true,
      name: true,
      location: true,
      inventory: { include: { sku: true } }
    },
    orderBy: { name: "asc" },
  });
  const skus = await prisma.sku.findMany({ 
    select: {
      id: true,
      name: true,
      brand: true,
      chronicOOS: true
    },
    orderBy: { name: "asc" } 
  });
  const users = await prisma.user.findMany({
    include: { stores: true },
    orderBy: { name: "asc" },
  });

  return <AdminPanelClient stores={stores} skus={skus} users={users} />;
}
