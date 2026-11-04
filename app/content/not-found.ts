/**
 * 404 page content. The sentence itself is MICROCOPY.notFound — this holds the
 * supporting pieces: the coordinates spec-line and the photograph.
 */

import { filesImage } from '~/lib/shopifyFiles';

export const NOT_FOUND_PAGE = {
  coordinates: '37.78°N · 122.51°W',
  location: 'Lands End',
  image: filesImage('potential_hero_image.jpg', {
    width: 2048,
    height: 1365,
    alt: 'Two athletes walking away down a foggy coastal trail at Lands End',
  }),
} as const;
