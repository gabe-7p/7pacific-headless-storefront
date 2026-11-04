import { filesImage, shopifyVideo, shopifyVideoPoster } from '~/lib/shopifyFiles';

import type { AthleteSigningOverrides } from './types';

/**
 * Josh Wyche — D1 guard at VCU (Atlantic 10), previously Lafayette; documents
 * life as a D1 athlete on IG (@joshwyche1): "Do Hard Things Friday" and
 * "Recovery Sunday" training series. Base: Richmond, VA.
 */
export const JOSH_WYCHE = {
  transmissionLine: 'Richmond → San Francisco · 07.20.2026',
  eyebrowLine: 'Official // Athlete Signing · 07.20.2026',
  headline: { name: 'Josh Wyche.' },
  body: 'It’s official. We made this page to welcome you to the 7Pacific Athlete Creator team. You bring the kind \
   of energy people notice. There’s real passion behind everything you do, and that’s exactly what we want this team to represent. \
    Between Do Hard Things Friday and Recovery Sunday, you already train the way we build. Consistently, intentionally, and always willing \
    to put in the work. Scroll down for a personal message from us about why we’re so excited to have you on the team.',
  hero: {
    locationLine: 'Richmond · 37.54N',
    image: filesImage('josh-wyche-athlete.png', {
      width: 1920,
      height: 1080,
      alt: 'Josh Wyche on the court',
    }),
  },
  founderVideo: {
    // Poster: the custom thumbnail set in Shopify admin.
    src: shopifyVideo('b01389f236234449b4e379bb39620772', 'HD-720p-4.5Mbps-89659216'),
    poster: shopifyVideoPoster(
      'Screenshot_2026-07-22_at_11.02.10_PM_0f4117ad-5577-48b3-8fee-1c8c77662097.png'
    ),
    duration: '00:40',
  },
  readout: {
    stat: { label: 'Division', value: 'D1', verified: true },
    scale: { markerPercent: 85, markerLabel: 'A-10' },
    fields: [
      { label: 'Program', value: 'VCU Hoops' },
      { label: 'Base', value: 'Richmond' },
      { label: 'Reach', value: '4.1K' },
      { label: 'Series Tagline', value: 'Recovery Sundays + Do Hard Things Fridays' },
    ],
  },
  instagram: {
    handle: 'joshwyche1',
    tagline: 'Documenting life as a D1 athlete.',
    series: ['Do Hard Things Friday', 'Recovery Sunday', 'A Day in the Life at VCU'],
  },
} satisfies AthleteSigningOverrides;
