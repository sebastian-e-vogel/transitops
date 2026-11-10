import { cleanup, render } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';

import { Nav } from '@/components/nav';

afterEach(cleanup);

test('renders one nav link per route', () => {
  const { container } = render(<Nav />);
  const hrefs = Array.from(container.querySelectorAll('a')).map((a) =>
    a.getAttribute('href'),
  );

  expect(hrefs).toEqual([
    '/map',
    '/incidents',
    '/replay',
    '/simulation',
    '/metrics',
    '/system',
  ]);
});
