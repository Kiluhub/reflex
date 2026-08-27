import { requireRole } from "@/lib/auth/guards";
import { AppHeader } from "@/components/dashboard/AppHeader";
import { DeliveryQueue } from "@/components/dispatcher/DeliveryQueue";

export default async function DispatcherDeliveries() {
  // Only dispatcher accounts can access the operational queue.
  await requireRole(["dispatcher"]);

  return (
    <>
      <AppHeader role="Dispatcher" />

      <main>
        <h1>Deliveries</h1>
        <DeliveryQueue />
      </main>
    </>
  );
}
