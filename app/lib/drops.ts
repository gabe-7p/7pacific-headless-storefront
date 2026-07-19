/**
 * Drops (7PA-247) — each drop is a Shopify `drop` metaobject with its own
 * permanent URL (`/drops/<handle>`), archived forever. "The journal of the
 * brand is its drop archive" (05 Channels → Website → Drop pages).
 *
 * Field access is deliberately keyed off the metaobject's `fields` array: a
 * missing or renamed field degrades to undefined instead of throwing, so a
 * half-filled drop still renders its title plate.
 */

import type { ProductCardFragment } from 'storefrontapi.generated';

import type { MetafieldImage } from '~/lib/metafields';

type MetaobjectField = {
  key: string;
  value?: string | null;
  reference?: { image?: MetafieldImage | null } | null;
  references?: { nodes: Array<ProductCardFragment> } | null;
};

export type DropMetaobject = {
  handle: string;
  fields: Array<MetaobjectField>;
};

export type Drop = {
  handle: string;
  title: string;
  editionNumber: string | null;
  status: string | null;
  editorial: string | null;
  anchorImage: MetafieldImage | null;
  closingImage: MetafieldImage | null;
  filmUrl: string | null;
  /** WebVTT captions. A film only renders with them — see `canRenderFilm`. */
  filmCaptionsUrl: string | null;
  products: Array<ProductCardFragment>;
};

const field = (drop: DropMetaobject, key: string) => drop.fields.find((f) => f.key === key);

/** Shape a raw `drop` metaobject into the typed props the routes render. */
export const parseDrop = (drop: DropMetaobject): Drop => ({
  handle: drop.handle,
  title: field(drop, 'title')?.value ?? drop.handle,
  editionNumber: field(drop, 'edition_number')?.value ?? null,
  status: field(drop, 'status')?.value ?? null,
  editorial: field(drop, 'editorial')?.value ?? null,
  anchorImage: field(drop, 'anchor_image')?.reference?.image ?? null,
  closingImage: field(drop, 'closing_image')?.reference?.image ?? null,
  filmUrl: field(drop, 'film_url')?.value ?? null,
  filmCaptionsUrl: field(drop, 'film_captions_url')?.value ?? null,
  products: field(drop, 'products')?.references?.nodes ?? [],
});

/**
 * A drop film ships with captions or it doesn't ship. Drop films carry music
 * and voices (Video Direction: "keep the mess in"), so an uncaptioned film
 * would be inaccessible — the metaobject's `film_captions_url` is the gate.
 */
export const canRenderFilm = (drop: Drop): boolean =>
  Boolean(drop.filmUrl) && Boolean(drop.filmCaptionsUrl);

/** Newest edition first — the archive index reads top-down as most-recent. */
export const sortDropsByEditionDesc = (drops: Array<Drop>): Array<Drop> =>
  [...drops].sort(
    (a, b) =>
      Number.parseInt(b.editionNumber ?? '0', 10) - Number.parseInt(a.editionNumber ?? '0', 10)
  );

/** An archived drop still routes; its purchase CTAs go dead. */
export const isArchived = (drop: Drop) => drop.status === 'archived';
