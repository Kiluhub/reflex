import { createClient } from "@/lib/supabase/server";

// Gets the authenticated Supabase user for API requests.
// Every protected API endpoint uses this before touching data.
export async function getAuthenticatedUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}
