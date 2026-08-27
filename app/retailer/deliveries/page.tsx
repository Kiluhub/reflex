import { requireRole } from "@/lib/auth/guards";
import { AppHeader } from "@/components/dashboard/AppHeader";
import { DeliveryList } from "@/components/deliveries/DeliveryList";

export default async function RetailerDeliveries() {
  // Prevent dispatcher/rider accounts from entering the retailer panel.
  await requireRole(["retailer"]);

  return (
    <>
      <AppHeader role="Retailer" />

      <main>
        <h1>Deliveries</h1>
        <DeliveryList />
      </main>
    </>
  );
}
