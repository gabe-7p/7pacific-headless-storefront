import { NEWSLETTER_HREF } from '~/content/links';

/**
 * The roster pitch + CTA shared verbatim by the homepage "The Roster" section,
 * the PDP brand banner and (as the opening of its body) the roster signup
 * dialog in content/join.ts — one voice edit applies to all three. Homepage
 * v2 (Oct 2026): the membership is the roster.
 */
export const MEMBERSHIP_PITCH = {
  body: 'We’re creating a community where competition and connection go hand in hand, bringing athletes together through training sessions, challenges, and experiences beyond the gym.',
  cta: { label: 'Join the roster', href: NEWSLETTER_HREF },
} as const;
