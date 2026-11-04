import { filesImage, shopifyVideo, shopifyVideoPoster } from '~/lib/shopifyFiles';

import type { AthleteSigningOverrides } from './types';

export const AMIR_SMITH = {
  transmissionLine: 'Los Angeles → San Francisco · 07.20.2026',
  eyebrowLine: 'Official // Athlete Signing · 07.20.2026',
  headline: { name: 'Amir Smith.' },
  body: 'It’s official. We created this page to welcome you to the 7Pacific Athlete Creator team. You bring a rare mix of passion, \
  personality, and relentless energy. That’s exactly what we want this team to represent. You already train the way we build: with purpose, \
  intensity, and zero shortcuts. Scroll down to watch a personal message from us about why we’re fired up to have you on the team.',
  hero: {
    locationLine: 'Los Angeles · 34.05N',
    image: filesImage('amir-smith-athlete.png', {
      width: 1920,
      height: 1080,
      alt: 'Amir Smith mid-dunk, first session',
    }),
  },
  founderVideo: {
    // Poster: the custom thumbnail set in Shopify admin.
    src: shopifyVideo('4e4b180b71854aeb9ddb8aed88129177', 'HD-720p-4.5Mbps-89659002'),
    poster: shopifyVideoPoster('Screenshot_2026-07-22_at_11.02.10_PM.png'),
    duration: '00:39',
  },
  readout: {
    stat: { label: 'Max Vertical', value: '44.0"', verified: true },
    scale: { markerPercent: 90, markerLabel: 'Rim +8"' },
    fields: [
      { label: 'League', value: 'Hoopbus' },
      { label: 'Base', value: 'Los Angeles' },
      { label: 'Reach', value: '375K' },
      { label: 'Series Tagline', value: 'How To Be a Professional Athlete' },
    ],
  },
  instagram: {
    handle: 'the.amirsmith',
    tagline: 'Documenting the making of a professional athlete.',
    series: ['How To Be a Professional Athlete'],
  },
} satisfies AthleteSigningOverrides;
