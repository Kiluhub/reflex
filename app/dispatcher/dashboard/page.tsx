import { requireRole } from "@/lib/auth/guards";
import { AppHeader } from "@/components/dashboard/AppHeader";

export default async function DispatcherDashboard() {
  // Only dispatcher accounts can enter this operational panel.
  await requireRole(["dispatcher"]);

  return (
    <>
      <AppHeader role="Dispatcher" />

      <main>
        <h1>Dispatcher Dashboard</h1>
        <p>Monitor deliveries and assign riders.</p>
      </main>
    </>
  );
}
