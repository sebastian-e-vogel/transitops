import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TransitOps',
  description:
    'Real-time public transit observability: live vehicles, incidents, replay and simulation.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className="scheme-dark">
      <body className="bg-bg text-fg">{children}</body>
    </html>
  );
}
