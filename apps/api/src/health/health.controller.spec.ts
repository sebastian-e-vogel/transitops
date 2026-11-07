import { HealthController } from './health.controller.js';

describe('HealthController', () => {
  it('reports status ok', () => {
    expect(new HealthController().check()).toEqual({ status: 'ok' });
  });
});
