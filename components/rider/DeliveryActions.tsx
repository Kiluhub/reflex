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
      // PostgreSQL performs the final rider and transition checks.
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
    // The customer gives this PIN to the rider after receiving the order.
    const token = window.prompt(
      "Enter the customer's 6-digit verification code:",
    );

    if (!token) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Send the plain PIN to the protected backend.
      // The server hashes it and compares it with the stored hash.
      const response = await fetch("/api/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delivery_id: deliveryId,
          token: token.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error ?? "Invalid verification code.");
        return;
      }

      setMessage("Delivery confirmed successfully.");
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