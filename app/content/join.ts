/**
 * The join flow's copy — one signup pipe (`JoinForm` → POST /api/subscribe)
 * with two lists behind it. Each list's copy lives here so the footer, the
 * `JoinDialog`, and any surface that mounts its own `JoinForm` read the same
 * lines.
 *
 * Acquisition through community, not price (7PA-241): no discount language,
 * ever. Homepage v2 (Oct 2026): the membership is the roster.
 */

/** The lists a visitor can join. The API rejects anything else with a 400. */
export const JOIN_LISTS = ['newsletter', 'waitlist'] as const;

export type JoinList = (typeof JOIN_LISTS)[number];

export const isJoinList = (value: string): value is JoinList =>
  (JOIN_LISTS as ReadonlyArray<string>).includes(value);

/** What `JoinForm` needs to render one list's fields and outcome. */
export type JoinFormCopy = {
  /** Only read when the form renders a name field (`withName`). */
  namePlaceholder?: string;
  emailPlaceholder: string;
  submitLabel: string;
  successMessage: string;
};

/** A list's dialog copy: the form lines plus the panel's heading and body. */
export type JoinDialogCopy = JoinFormCopy & { heading: string; body: string };

/**
 * The waitlist confirmation, shared by the homepage dialog and the FIRST
 * LIGHT Early Access block (one list, two doors) — the same voice either way.
 */
export const WAITLIST_SUCCESS_MESSAGE = 'You’re on it. See you at first light.';

export const JOIN_COPY: Record<JoinList, JoinDialogCopy> = {
  /**
   * The roster (email only). One set of lines shared by the footer signup and
   * the click-triggered "Join the roster" dialog (Gabe 2026-10-08), so the
   * dialog continues the CTA that opened it.
   */
  newsletter: {
    heading: 'Join the roster',
    body: 'We’re creating a community where competition and connection go hand in hand, bringing athletes together through training sessions, challenges, and experiences beyond the gym. Leave your email and we add your name to the book.',
    emailPlaceholder: 'your@email.com',
    submitLabel: 'Add my name',
    successMessage: 'You’re in the book. See you at the next session.',
  },
  /** The Drop 02 waitlist (name + email), opened by the Coming Soon card. */
  waitlist: {
    heading: 'Get on the List',
    body: 'DAYBREAK™ and FRONTRUNNER™ land 09.13.26. Leave your name and we’ll tell you the moment they do.',
    namePlaceholder: 'Name',
    emailPlaceholder: 'Email address',
    submitLabel: 'Get on the List',
    successMessage: WAITLIST_SUCCESS_MESSAGE,
  },
};
