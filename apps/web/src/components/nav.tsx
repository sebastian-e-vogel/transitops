import Link from 'next/link';

export const NAV_LINKS = [
  { href: '/', label: 'Live Map' },
  { href: '/incidents', label: 'Incidents' },
  { href: '/replay', label: 'Replay' },
  { href: '/simulation', label: 'Simulation' },
  { href: '/metrics', label: 'Metrics' },
  { href: '/system', label: 'System' },
] as const;

const LINK_CLASS =
  'rounded px-2 py-1 text-sm font-medium text-primary-text underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-text';

export function Nav() {
  return (
    <nav aria-label="Main" className="flex gap-4 border-b border-border p-2">
      {NAV_LINKS.map(({ href, label }) => (
        <Link key={href} href={href} className={LINK_CLASS}>
          {label}
        </Link>
      ))}
    </nav>
  );
}
