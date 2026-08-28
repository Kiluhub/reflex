import { NextResponse } from "next/server";
import { createHash, randomInt } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth/api";
import { createDeliverySchema } from "@/lib/validation/schemas";
import { sendDeliveryPin } from "@/lib/email/sendDeliveryPin";

function hashPin(pin: string) {
  return createHash("sha256").update(pin).digest("hex");
}

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
    console.error(
      "DELIVERY VALIDATION ERROR:",
      validation.error.flatten(),
    );

    return NextResponse.json(
      {
        error: "Validation failed",
        details: validation.error.flatten(),
      },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  // Generate a fresh 6-digit delivery verification PIN.
  const pin = randomInt(100000, 1000000).toString();

  // Never store the plain PIN.
  const tokenHash = hashPin(pin);

  // retailer_id comes from the authenticated session,
  // never from the browser request body.
  const { data, error } = await supabase
    .from("deliveries")
    .insert({
      retailer_id: user.id,
      customer_name: validation.data.customer_name,
      customer_phone: validation.data.customer_phone,
      customer_email: validation.data.customer_email,
      delivery_address: validation.data.address,
      item_description: validation.data.item_description,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    console.error("CREATE DELIVERY ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create delivery" },
      { status: 400 },
    );
  }

  // Store only the hash of the PIN.
  const { error: confirmationError } = await supabase
    .from("delivery_confirmations")
    .insert({
      delivery_id: data.id,
      token_hash: tokenHash,
    });

  if (confirmationError) {
    console.error(
      "CREATE CONFIRMATION ERROR:",
      confirmationError,
    );

    // Remove the delivery if its verification record could not
    // be created. delivery_confirmations cascades on delete.
    await supabase
      .from("deliveries")
      .delete()
      .eq("id", data.id);

    return NextResponse.json(
      { error: "Failed to create delivery verification" },
      { status: 500 },
    );
  }

  // Send the plain PIN only to the customer's email.
  const { error: emailError } = await sendDeliveryPin(
    validation.data.customer_email,
    validation.data.customer_name,
    pin,
  );

  if (emailError) {
    console.error("DELIVERY PIN EMAIL ERROR:", emailError);

    // Do not leave a delivery active if the customer was not
    // successfully sent their verification PIN.
    await supabase
      .from("deliveries")
      .delete()
      .eq("id", data.id);

    return NextResponse.json(
      { error: "Delivery created but verification email could not be sent" },
      { status: 502 },
    );
  }

  return NextResponse.json({ data }, { status: 201 });
}