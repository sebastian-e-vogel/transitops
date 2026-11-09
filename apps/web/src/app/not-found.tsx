import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="text-muted">The page you are looking for does not exist.</p>
      <Link
        href="/map"
        className="border border-border px-3 py-1 text-primary-text underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-text"
      >
        Go to the Live Map
      </Link>
    </main>
  );
}
