import { filesImage, shopifyVideo, shopifyVideoPoster } from '~/lib/shopifyFiles';

import type { AthleteSigningOverrides } from './types';

/**
 * Nick Gonzalez — Miami-based athlete (@nickg_14): triathlon + strength
 * (first Charleston Triathlon, July 2026; Coastal Athletic Club), faith-led.
 * Owner of Almavora (@almavora_) — strength programs from elite college
 * coaches, built for athletes chasing college sports. ~4.2K followers.
 */
export const NICK_GONZALEZ = {
  transmissionLine: 'Miami → San Francisco · 10.08.2026',
  eyebrowLine: 'Official // Athlete Signing · 10.08.2026',
  headline: { name: 'Nick Gonzalez.' },
  body: 'We created this page to welcome you to the 7Pacific Athlete Creator team. You’re an athlete first: the heavy \
  loads, the long miles, your first triathlon finish line already crossed. Then you built Almavora to hand that same \
  next-level training to athletes chasing college sports. Faith, discipline, and no shortcuts is exactly who we’re \
  building for: the athletes. Scroll down to watch a personal message from us about why we’re fired up to have you on \
  the team.',
  hero: {
    locationLine: 'Miami · 25.76N',
    image: {
      ...filesImage('nick_gonzalez_athlete_picture.png', {
        width: 1122,
        height: 1402,
        alt: 'Nick Gonzalez mid-training session',
      }),
      // Full-figure shot — cover-cropping cuts his head and feet off.
      fit: 'contain',
    },
  },
  founderVideo: {
    // Poster: Shopify's auto-generated preview (no custom thumbnail yet).
    src: shopifyVideo('d28bb7a756df42b3a46ea28c7ea9b7e9', 'HD-720p-1.6Mbps-96972241'),
    poster: shopifyVideoPoster('d28bb7a756df42b3a46ea28c7ea9b7e9.thumbnail.0000000000.jpg'),
    duration: '00:32',
  },
  readout: {
    // His first triathlon (Charleston, July 2026) — a public race finish.
    stat: { label: 'Triathlons Finished', value: '01', verified: true },
    scale: { markerPercent: 80, markerLabel: 'Charleston' },
    fields: [
      { label: 'Discipline', value: 'Triathlon x Strength' },
      { label: 'Base', value: 'Miami' },
      { label: 'Reach', value: '4.2K' },
      { label: 'Owner', value: 'Almavora' },
    ],
  },
  instagram: {
    handle: 'nickg_14',
    tagline: 'Athlete. Follower of Jesus. Owner of Almavora.',
    series: ['Almavora · College Strength Training', 'Coastal Athletic Club'],
  },
} satisfies AthleteSigningOverrides;
