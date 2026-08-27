"use client";

import { useEffect, useState } from "react";

type Delivery = {
  id: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  item_description: string;
  status: string;
  created_at: string;
};

type Rider = {
  id: string;
  full_name: string | null;
  email: string | null;
};

export function DeliveryQueue() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [selectedRiders, setSelectedRiders] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState("");
  const [message, setMessage] = useState("");

  async function loadData() {
    try {
      // Deliveries are filtered by RLS according to the authenticated user.
      const deliveryResponse = await fetch("/api/deliveries", {
        cache: "no-store",
      });

      const deliveryResult = await deliveryResponse.json();

      if (!deliveryResponse.ok) {
        throw new Error(deliveryResult.error ?? "Failed to load deliveries");
      }

      setDeliveries(deliveryResult.data ?? []);

      // Riders are loaded from the profiles table.
      // RLS determines what the authenticated dispatcher can see.
      const response = await fetch("/api/riders", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Failed to load riders");
      }

      setRiders(result.data ?? []);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to load dispatcher data",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function assign(deliveryId: string) {
    const riderId = selectedRiders[deliveryId];

    if (!riderId) {
      setMessage("Select a rider first.");
      return;
    }

    setAssigning(deliveryId);
    setMessage("");

    try {
      // The API delegates the real atomic assignment to PostgreSQL.
      const response = await fetch("/api/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delivery_id: deliveryId,
          rider_id: riderId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error ?? "Assignment failed.");
        return;
      }

      setMessage("Delivery assigned successfully.");

      // Refresh the queue so the new state is immediately visible.
      await loadData();
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setAssigning("");
    }
  }

  if (loading) {
    return <p>Loading delivery queue...</p>;
  }

  return (
    <section>
      <h2>Delivery Queue</h2>

      {message && <p>{message}</p>}

      {deliveries.length === 0 && <p>No deliveries available.</p>}

      {deliveries.map((delivery) => (
        <article key={delivery.id}>
          <div>
            <strong>{delivery.customer_name}</strong>
            <span>{delivery.status}</span>
          </div>

          <p>{delivery.item_description}</p>
          <p>{delivery.delivery_address}</p>
          <p>{delivery.customer_phone}</p>

          {delivery.status === "pending" && (
            <div>
              <select
                value={selectedRiders[delivery.id] ?? ""}
                onChange={(event) =>
                  setSelectedRiders((current) => ({
                    ...current,
                    [delivery.id]: event.target.value,
                  }))
                }
              >
                <option value="">Select rider</option>

                {riders.map((rider) => (
                  <option key={rider.id} value={rider.id}>
                    {rider.full_name ?? rider.email ?? rider.id}
                  </option>
                ))}
              </select>

              <button
                onClick={() => assign(delivery.id)}
                disabled={assigning === delivery.id}
              >
                {assigning === delivery.id ? "Assigning..." : "Assign rider"}
              </button>
            </div>
          )}
        </article>
      ))}
    </section>
  );
}
