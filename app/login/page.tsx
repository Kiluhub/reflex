import { login } from "@/lib/auth/actions";

export default function LoginPage() {
  return (
    <main>
      <h1>Reflex</h1>

      <form action={login}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          required
        />

        <button type="submit">
          Sign in
        </button>
      </form>
    </main>
  );
}