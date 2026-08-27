import { requireRole } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/dashboard/AppHeader";
import { RiderStats } from "@/components/rider/RiderStats";
import { RiderDeliveryList } from "@/components/rider/RiderDeliveryList";

export default async function RiderDashboard() {
  const { user } = await requireRole(["rider"]);
  const supabase = await createClient();

  // RLS ensures the rider only receives deliveries they are
  // authorized to see.
  const { data: deliveries } = await supabase
    .from("deliveries")
    .select("id, status");

  const all = deliveries ?? [];

  return (
    <>
      <AppHeader role="Rider" />

      <main>
        <h1>Rider Dashboard</h1>
        <p>Manage your assigned deliveries from pickup to completion.</p>

        <RiderStats
          assigned={all.filter((d) => d.status === "assigned").length}
          pickedUp={all.filter((d) => d.status === "picked_up").length}
          delivered={all.filter((d) => d.status === "delivered").length}
        />

        <RiderDeliveryList />
      </main>
    </>
  );
}
