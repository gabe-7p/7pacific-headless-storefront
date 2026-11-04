import { shopifyImage, shopifyVideo, shopifyVideoPoster } from '~/lib/shopifyFiles';

import type { AthleteSigningContent } from './types';

/**
 * Kenneth Pierce — hybrid athlete (strength x endurance) in Austin, TX;
 * three marathons with a 3:37 PR, Hyrox Dallas next. Creator/model on IG
 * (@kennethpiercejr, "Runner Knowledge" series), ~25.6K followers.
 */
export const KENNETH_PIERCE = {
  chrome: {
    badge: 'Official // Athlete Signing',
    privacy: 'Private',
    edition: '001/001',
    urlLine: '7pacificapparel.com/athletes/kenneth-pierce',
    designedLine: 'Designed in San Francisco',
    existsLine: 'Exists only at /athletes/kenneth-pierce',
  },
  transmissionLine: 'Austin → San Francisco · 07.24.2026',
  eyebrowLine: 'Official // Athlete Signing · 07.24.2026',
  headline: { lead: 'Welcome to the team,', name: 'Kenneth Pierce.' },
  body: 'It’s official. We created this page to welcome you to the 7Pacific Athlete Creator team. Strength and endurance, \
  three marathons deep, and the next start line already circled. You turn hard seasons into PRs and make the work itself \
  the story. That’s exactly how we build. Scroll down to watch a personal message from us about why we’re fired up to have \
  you on the team.',
  signedLine: 'Signed · Status: Confirmed',
  hero: {
    modeLabel: 'Mode 01 · Action',
    locationLine: 'Austin · 30.27N',
    camLine: '',
    shotLine: 'Shot.01 — First Session',
    image: {
      src: shopifyImage('kenneth-pierce-signing.png'),
      alt: 'Kenneth Pierce mid-run',
      width: 1010,
      height: 1031,
    },
  },
  founderVideo: {
    number: '01',
    title: 'A Personal Message from the Founder',
    // Poster: Shopify's auto-generated preview (no custom thumbnail yet).
    src: shopifyVideo('41d3555453a64e79b9a45343f800b0ed', 'HD-720p-4.5Mbps-89804130'),
    poster: shopifyVideoPoster('41d3555453a64e79b9a45343f800b0ed.thumbnail.0000000000.jpg'),
    captions: '',
    attribution: 'Gabriel · Founder',
    duration: '00:24',
  },
  readout: {
    number: '02',
    title: 'Performance Readout',
    stat: { label: 'Marathon PR', value: '3:37', verified: true },
    scale: { markerPercent: 85, markerLabel: '26.2 ×3' },
    fields: [
      { label: 'Discipline', value: 'Strength x Endurance' },
      { label: 'Base', value: 'Austin' },
      { label: 'Reach', value: '25.6K' },
      { label: 'Next', value: 'Hyrox Dallas' },
    ],
  },
  instagram: {
    number: '03',
    title: 'The Creator',
    handle: 'kennethpiercejr',
    tagline: 'Strength x Endurance · Creator · Model · Faith.',
    series: ['Runner Knowledge', 'Road to Hyrox Dallas'],
    linkLabel: 'Open Instagram',
  },
} satisfies AthleteSigningContent;
