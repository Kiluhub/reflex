import { logout } from "@/lib/auth/actions";

export function AppHeader({ role }: { role: string }) {
  return (
    <header>
      {/* Shared identity/navigation area used by every operational panel. */}
      <strong>Reflex</strong>
      <span>{role}</span>

      {/* Server Action securely destroys the Supabase session. */}
      <form action={logout}>
        <button type="submit">Sign out</button>
      </form>
    </header>
  );
}
