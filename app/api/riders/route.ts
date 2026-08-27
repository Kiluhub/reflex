import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth/api";

export async function GET() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  const supabase = await createClient();

  // Only dispatcher accounts should retrieve the operational rider list.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "dispatcher") {
    return NextResponse.json(
      { error: "Dispatcher access required" },
      { status: 403 },
    );
  }

  // Return only accounts whose role is rider.
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("role", "rider")
    .order("full_name");

  if (error) {
    return NextResponse.json(
      { error: "Failed to load riders" },
      { status: 500 },
    );
  }

  return NextResponse.json({ data });
}
