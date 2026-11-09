---
name: web-test-conventions
description: Test conventions for the Next.js web app. Use when writing or changing tests in apps/web.
---

# Web test conventions

Skill format: https://code.claude.com/docs/en/skills

## Stack

- Vitest with the jsdom environment (`apps/web/vitest.config.mts`), plus `@testing-library/react`.
- There is no jest-dom, so `toBeInTheDocument` and `toHaveAttribute` do not exist. Use core
  matchers only, with `getAttribute('href')`, `textContent` and `querySelector`.
- There are no Vitest globals. Import `test`, `expect` and `afterEach` from `vitest`, and always
  call `afterEach(cleanup)` explicitly.

## Rules

- Test a shared component once, covering its full contract. Page tests stay thin and assert only
  page-specific content.
- Prefer table-driven `test.each` for repeated cases.
- Assert real routes and values, not ones echoed back from the array under test.
- Keep tests next to their source as `*.test.tsx`.

## Running

From `apps/web`: `pnpm test` (runs `vitest run`). Also run `pnpm lint` and `pnpm format:check`.

## Examples

`src/components/page-placeholder.test.tsx`, a shared component tested once:

```tsx
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
```

`src/app/(app)/pages.test.tsx`, thin table-driven page tests (shortened):

```tsx
import { cleanup, render } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';

import LiveMapPage from '@/app/(app)/page';
import IncidentsPage from '@/app/(app)/incidents/page';

afterEach(cleanup);

const PAGES = [
  { Page: LiveMapPage, heading: 'Live Map' },
  { Page: IncidentsPage, heading: 'Incident Center' },
];

test.each(PAGES)('$heading page renders its heading', ({ Page, heading }) => {
  const { container } = render(<Page />);

  expect(container.querySelector('h1')?.textContent).toBe(heading);
});
```
