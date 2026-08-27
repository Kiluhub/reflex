import { requireRole } from "@/lib/auth/guards";

export default async function RetailerDeliveries() {
  await requireRole(["retailer"]);

  return <main><h1>Retailer Deliveries</h1></main>;
}
