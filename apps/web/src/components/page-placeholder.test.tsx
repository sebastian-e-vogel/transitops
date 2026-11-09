import { cleanup, render } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';

import { PagePlaceholder } from '@/components/page-placeholder';

afterEach(cleanup);

test('renders the heading and description without its own main', () => {
  const { container } = render(
    <PagePlaceholder title="Some Title" description="Some description." />,
  );

  expect(container.querySelector('h1')?.textContent).toBe('Some Title');
  expect(container.querySelector('p')?.textContent).toBe('Some description.');
  expect(container.querySelector('main')).toBeNull();
});
