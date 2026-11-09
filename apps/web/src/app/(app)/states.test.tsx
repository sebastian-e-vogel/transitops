import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import ErrorPage from '@/app/(app)/error';
import Loading from '@/app/(app)/loading';
import NotFound from '@/app/not-found';

afterEach(cleanup);

test('loading fallback renders its text', () => {
  const { container } = render(<Loading />);

  expect(container.textContent).toBe('Loading...');
});

test('error page shows static text and the button calls retry', () => {
  const retry = vi.fn();
  const { container } = render(<ErrorPage retry={retry} />);

  expect(container.querySelector('h1')?.textContent).toBe(
    'Something went wrong',
  );
  fireEvent.click(container.querySelector('button') as HTMLButtonElement);
  expect(retry).toHaveBeenCalledTimes(1);
});

test('not-found page links to the home route', () => {
  const { container } = render(<NotFound />);

  expect(container.querySelector('h1')?.textContent).toBe('Page not found');
  expect(container.querySelector('a')?.getAttribute('href')).toBe('/');
});
