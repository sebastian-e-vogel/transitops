import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col gap-4 rounded border border-border bg-surface p-4">
        <h1 className="text-2xl font-bold">TransitOps</h1>
        <form aria-describedby="sign-in-hint" className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="rounded border border-muted bg-bg px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-text"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="rounded border border-muted bg-bg px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-text"
            />
          </div>
          <p id="sign-in-hint" className="text-muted">
            Sign-in is coming soon.
          </p>
          <button
            type="submit"
            disabled
            aria-describedby="sign-in-hint"
            className="rounded border border-muted px-4 py-2 text-muted"
          >
            Log in
          </button>
        </form>
        <Link
          href="/map"
          className="rounded bg-primary px-4 py-2 text-center text-primary-fg hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-text"
        >
          Continue as guest
        </Link>
      </div>
    </main>
  );
}
