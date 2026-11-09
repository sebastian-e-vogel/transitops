import { Nav } from '@/components/nav';

export default function AppLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <Nav />
      <main>{children}</main>
    </>
  );
}
