/**
 * The brand vocabulary gate (Brand Guidelines → Voice): binary, not a vibe
 * check. Banned words never ship. (Cautioned words — journey, explore… — are
 * a judgment call Gabe makes per line, so they are not enforced here.)
 * Multi-word phrases are matched as phrases.
 * Shared by home.test.ts and brand-gate.test.ts.
 */
export const BANNED = [
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
/** Matches the word or its plural / past / -ing form, not a substring of another word. */
export const bannedWordPattern = (word: string) =>
  new RegExp(`(^|[^a-z])${word}(s|d|ed|ing)?([^a-z]|$)`, 'i');
