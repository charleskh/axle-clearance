import { describe, expect, it } from 'vitest';
import { measurementIssueUrl } from './site';

describe('measurementIssueUrl', () => {
  it('opens a prefilled issue on the public repo', () => {
    const url = new URL(measurementIssueUrl('Jeep JK Rubicon Dana 44 front', 'jeep-jk'));
    expect(url.origin + url.pathname).toBe(
      'https://github.com/charleskh/axle-clearance/issues/new'
    );
    expect(url.searchParams.get('title')).toBe('Measurement: Jeep JK Rubicon Dana 44 front');
    expect(url.searchParams.get('body')).toContain('Axle id: jeep-jk');
    expect(url.searchParams.get('labels')).toBe('measurement');
  });
});
