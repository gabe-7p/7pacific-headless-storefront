import { filesImage, shopifyVideo, shopifyVideoPoster } from '~/lib/shopifyFiles';

import type { AthleteSigningOverrides } from './types';

/**
 * Aaron Lee — Seattle-based training creator (@rocklee.fit, "My wellness
 * diary"): former D1 athlete at Oregon (football), now documenting the daily
 * work and teaching athletes to train like athletes ("Train Like an Athlete"
 * workout breakdowns). ~28.5K on TikTok (@rocklee.fit).
 */
export const AARON_LEE = {
  transmissionLine: 'Seattle → San Francisco · 09.08.2026',
  eyebrowLine: 'Official // Athlete Signing · 09.08.2026',
  headline: { name: 'Aaron Lee.' },
  body: 'We created this page to welcome you to the 7Pacific Athlete Creator team. You built your foundation the D1 way \
  like Oregon does it. Instead of leaving it there, you turned that knowledge and discipline into the lifts, the recovery, \
  and the standards that your following loves. You’re showing people how to train like an athlete, and that’s exactly who \
  we’re building for: the athletes. Scroll down to watch a personal message from us about why we’re fired up to have you \
  on the team.',
  hero: {
    locationLine: 'Seattle · 47.61N',
    image: {
      ...filesImage('aaron_lee_athlete_creator_avatar.png', {
        width: 1024,
        height: 1536,
        alt: 'Aaron Lee mid-training session',
      }),
      // Full-figure shot — cover-cropping cuts his hands and feet off.
      fit: 'contain',
    },
  },
  founderVideo: {
    // Poster: the custom thumbnail set in Shopify admin.
    src: shopifyVideo('8d5feed0d0594eecbb7aede436dde043', 'HD-720p-3.0Mbps-93935029'),
    poster: shopifyVideoPoster('Screenshot_2026-09-09_at_2.28.15_PM.png'),
    duration: '00:22',
  },
  readout: {
    stat: { label: 'Foundation', value: 'D1', verified: true },
    scale: { markerPercent: 85, markerLabel: 'Oregon FB' },
    fields: [
      { label: 'Discipline', value: 'Athletic Training' },
      { label: 'Base', value: 'Seattle' },
      // His audience lives on TikTok (@rocklee.fit) — IG is the smaller channel.
      { label: 'Reach', value: '28.5K' },
      { label: 'Series Tagline', value: 'POV: You Train Like An Athlete' },
    ],
  },
  instagram: {
    handle: 'rocklee.fit',
    tagline: 'My wellness diary. Former D1 athlete.',
    series: ['Train Like an Athlete', 'My Gym Diary'],
  },
} satisfies AthleteSigningOverrides;
