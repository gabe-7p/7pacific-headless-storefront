import { describe, expect, it } from 'vitest';

import {
  HOME_BASELINE_INTRO,
  HOME_CORE_VALUES,
  HOME_FIRST_DROP,
  HOME_HERO,
  HOME_ROSTER,
} from '~/content/home';
import { BRAND } from '~/lib/brand';

/**
 * The brand vocabulary gate (Brand Guidelines → Voice): binary, not a vibe
 * check. Banned words never ship. (Cautioned words — journey, explore… — are
 * a judgment call Gabe makes per line, so they are not enforced here.)
 * Multi-word phrases are matched as phrases.
 */
const BANNED = [
  'vibe',
  'vibes',
  'wellness',
  'mindful',
  'intentional',
  'holistic',
  'grind',
  'hustle',
  'no days off',
  'beast mode',
  'gains',
  'level up',
  'unlock',
  'unleash',
  'forge',
  'warrior',
  'conquer',
  'crush',
  'smash',
  'elevate',
  'curate',
  'premium',
  'empower',
  'world-class',
  'best-in-class',
  'cutting-edge',
  'revolutionary',
  'game-changing',
  'redefine',
  'reimagine',
  'iconic',
  'legendary',
  'sustainable',
];
/** Collect every string leaf. */
const collectStrings = (value: unknown, out: Array<string> = []): Array<string> => {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, out));
  else if (value && typeof value === 'object')
    Object.values(value).forEach((item) => collectStrings(item, out));
  return out;
};

const isUrl = (text: string) => /^https?:\/\//.test(text) || text.startsWith('/');

const HOMEPAGE_COPY = collectStrings([
  HOME_HERO,
  HOME_BASELINE_INTRO,
  HOME_FIRST_DROP,
  HOME_CORE_VALUES,
  HOME_ROSTER,
  BRAND.newsletter,
]).filter((text) => !isUrl(text));

const wordPattern = (word: string) => new RegExp(`(^|[^a-z])${word}(s|d|ed|ing)?([^a-z]|$)`, 'i');

describe('homepage copy — brand gate', () => {
  it('contains no banned words', () => {
    for (const word of BANNED) {
      const hits = HOMEPAGE_COPY.filter((text) => wordPattern(word).test(text));
      expect(hits, `banned word "${word}"`).toEqual([]);
    }
  });

  it('has no exclamation points or emoji', () => {
    for (const text of HOMEPAGE_COPY) {
      expect(text, text).not.toContain('!');
      expect(text, text).not.toMatch(/\p{Extended_Pictographic}/u);
    }
  });

  it('keeps the hero headline to two lines and eight words', () => {
    expect(HOME_HERO.headlineLines).toHaveLength(2);
    const words = HOME_HERO.headlineLines.join(' ').split(/\s+/);
    expect(words.length).toBeLessThanOrEqual(8);
  });

  it('renders four rules', () => {
    expect(HOME_CORE_VALUES.values).toHaveLength(4);
  });
});
