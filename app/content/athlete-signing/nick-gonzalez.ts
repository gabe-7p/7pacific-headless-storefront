import { shopifyImage, shopifyVideo, shopifyVideoPoster } from '~/lib/shopifyFiles';

import type { AthleteSigningContent } from './types';

/**
 * Nick Gonzalez — Miami-based athlete (@nickg_14): triathlon + strength
 * (first Charleston Triathlon, July 2026; Coastal Athletic Club), faith-led.
 * Owner of Almavora (@almavora_) — strength programs from elite college
 * coaches, built for athletes chasing college sports. ~4.2K followers.
 */
export const NICK_GONZALEZ = {
  chrome: {
    badge: 'Official // Athlete Signing',
    privacy: 'Private',
    edition: '001/001',
    urlLine: '7pacificapparel.com/athletes/nick-gonzalez',
    designedLine: 'Designed in San Francisco',
    existsLine: 'Exists only at /athletes/nick-gonzalez',
  },
  transmissionLine: 'Miami → San Francisco · 10.08.2026',
  eyebrowLine: 'Official // Athlete Signing · 10.08.2026',
  headline: { lead: 'Welcome to the team,', name: 'Nick Gonzalez.' },
  body: 'We created this page to welcome you to the 7Pacific Athlete Creator team. You’re an athlete first: the heavy \
  loads, the long miles, your first triathlon finish line already crossed. Then you built Almavora to hand that same \
  next-level training to athletes chasing college sports. Faith, discipline, and no shortcuts is exactly who we’re \
  building for: the athletes. Scroll down to watch a personal message from us about why we’re fired up to have you on \
  the team.',
  signedLine: 'Signed · Status: Confirmed',
  hero: {
    modeLabel: 'Mode 01 · Action',
    locationLine: 'Miami · 25.76N',
    camLine: '',
    shotLine: 'Shot.01 — First Session',
    image: {
      src: shopifyImage('nick_gonzalez_athlete_picture.png'),
      alt: 'Nick Gonzalez mid-training session',
      width: 1122,
      height: 1402,
      // Full-figure shot — cover-cropping cuts his head and feet off.
      fit: 'contain',
    },
  },
  founderVideo: {
    number: '01',
    title: 'A Personal Message from the Founder',
    // Nick's founder message in Shopify Files (portrait, 32s) — Shopify's
    // 720p transcode; poster is Shopify's auto-generated preview (no custom
    // thumbnail set for this video yet).
    src: shopifyVideo('d28bb7a756df42b3a46ea28c7ea9b7e9', 'HD-720p-1.6Mbps-96972241'),
    poster: shopifyVideoPoster('d28bb7a756df42b3a46ea28c7ea9b7e9.thumbnail.0000000000.jpg'),
    captions: '',
    attribution: 'Gabriel · Founder',
    duration: '00:32',
  },
  readout: {
    number: '02',
    title: 'Performance Readout',
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
    number: '03',
    title: 'The Creator',
    handle: 'nickg_14',
    tagline: 'Athlete. Follower of Jesus. Owner of Almavora.',
    series: ['Almavora · College Strength Training', 'Coastal Athletic Club'],
    linkLabel: 'Open Instagram',
  },
} satisfies AthleteSigningContent;
