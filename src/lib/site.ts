/**
 * Where this app is published. Set at build time:
 *   VITE_SITE_URL  absolute origin + path, e.g. https://axles.example.com
 * Leave it unset for local development; links then fall back to relative.
 */
const rawSiteUrl: unknown = import.meta.env.VITE_SITE_URL;
export const SITE_URL = typeof rawSiteUrl === 'string' ? rawSiteUrl.replace(/\/$/, '') : '';

export const REPO_URL = 'https://github.com/charleskh/axle-clearance';

/** Prefilled GitHub issue for reporting a measurement on one axle. Pull-based: nothing is sent unless the visitor submits it. */
export function measurementIssueUrl(axleName: string, axleId: string): string {
  const body = [
    `Axle: ${axleName}`,
    `Axle id: ${axleId}`,
    '',
    'Measurement (inches):',
    '- Axle centerline to lowest point of the housing:',
    '- Other dimension, if any (name and value):',
    '',
    'How it was measured (tools, loaded or on stands, photo links):',
    '',
    'Vehicle and year:',
    ''
  ].join('\n');
  const params = new URLSearchParams({
    title: `Measurement: ${axleName}`,
    body,
    labels: 'measurement'
  });
  // %20 rather than +: unambiguous for any consumer of the query string.
  return `${REPO_URL}/issues/new?${params.toString().replace(/\+/g, '%20')}`;
}
