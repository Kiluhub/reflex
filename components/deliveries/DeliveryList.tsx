"use client";

import { useEffect, useState } from "react";
import { DeliveryStatus } from "./DeliveryStatus";

type Delivery = {
  id: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  item_description: string;
  status: string;
  created_at: string;
};

export function DeliveryList() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDeliveries() {
    try {
      const response = await fetch("/api/deliveries", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Failed to load deliveries");
      }

      setDeliveries(result.data ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load deliveries",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Load the retailer's deliveries when the panel opens.
    loadDeliveries();
  }, []);

  if (loading) {
    return <p>Loading deliveries...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (deliveries.length === 0) {
    return <p>No deliveries yet.</p>;
  }

  return (
    <section>
      <h2>Your deliveries</h2>

      {deliveries.map((delivery) => (
        <article key={delivery.id}>
          <div>
            <strong>{delivery.customer_name}</strong>
            <DeliveryStatus status={delivery.status} />
          </div>

          <p>{delivery.item_description}</p>
          <p>{delivery.delivery_address}</p>
          <p>{delivery.customer_phone}</p>

          <small>
            {new Date(delivery.created_at).toLocaleString()}
          </small>
        </article>
      ))}
    </section>
  );
}
