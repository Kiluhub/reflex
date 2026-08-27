import { requireRole } from "@/lib/auth/guards";
import { AppHeader } from "@/components/dashboard/AppHeader";

export default async function RiderDashboard() {
  // Only rider accounts can enter this operational panel.
  await requireRole(["rider"]);

  return (
    <>
      <AppHeader role="Rider" />

      <main>
        <h1>Rider Dashboard</h1>
        <p>View assigned deliveries and update delivery progress.</p>
      </main>
    </>
  );
}
