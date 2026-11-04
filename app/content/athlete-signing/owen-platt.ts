import { filesImage, shopifyVideo, shopifyVideoPoster } from '~/lib/shopifyFiles';

import type { AthleteSigningOverrides } from './types';

/**
 * Owen Platt — basketball defense-training creator (@defensewithowen,
 * "defensewithowen™"): lockdown-defender drills, the 30-Second Lockdown
 * Test, "how to work out without a trainer." Base: Indianapolis, ~11.2K
 * followers.
 */
export const OWEN_PLATT = {
  transmissionLine: 'Indianapolis → San Francisco · 08.06.2026',
  eyebrowLine: 'Official // Athlete Signing · 08.06.2026',
  headline: { name: 'Owen Platt.' },
  body: "It’s official. We created this page to welcome you to the 7Pacific Athlete Creator team. You made defense the whole \
  story: the footwork, the speed drills, all the technique that wins possessions, and now, you're teaching players to put in that work \
  to elevate their game. What you're doing is the foundation for our brand as well. Scroll down to watch a personal message from us about why we’re fired \
  up to have you on the team.",
  hero: {
    locationLine: 'Indianapolis · 39.77N',
    image: filesImage('owen-platt-athlete.png', {
      width: 776,
      height: 773,
      alt: 'Owen Platt in a defensive stance',
    }),
  },
  founderVideo: {
    // Poster: the custom thumbnail set in Shopify admin.
    src: shopifyVideo('4e59f563e64348948ba8e23ccbdddd1e', 'HD-720p-4.5Mbps-91367435'),
    poster: shopifyVideoPoster('Screenshot_2026-08-11_at_5.17.33_PM.png'),
    duration: '00:28',
  },
  readout: {
    // His signature drill, not a measured PR — so no VERIFIED tag.
    stat: { label: 'The Lockdown Challenge', value: '0:30', verified: false },
    scale: { markerPercent: 90, markerLabel: 'Lockdown' },
    fields: [
      { label: 'Specialty', value: 'Lockdown Defense' },
      { label: 'Base', value: 'Indianapolis' },
      { label: 'Reach', value: '11.2K' },
      { label: 'Series Tagline', value: 'How to Work Out Without a Trainer' },
    ],
  },
  instagram: {
    handle: 'defensewithowen',
    tagline: 'How to work out without a trainer.',
    series: ['The 30-Second Lockdown Test', 'Lockdown Defender Drills'],
  },
} satisfies AthleteSigningOverrides;
