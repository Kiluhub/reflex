import { requireRole } from "@/lib/auth/guards";
import { AppHeader } from "@/components/dashboard/AppHeader";

export default async function RetailerDashboard() {
  // Server-side role authorization prevents cross-role access.
  await requireRole(["retailer"]);

  return (
    <>
      <AppHeader role="Retailer" />

      <main>
        <h1>Retailer Dashboard</h1>
        <p>Manage deliveries and track their progress.</p>
      </main>
    </>
  );
}
