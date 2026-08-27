import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth/api";
import { assignDeliverySchema } from "@/lib/validation/schemas";

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

  const validation = assignDeliverySchema.safeParse(body);

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

  // The PostgreSQL function performs the real authorization,
  // row locking, assignment, status change and audit logging.
  const { data, error } = await supabase.rpc("assign_delivery", {
    p_delivery_id: validation.data.delivery_id,
    p_rider_id: validation.data.rider_id,
  });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 409 },
    );
  }

  return NextResponse.json({ data }, { status: 201 });
}
