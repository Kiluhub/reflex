"use client";

import { useState } from "react";

export function CreateDeliveryForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submitDelivery(formData: FormData) {
    setLoading(true);
    setMessage("");

    // Convert the form fields into the exact API contract.
    const payload = {
      customer_name: String(formData.get("customer_name") ?? ""),
      customer_phone: String(formData.get("customer_phone") ?? ""),
      customer_email: String(formData.get("customer_email") ?? ""),
      address: String(formData.get("delivery_address") ?? ""),
      item_description: String(formData.get("item_description") ?? ""),
    };

    try {
      const response = await fetch("/api/deliveries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error ?? "Unable to create delivery.");
        return;
      }

      // The confirmation PIN will be sent to the customer's email.
      setMessage("Delivery created successfully. Verification code sent to the customer.");

      // Reset the form after successful creation.
      (
        document.getElementById("delivery-form") as HTMLFormElement
      )?.reset();
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form id="delivery-form" action={submitDelivery}>
      <h2>Create delivery</h2>

      <input
        name="customer_name"
        placeholder="Customer name"
        required
      />

      <input
        name="customer_phone"
        placeholder="Customer phone"
        required
      />

      <input
        name="customer_email"
        type="email"
        placeholder="Customer email"
        required
      />

      <input
        name="delivery_address"
        placeholder="Delivery address"
        required
      />

      <textarea
        name="item_description"
        placeholder="Item description"
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create delivery"}
      </button>

      {message && <p>{message}</p>}
    </form>
  );
}