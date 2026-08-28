import { login } from "@/lib/auth/actions";

export default function LoginPage() {
  return (
    <main className="login-page">
      <div className="login-brand">
        <div className="brand-mark">R</div>
        <span>REFLEX</span>
      </div>

      <div className="login-card">
        <div className="login-heading">
          <p className="eyebrow">DELIVERY OPERATIONS</p>
          <h1>Welcome back</h1>
          <p>Sign in to access your Reflex workspace.</p>
        </div>

        <form action={login} className="login-form">
          <label>
            Email
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </label>

          <button type="submit">Sign in to Reflex</button>
        </form>

        <div className="login-footer">
          <span className="status-dot" />
          Secure operational access
        </div>
      </div>

      <p className="copyright">
        Reflex Delivery Operations
      </p>
    </main>
  );
}