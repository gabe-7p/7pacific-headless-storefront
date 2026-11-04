import { describe, expect, it } from 'vitest';

import { BRAND } from '~/content/brand';

import { ATHLETE_SIGNINGS, getAthleteSigning } from './index';

describe('ATHLETE_SIGNINGS', () => {
  it.each(Object.entries(ATHLETE_SIGNINGS))(
    '%s derives its URL lines from its key',
    (handle, c) => {
      expect(c.chrome.urlLine).toBe(`${BRAND.siteUrl.replace('https://', '')}/athletes/${handle}`);
      expect(c.chrome.existsLine).toBe(`Exists only at /athletes/${handle}`);
      expect(c.chrome.designedLine).toBe(BRAND.provenance);
    }
  );

  it('merges the shared chrome under each athlete', () => {
    const c = getAthleteSigning('aaron-lee');
    expect(c?.headline).toEqual({ lead: 'Welcome to the team,', name: 'Aaron Lee.' });
    expect(c?.founderVideo.captions).toBe('');
    expect(c?.instagram.linkLabel).toBe('Open Instagram');
  });

  it('returns null for an unknown handle', () => {
    expect(getAthleteSigning('nobody')).toBeNull();
  });
});
