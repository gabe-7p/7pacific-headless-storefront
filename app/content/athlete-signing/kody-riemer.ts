import { shopifyImage, shopifyVideo, shopifyVideoPoster } from '~/lib/shopifyFiles';

import type { AthleteSigningContent } from './types';

/**
 * Dakotah Riemer — Menasha, WI (Fox Cities) football-built strength and
 * mindset creator (@kodyriemer, "Fitness | Motivation | Mindset"): two-time
 * All-Conference college football player; "Dare to be great." ~14K followers.
 */
export const DAKOTAH_RIEMER = {
  chrome: {
    badge: 'Official // Athlete Signing',
    privacy: 'Private',
    edition: '001/001',
    urlLine: '7pacificapparel.com/athletes/kody-riemer',
    designedLine: 'Designed in San Francisco',
    existsLine: 'Exists only at /athletes/kody-riemer',
  },
  transmissionLine: 'Menasha → San Francisco · 10.08.2026',
  eyebrowLine: 'Official // Athlete Signing · 10.08.2026',
  headline: { lead: 'Welcome to the team,', name: 'Dakotah Riemer.' },
  body: 'We created this page to welcome you to the 7Pacific Athlete Creator team. Two-time All-Conference on the football \
  field, and you kept the standard when the season ended: the sprints, the mountain leg days, the mindset you put in front \
  of 14K people every day. Vacation changes the location, not the standard, and that’s exactly who we’re building for: \
  the athletes. Scroll down to watch a personal message from us about why we’re fired up to have you on the team.',
  signedLine: 'Signed · Status: Confirmed',
  hero: {
    modeLabel: 'Mode 01 · Action',
    locationLine: 'Menasha · 44.20N',
    camLine: '',
    shotLine: 'Shot.01 — First Session',
    image: {
      src: shopifyImage('kody_riemer_athlete_picture.png'),
      alt: 'Dakotah Riemer mid-training session',
      width: 1122,
      height: 1402,
      // Full-figure shot — cover-cropping cuts his head and feet off.
      fit: 'contain',
    },
  },
  founderVideo: {
    number: '01',
    title: 'A Personal Message from the Founder',
    // Poster: Shopify's auto-generated preview (no custom thumbnail yet).
    src: shopifyVideo('8c133fee98e7483cab2d4aebb6758c83', 'HD-720p-1.6Mbps-96972281'),
    poster: shopifyVideoPoster('8c133fee98e7483cab2d4aebb6758c83.thumbnail.0000000000.jpg'),
    captions: '',
    attribution: 'Gabriel · Founder',
    duration: '00:35',
  },
  readout: {
    number: '02',
    title: 'Performance Readout',
    stat: { label: 'All-Conference', value: 'X2', verified: true },
    scale: { markerPercent: 85, markerLabel: 'College FB' },
    fields: [
      { label: 'Discipline', value: 'Football x Strength' },
      { label: 'Base', value: 'Menasha' },
      { label: 'Reach', value: '14K' },
      { label: 'Creed', value: 'Dare to Be Great' },
    ],
  },
  instagram: {
    number: '03',
    title: 'The Creator',
    handle: 'kodyriemer',
    tagline: 'Fitness | Motivation | Mindset. Dare to be great.',
    series: ['Fitness · Motivation · Mindset', 'Vacation Changes the Location, Not the Standard'],
    linkLabel: 'Open Instagram',
  },
} satisfies AthleteSigningContent;
