import { cleanup, render } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';

import LiveMapPage from '@/app/(app)/page';
import IncidentsPage from '@/app/(app)/incidents/page';
import MetricsPage from '@/app/(app)/metrics/page';
import ReplayPage from '@/app/(app)/replay/page';
import SimulationPage from '@/app/(app)/simulation/page';
import SystemPage from '@/app/(app)/system/page';

afterEach(cleanup);

const PAGES = [
  { Page: LiveMapPage, heading: 'Live Map' },
  { Page: IncidentsPage, heading: 'Incident Center' },
  { Page: ReplayPage, heading: 'Replay' },
  { Page: SimulationPage, heading: 'Simulation' },
  { Page: MetricsPage, heading: 'Metrics' },
  { Page: SystemPage, heading: 'System Health' },
];

test.each(PAGES)('$heading page renders its heading', ({ Page, heading }) => {
  const { container } = render(<Page />);

  expect(container.querySelector('h1')?.textContent).toBe(heading);
});
