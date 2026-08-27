import { requireRole } from "@/lib/auth/guards";

export default async function RiderDeliveries() {
  await requireRole(["rider"]);

  return <main><h1>Rider Deliveries</h1></main>;
}
