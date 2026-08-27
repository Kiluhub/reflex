"use client";

import { useState } from "react";

type Props = {
  deliveryId: string;
  status: string;
  onUpdated: () => void;
};

export function DeliveryActions({
  deliveryId,
  status,
  onUpdated,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function updateStatus(nextStatus: "picked_up" | "delivered") {
    setLoading(true);
    setMessage("");

    try {
      // Status changes go through the protected API.
      // PostgreSQL performs the final rider/transition checks.
      const response = await fetch("/api/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delivery_id: deliveryId,
          status: nextStatus,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error ?? "Unable to update status.");
        return;
      }

      setMessage("Status updated.");
      onUpdated();
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function confirmDelivery() {
    const token = window.prompt(
      "Enter the customer confirmation token:",
    );

    if (!token) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // The confirmation token is sent to the server for validation.
      // The database decides whether this delivery can be completed.
      const response = await fetch("/api/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delivery_id: deliveryId,
          token_hash: token,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error ?? "Confirmation failed.");
        return;
      }

      setMessage("Delivery confirmed.");
      onUpdated();
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {status === "assigned" && (
        <button
          onClick={() => updateStatus("picked_up")}
          disabled={loading}
        >
          {loading ? "Updating..." : "Mark picked up"}
        </button>
      )}

      {status === "picked_up" && (
        <button
          onClick={confirmDelivery}
          disabled={loading}
        >
          {loading ? "Confirming..." : "Confirm delivery"}
        </button>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}
