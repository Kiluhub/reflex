import { z } from "zod";

// Data required when a retailer creates a delivery request.
// These fields come directly from the Reflex case study.
export const createDeliverySchema = z.object({
  customer_name: z.string().trim().min(2).max(120),
  customer_phone: z.string().trim().min(7).max(30),
  customer_email: z.string().trim().email().max(254),
  address: z.string().trim().min(3).max(300),
  item_description: z.string().trim().min(1).max(500),
});

// Dispatcher assignment request.
export const assignDeliverySchema = z.object({
  delivery_id: z.string().uuid(),
  rider_id: z.string().uuid(),
});

// Only the two rider-driven transitions are accepted here.
// PostgreSQL remains the final authority on the transition.
export const updateStatusSchema = z.object({
  delivery_id: z.string().uuid(),
  status: z.enum(["picked_up", "delivered"]),
});

// Delivery confirmation request.
// The rider enters the plain 6-digit PIN received by the customer.
// The API hashes the PIN before sending it to PostgreSQL.
export const confirmDeliverySchema = z.object({
  delivery_id: z.string().uuid(),
  token: z.string().trim().regex(/^\d{6}$/, "PIN must be 6 digits"),
});