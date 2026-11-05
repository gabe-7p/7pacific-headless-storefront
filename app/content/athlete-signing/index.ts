/**
 * Athlete-signing page content — one-off commemorative pages served by the
 * dynamic route /athletes/<handle> (routes/athletes.$handle.tsx). A new
 * signing is a new `AthleteSigningOverrides` object in its own file (named
 * after the URL handle — only what differs from `SIGNING_DEFAULTS`) plus one
 * `defineSigning` line in the `ATHLETE_SIGNINGS` registry below — no new
 * routes or components.
 */

import { BRAND } from '~/content/brand';
import { athleteUrl } from '~/lib/urls';

import { AARON_LEE } from './aaron-lee';
import { AMIR_SMITH } from './amir-smith';
import { JOSH_WYCHE } from './josh-wyche';
import { KENNETH_PIERCE } from './kenneth-pierce';
import { DAKOTAH_RIEMER } from './kody-riemer';
import { NICK_GONZALEZ } from './nick-gonzalez';
import { OWEN_PLATT } from './owen-platt';
import type { AthleteSigningContent, AthleteSigningOverrides } from './types';

export type { AthleteSigningContent, ScaleMarkerPercent } from './types';

/** The chrome, section titles and labels every signing page shares. */
const SIGNING_DEFAULTS = {
  chrome: {
    badge: 'Official // Athlete Signing',
    privacy: 'Private',
    edition: '001/001',
    designedLine: BRAND.provenance,
  },
  headlineLead: 'Welcome to the team,',
  signedLine: 'Signed · Status: Confirmed',
  hero: {
    modeLabel: 'Mode 01 · Action',
    shotLine: 'Shot.01 — First Session',
    // Not uploaded yet for any signing; the hero omits the cam readout while it is ''.
    camLine: '',
  },
  founderVideo: {
    number: '01',
    title: 'A Personal Message from the Founder',
    attribution: 'Gabriel · Founder',
    // WebVTT captions URL; '' = none uploaded yet.
    captions: '',
  },
  readout: { number: '02', title: 'Performance Readout' },
  instagram: { number: '03', title: 'The Creator', linkLabel: 'Open Instagram' },
} as const;

const SITE_DOMAIN = BRAND.siteUrl.replace(/^https?:\/\//, '');

/**
 * Builds a full signing page from its URL `handle` and the athlete's own
 * overrides. The two URL lines derive from the handle, so they cannot drift
 * from the registry key.
 */
const defineSigning = (
  handle: string,
  overrides: AthleteSigningOverrides
): AthleteSigningContent => ({
  ...overrides,
  chrome: {
    ...SIGNING_DEFAULTS.chrome,
    urlLine: `${SITE_DOMAIN}${athleteUrl(handle)}`,
    existsLine: `Exists only at ${athleteUrl(handle)}`,
  },
  headline: { lead: SIGNING_DEFAULTS.headlineLead, ...overrides.headline },
  signedLine: SIGNING_DEFAULTS.signedLine,
  hero: { ...SIGNING_DEFAULTS.hero, ...overrides.hero },
  founderVideo: { ...SIGNING_DEFAULTS.founderVideo, ...overrides.founderVideo },
  readout: { ...SIGNING_DEFAULTS.readout, ...overrides.readout },
  instagram: { ...SIGNING_DEFAULTS.instagram, ...overrides.instagram },
});

/** URL handle → signing page content. Adding an athlete = one line here. */
export const ATHLETE_SIGNINGS: Record<string, AthleteSigningContent> = {
  'amir-smith': defineSigning('amir-smith', AMIR_SMITH),
  'josh-wyche': defineSigning('josh-wyche', JOSH_WYCHE),
  'kenneth-pierce': defineSigning('kenneth-pierce', KENNETH_PIERCE),
  'owen-platt': defineSigning('owen-platt', OWEN_PLATT),
  'aaron-lee': defineSigning('aaron-lee', AARON_LEE),
  'nick-gonzalez': defineSigning('nick-gonzalez', NICK_GONZALEZ),
  'kody-riemer': defineSigning('kody-riemer', DAKOTAH_RIEMER),
};

/** Returns null for unknown handles — the route turns that into a 404. */
export const getAthleteSigning = (handle: string | undefined) =>
  (handle && ATHLETE_SIGNINGS[handle]) || null;
