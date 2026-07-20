/**
 * Helpers for the product card's signature two-line device (7PA-234): an
 * Archivo caps short name over a JetBrains Mono strip (`MINT · $79`). Raw
 * Shopify titles carry a "//" descriptor and a trailing color
 * ("AIRRAIL™ 6\" // CORE MOTION TRAINING SHORT - MINT"), so the device derives
 * the short name instead of rendering the raw string.
 *
 * The strip used to carry a per-family fabric spec ("92/8 shell", "84/16
 * mesh"); dropped per Gabe (2026-07-19) — those facts live on the PDP Spec
 * Card, not the card.
 */

const normalize = (value: string) => value.replace(/\s+/g, ' ').trim();

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Strip a trailing color suffix ("… SHORT - MINT", "… TEE- WHITE"). */
const stripColorSuffix = (value: string, colorName?: string) => {
  if (colorName) {
    const withColor = new RegExp(`\\s*-\\s*${escapeRegExp(colorName)}\\s*$`, 'i');
    if (withColor.test(value)) return value.replace(withColor, '');
  }
  // Fallback when the color name is unknown: drop a " - SUFFIX" tail.
  return value.replace(/\s+-\s+[A-Z ]+$/i, '');
};

/**
 * "AIRRAIL™ 6\" // CORE MOTION TRAINING SHORT - MINT" → "AIRRAIL™ 6\" SHORT".
 * The part before "//" is the product name; the descriptor's last word (after
 * stripping the color) is the family noun. Titles without "//" just lose the
 * color suffix.
 */
export const getShortTitle = (title: string, colorName?: string): string => {
  const parts = title.split('//');
  const left = parts[0] ?? title;
  const right = parts[1];
  if (!right) return normalize(stripColorSuffix(title, colorName));
  const descriptor = normalize(stripColorSuffix(right, colorName));
  const noun = descriptor.split(' ').at(-1);
  return normalize(noun ? `${left} ${noun}` : left);
};
