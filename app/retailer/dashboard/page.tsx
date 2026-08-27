import { requireRole } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/dashboard/AppHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { CreateDeliveryForm } from "@/components/deliveries/CreateDeliveryForm";
import { DeliveryList } from "@/components/deliveries/DeliveryList";

export default async function RetailerDashboard() {
  const { user } = await requireRole(["retailer"]);
  const supabase = await createClient();

  // Fetch only this retailer's deliveries.
  // RLS remains the final authorization boundary.
  const { data: deliveries } = await supabase
    .from("deliveries")
    .select("id, status")
    .eq("retailer_id", user.id);

  const all = deliveries ?? [];

  // Calculate dashboard metrics from the retailer's own records.
  const pending = all.filter((d) => d.status === "pending").length;
  const assigned = all.filter((d) => d.status === "assigned").length;
  const delivered = all.filter((d) => d.status === "delivered").length;

  return (
    <>
      <AppHeader role="Retailer" />

      <main>
        <h1>Retailer Dashboard</h1>
        <p>Track every delivery from request to completion.</p>

        <section>
          <StatCard label="Total deliveries" value={all.length} />
          <StatCard label="Pending" value={pending} />
          <StatCard label="Assigned" value={assigned} />
          <StatCard label="Delivered" value={delivered} />
        </section>

        <CreateDeliveryForm />

        <DeliveryList />
      </main>
    </>
  );
}
