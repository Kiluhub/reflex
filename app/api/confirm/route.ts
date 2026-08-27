import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth/api";
import { confirmDeliverySchema } from "@/lib/validation/schemas";

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

  // PostgreSQL validates rider ownership, PICKED_UP state,
  // token validity, one-time use and the final DELIVERED update.
  const { data, error } = await supabase.rpc(
    "confirm_delivery",
    {
      p_delivery_id: validation.data.delivery_id,
      p_token_hash: validation.data.token_hash,
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
