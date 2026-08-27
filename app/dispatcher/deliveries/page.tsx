import { requireRole } from "@/lib/auth/guards";

export default async function DispatcherDeliveries() {
  await requireRole(["dispatcher"]);

  return <main><h1>Dispatcher Deliveries</h1></main>;
}
