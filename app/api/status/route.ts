import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth/api";
import { updateStatusSchema } from "@/lib/validation/schemas";

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

  const validation = updateStatusSchema.safeParse(body);

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

  // PostgreSQL verifies that this user is the assigned rider
  // and that the requested state transition is valid.
  const { data, error } = await supabase.rpc(
    "update_delivery_status",
    {
      p_delivery_id: validation.data.delivery_id,
      p_new_status: validation.data.status,
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
