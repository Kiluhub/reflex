import { login } from "@/lib/auth/actions";

export default function LoginPage() {
  return (
    <main className="login-page">
      <div className="login-shell">
        {/* Brand */}
        <div className="login-brand">
          <div className="brand-mark">
            <span>R</span>
          </div>

          <div className="brand-name">
            <span>REFLEX</span>
            <small>DELIVERY OPERATIONS</small>
          </div>
        </div>

        {/* Login card */}
        <section className="login-card">
          <div className="login-heading">
            <p className="eyebrow">OPERATIONAL ACCESS</p>

            <h1>Welcome back</h1>

            <p>
              Sign in to access your Reflex delivery workspace.
            </p>
          </div>

          <form action={login} className="login-form">
            <label>
              <span>Email address</span>

              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label>
              <span>Password</span>

              <input
                name="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </label>

            <button type="submit">
              <span>Sign in</span>
              <span className="button-arrow">→</span>
            </button>
          </form>

          <div className="login-footer">
            <div className="secure-status">
              <span className="status-dot" />
              <span>Secure operational access</span>
            </div>

            <span className="footer-divider" />

            <span>REFLEX</span>
          </div>
        </section>

        {/* Bottom information */}
        <div className="login-bottom">
          <p>Reflex Delivery Operations</p>

          <div className="login-meta">
            <span>RETAIL</span>
            <span>DISPATCH</span>
            <span>DELIVERY</span>
          </div>
        </div>
      </div>
    </main>
  );
}