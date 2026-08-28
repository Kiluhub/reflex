import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth/api";
import { confirmDeliverySchema } from "@/lib/validation/schemas";

function hashPin(pin: string) {
  return createHash("sha256").update(pin).digest("hex");
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const validation = confirmDeliverySchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: validation.error.flatten(),
      },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  // The rider supplies the plain 6-digit PIN.
  // Never send the plain PIN to PostgreSQL.
  const tokenHash = hashPin(validation.data.token);

  // PostgreSQL remains the final authority on:
  // - authenticated rider
  // - assigned rider
  // - PICKED_UP state
  // - token validity
  // - one-time use
  // - DELIVERED transition
  const { data, error } = await supabase.rpc(
    "confirm_delivery",
    {
      p_delivery_id: validation.data.delivery_id,
      p_token_hash: tokenHash,
    },
  );

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 409 },
    );
  }

  return NextResponse.json({ data });
}