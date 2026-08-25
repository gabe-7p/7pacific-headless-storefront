/**
 * 404 page content. The sentence itself is MICROCOPY.notFound (locked verbatim,
 * 7PA-243) — this holds the supporting pieces: the coordinates spec-line device
 * (echoing the homepage hero's Lands End readout in content/home.ts — same
 * place, same device) and the photograph.
 */

import { BRAND } from '~/lib/brand';

export const NOT_FOUND_PAGE = {
  coordinates: '37.78°N · 122.51°W',
  location: 'Lands End',
  image: {
    url: `${BRAND.filesCdn}/potential_hero_image.jpg`,
    width: 2048,
    height: 1365,
    altText: 'Two athletes walking away down a foggy coastal trail at Lands End',
  },
} as const;
