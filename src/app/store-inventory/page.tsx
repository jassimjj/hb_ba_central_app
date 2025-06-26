import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { authOptions } from '../api/auth/authOptions';
import StoreInventoryClient from "./StoreInventoryClient";

const prisma = new PrismaClient();

export default async function StoreInventoryPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "BEAUTY_ADVISOR") {
    redirect("/login");
  }

  // Get the beauty advisor's stores and inventory
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: {
      stores: {
        include: {
          inventory: {
            include: { sku: true },
          },
        },
      },
    },
  });

  const store = user?.stores[0];
  if (!store) {
    return <div className="p-8 text-center">No store assigned.</div>;
  }

  return <StoreInventoryClient store={store} />;
}
