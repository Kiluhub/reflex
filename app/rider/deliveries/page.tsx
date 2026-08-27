import { requireRole } from "@/lib/auth/guards";
import { AppHeader } from "@/components/dashboard/AppHeader";
import { RiderDeliveryList } from "@/components/rider/RiderDeliveryList";

export default async function RiderDeliveries() {
  // Prevent retailer and dispatcher accounts from accessing
  // the rider operational workflow.
  await requireRole(["rider"]);

  return (
    <>
      <AppHeader role="Rider" />

      <main>
        <h1>My Deliveries</h1>
        <RiderDeliveryList />
      </main>
    </>
  );
}
