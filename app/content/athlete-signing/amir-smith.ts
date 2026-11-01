import { shopifyImage, shopifyVideo, shopifyVideoPoster } from '~/lib/shopifyFiles';

import type { AthleteSigningContent } from './types';

export const AMIR_SMITH = {
  chrome: {
    badge: 'Official // Athlete Signing',
    privacy: 'Private',
    edition: '001/001',
    urlLine: '7pacificapparel.com/athletes/amir-smith',
    designedLine: 'Designed in San Francisco',
    existsLine: 'Exists only at /athletes/amir-smith',
  },
  transmissionLine: 'Los Angeles → San Francisco · 07.20.2026',
  eyebrowLine: 'Official // Athlete Signing · 07.20.2026',
  headline: { lead: 'Welcome to the team,', name: 'Amir Smith.' },
  body: 'It’s official. We created this page to welcome you to the 7Pacific Athlete Creator team. You bring a rare mix of passion, \
  personality, and relentless energy. That’s exactly what we want this team to represent. You already train the way we build: with purpose, \
  intensity, and zero shortcuts. Scroll down to watch a personal message from us about why we’re fired up to have you on the team.',
  signedLine: 'Signed · Status: Confirmed',
  hero: {
    modeLabel: 'Mode 01 · Action',
    locationLine: 'Los Angeles · 34.05N',
    camLine: '',
    shotLine: 'Shot.01 — First Session',
    image: {
      src: shopifyImage('amir-smith-athlete.png'),
      alt: 'Amir Smith mid-dunk, first session',
      width: 1920,
      height: 1080,
    },
  },
  founderVideo: {
    number: '01',
    title: 'A Personal Message from the Founder',
    // IMG-0004 in Shopify Files (portrait, 39s) — Shopify's 720p transcode;
    // poster is the custom preview thumbnail set in Shopify admin.
    src: shopifyVideo('4e4b180b71854aeb9ddb8aed88129177', 'HD-720p-4.5Mbps-89659002'),
    poster: shopifyVideoPoster('Screenshot_2026-07-22_at_11.02.10_PM.png'),
    captions: '',
    attribution: 'Gabriel · Founder',
    duration: '00:39',
  },
  readout: {
    number: '02',
    title: 'Performance Readout',
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
    number: '03',
    title: 'The Creator',
    handle: 'the.amirsmith',
    tagline: 'Documenting the making of a professional athlete.',
    series: ['How To Be a Professional Athlete'],
    linkLabel: 'Open Instagram',
  },
} satisfies AthleteSigningContent;
