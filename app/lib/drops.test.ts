import { describe, expect, it } from 'vitest';

import {
  canRenderFilm,
  type DropMetaobject,
  isArchived,
  parseDrop,
  sortDropsByEditionDesc,
} from '~/lib/drops';

const RAW: DropMetaobject = {
  handle: 'summer-25',
  fields: [
    { key: 'title', value: "Summer '25" },
    { key: 'edition_number', value: '1' },
    { key: 'status', value: 'live' },
    { key: 'editorial', value: 'Nine colorways, three silhouettes.' },
    {
      key: 'products',
      references: { nodes: [{ handle: 'tee-white' }, { handle: 'hat' }] as never },
    },
  ],
};

describe('parseDrop', () => {
  it('shapes a metaobject into typed drop props', () => {
    const drop = parseDrop(RAW);
    expect(drop.title).toBe("Summer '25");
    expect(drop.editionNumber).toBe('1');
    expect(drop.status).toBe('live');
    expect(drop.products).toHaveLength(2);
  });

  it('degrades gracefully when optional fields are missing (photography not shot yet)', () => {
    const drop = parseDrop({
      handle: 'winter-26',
      fields: [{ key: 'edition_number', value: '2' }],
    });
    // Title falls back to the handle rather than throwing, so a half-filled
    // drop still renders its title plate.
    expect(drop.title).toBe('winter-26');
    expect(drop.anchorImage).toBeNull();
    expect(drop.closingImage).toBeNull();
    expect(drop.filmUrl).toBeNull();
    expect(drop.products).toEqual([]);
  });
});

describe('sortDropsByEditionDesc', () => {
  it('lists the newest edition first', () => {
    const drops = [
      parseDrop({ handle: 'a', fields: [{ key: 'edition_number', value: '1' }] }),
      parseDrop({ handle: 'c', fields: [{ key: 'edition_number', value: '3' }] }),
      parseDrop({ handle: 'b', fields: [{ key: 'edition_number', value: '2' }] }),
    ];
    expect(sortDropsByEditionDesc(drops).map((d) => d.handle)).toEqual(['c', 'b', 'a']);
  });
});

describe('canRenderFilm', () => {
  const withFilm = (fields: DropMetaobject['fields']) => parseDrop({ handle: 'd', fields });

  it('renders a film only when it has captions (drop films carry music and room sound)', () => {
    expect(
      canRenderFilm(
        withFilm([
          { key: 'film_url', value: 'https://cdn.example/film.mp4' },
          { key: 'film_captions_url', value: 'https://cdn.example/film.vtt' },
        ])
      )
    ).toBe(true);
  });

  it('withholds an uncaptioned film rather than shipping it inaccessible', () => {
    expect(
      canRenderFilm(withFilm([{ key: 'film_url', value: 'https://cdn.example/film.mp4' }]))
    ).toBe(false);
  });
});

describe('isArchived', () => {
  it('marks archived drops (their purchase CTAs go dead, the page stays live)', () => {
    expect(isArchived(parseDrop(RAW))).toBe(false);
    expect(
      isArchived(parseDrop({ handle: 'x', fields: [{ key: 'status', value: 'archived' }] }))
    ).toBe(true);
  });
});
