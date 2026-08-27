"use client";

import { useCallback, useEffect, useState } from "react";
import { DeliveryActions } from "./DeliveryActions";

type Delivery = {
  id: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  item_description: string;
  status: string;
  created_at: string;
};

export function RiderDeliveryList() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDeliveries = useCallback(async () => {
    try {
      setError("");

      // The API returns only records permitted by authentication + RLS.
      const response = await fetch("/api/deliveries", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ?? "Failed to load deliveries",
        );
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
  }, []);

  useEffect(() => {
    // Load the rider's operational queue when the panel opens.
    loadDeliveries();
  }, [loadDeliveries]);

  if (loading) {
    return <p>Loading assigned deliveries...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const active = deliveries.filter(
    (delivery) =>
      delivery.status === "assigned" ||
      delivery.status === "picked_up",
  );

  if (active.length === 0) {
    return (
      <section>
        <h2>My deliveries</h2>
        <p>No active deliveries assigned.</p>
      </section>
    );
  }

  return (
    <section>
      <h2>My deliveries</h2>

      {active.map((delivery) => (
        <article key={delivery.id}>
          <header>
            <strong>{delivery.customer_name}</strong>
            <span>{delivery.status.replaceAll("_", " ")}</span>
          </header>

          <p>{delivery.item_description}</p>
          <p>{delivery.delivery_address}</p>
          <p>{delivery.customer_phone}</p>

          <DeliveryActions
            deliveryId={delivery.id}
            status={delivery.status}
            onUpdated={loadDeliveries}
          />
        </article>
      ))}
    </section>
  );
}
