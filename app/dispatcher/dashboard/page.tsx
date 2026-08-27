import { requireRole } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/dashboard/AppHeader";
import { DispatcherStats } from "@/components/dispatcher/DispatcherStats";
import { DeliveryQueue } from "@/components/dispatcher/DeliveryQueue";

export default async function DispatcherDashboard() {
  const { user } = await requireRole(["dispatcher"]);
  const supabase = await createClient();

  // RLS limits the returned delivery records to those the dispatcher
  // is authorized to operate on.
  const { data: deliveries } = await supabase
    .from("deliveries")
    .select("id, status");

  const all = deliveries ?? [];

  return (
    <>
      <AppHeader role="Dispatcher" />

      <main>
        <h1>Dispatcher Dashboard</h1>
        <p>Monitor deliveries and assign available riders.</p>

        <DispatcherStats
          pending={all.filter((d) => d.status === "pending").length}
          assigned={all.filter((d) => d.status === "assigned").length}
          pickedUp={all.filter((d) => d.status === "picked_up").length}
          delivered={all.filter((d) => d.status === "delivered").length}
        />

        <DeliveryQueue />
      </main>
    </>
  );
}
