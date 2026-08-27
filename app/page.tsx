import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  // Get the authenticated user from the server-side session.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // The profile role determines which operational panel the user enters.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role === "dispatcher") {
    redirect("/dispatcher/dashboard");
  }

  if (profile?.role === "rider") {
    redirect("/rider/dashboard");
  }

  // Retailer is the default authenticated operational role.
  redirect("/retailer/dashboard");
}
