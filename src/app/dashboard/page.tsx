import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/authOptions";
import dynamic from "next/dynamic";

const AnalyticsDashboardClient = dynamic(() => import("./AnalyticsDashboardClient"), { ssr: false });

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center py-8 px-2">
      <div className="bg-white p-4 sm:p-8 rounded-lg shadow-md w-full max-w-4xl border border-pink-200">
        <h1 className="text-3xl font-bold mb-6 text-pink-600 text-center">Analytics Dashboard</h1>
        <AnalyticsDashboardClient />
      </div>
    </div>
  );
}
