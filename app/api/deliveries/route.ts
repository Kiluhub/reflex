import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth/api";
import { createDeliverySchema } from "@/lib/validation/schemas";

export async function GET() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  const supabase = await createClient();

  // RLS determines which deliveries this user is allowed to see.
  // We deliberately do not duplicate visibility rules in the API.
  const { data, error } = await supabase
    .from("deliveries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "Failed to load deliveries" },
      { status: 500 },
    );
  }

  return NextResponse.json({ data });
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

  const validation = createDeliverySchema.safeParse(body);

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

  // retailer_id comes from the authenticated session,
  // never from the browser request body.
  const { data, error } = await supabase
    .from("deliveries")
    .insert({
      retailer_id: user.id,
      customer_name: validation.data.customer_name,
      customer_phone: validation.data.customer_phone,
      address: validation.data.address,
      item_description: validation.data.item_description,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Failed to create delivery" },
      { status: 400 },
    );
  }

  return NextResponse.json({ data }, { status: 201 });
}
