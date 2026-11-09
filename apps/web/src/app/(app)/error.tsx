'use client';

export default function ErrorPage({ retry }: { retry: () => void }) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-muted">
        An unexpected error occurred. Please try again.
      </p>
      <button
        type="button"
        className="mt-4 border border-border px-3 py-1 text-primary-text underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-text"
        onClick={retry}
      >
        Try again
      </button>
    </div>
  );
}
