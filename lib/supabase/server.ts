import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Creates the Supabase client for Server Components and Server Actions.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        // Read the current Supabase authentication cookies.
        getAll() {
          return cookieStore.getAll();
        },

        // Allow Supabase to refresh authentication cookies when necessary.
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Components may not always be able to modify cookies.
          }
        },
      },
    },
  );
}
