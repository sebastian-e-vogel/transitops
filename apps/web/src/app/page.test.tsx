import { cleanup, render } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';

import Home from '@/app/page';

afterEach(cleanup);

test('renders the home page', () => {
  const { container } = render(<Home />);

  expect(container.querySelector('main')).not.toBeNull();
});
