import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';

import LoginPage from '@/app/page';

afterEach(cleanup);

test('shows the app name and a guest link to the Live Map', () => {
  const { container } = render(<LoginPage />);

  expect(container.querySelector('h1')?.textContent).toBe('TransitOps');
  expect(
    screen
      .getByRole('link', { name: 'Continue as guest' })
      .getAttribute('href'),
  ).toBe('/map');
  expect(container.querySelector('a button')).toBeNull();
});

test.each([
  { label: 'Email', type: 'email', autoComplete: 'email' },
  { label: 'Password', type: 'password', autoComplete: 'current-password' },
])('$label input is a required $type field', (field) => {
  render(<LoginPage />);
  const input = screen.getByLabelText(field.label) as HTMLInputElement;

  expect(input.type).toBe(field.type);
  expect(input.getAttribute('autocomplete')).toBe(field.autoComplete);
  expect(input.required).toBe(true);
});

test('the Log in button is disabled and the form has no action', () => {
  const { container } = render(<LoginPage />);
  const button = screen.getByRole('button', {
    name: 'Log in',
  }) as HTMLButtonElement;
  const form = container.querySelector('form') as HTMLFormElement;
  const hint = container.querySelector('#sign-in-hint');

  expect(button.type).toBe('submit');
  expect(button.disabled).toBe(true);
  expect(form.hasAttribute('action')).toBe(false);
  expect(hint?.textContent).toBe('Sign-in is coming soon.');
  expect(form.getAttribute('aria-describedby')).toBe('sign-in-hint');
  expect(button.getAttribute('aria-describedby')).toBe('sign-in-hint');
});
