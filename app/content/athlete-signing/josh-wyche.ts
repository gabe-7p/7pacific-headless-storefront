import { shopifyImage, shopifyVideo, shopifyVideoPoster } from '~/lib/shopifyFiles';

import type { AthleteSigningContent } from './types';

/**
 * Josh Wyche — D1 guard at VCU (Atlantic 10), previously Lafayette; documents
 * life as a D1 athlete on IG (@joshwyche1): "Do Hard Things Friday" and
 * "Recovery Sunday" training series. Base: Richmond, VA.
 */
export const JOSH_WYCHE = {
  chrome: {
    badge: 'Official // Athlete Signing',
    privacy: 'Private',
    edition: '001/001',
    urlLine: '7pacificapparel.com/athletes/josh-wyche',
    designedLine: 'Designed in San Francisco',
    existsLine: 'Exists only at /athletes/josh-wyche',
  },
  transmissionLine: 'Richmond → San Francisco · 07.20.2026',
  eyebrowLine: 'Official // Athlete Signing · 07.20.2026',
  headline: { lead: 'Welcome to the team,', name: 'Josh Wyche.' },
  body: 'It’s official. We made this page to welcome you to the 7Pacific Athlete Creator team. You bring the kind \
   of energy people notice. There’s real passion behind everything you do, and that’s exactly what we want this team to represent. \
    Between Do Hard Things Friday and Recovery Sunday, you already train the way we build. Consistently, intentionally, and always willing \
    to put in the work. Scroll down for a personal message from us about why we’re so excited to have you on the team.',
  signedLine: 'Signed · Status: Confirmed',
  hero: {
    modeLabel: 'Mode 01 · Action',
    locationLine: 'Richmond · 37.54N',
    camLine: '',
    shotLine: 'Shot.01 — First Session',
    image: {
      src: shopifyImage('josh-wyche-athlete.png'),
      alt: 'Josh Wyche on the court',
      width: 1920,
      height: 1080,
    },
  },
  founderVideo: {
    number: '01',
    title: 'A Personal Message from the Founder',
    // IMG-0006 in Shopify Files (portrait, 40s) — Shopify's 720p transcode;
    // poster is the custom preview thumbnail set in Shopify admin.
    src: shopifyVideo('b01389f236234449b4e379bb39620772', 'HD-720p-4.5Mbps-89659216'),
    poster: shopifyVideoPoster(
      'Screenshot_2026-07-22_at_11.02.10_PM_0f4117ad-5577-48b3-8fee-1c8c77662097.png'
    ),
    captions: '',
    attribution: 'Gabriel · Founder',
    duration: '00:40',
  },
  readout: {
    number: '02',
    title: 'Performance Readout',
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
    number: '03',
    title: 'The Creator',
    handle: 'joshwyche1',
    tagline: 'Documenting life as a D1 athlete.',
    series: ['Do Hard Things Friday', 'Recovery Sunday', 'A Day in the Life at VCU'],
    linkLabel: 'Open Instagram',
  },
} satisfies AthleteSigningContent;
