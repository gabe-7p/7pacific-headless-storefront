/**
 * The join flow's copy — one signup pipe (`JoinForm` → POST /api/subscribe)
 * with two lists behind it. Each list's copy lives here so every surface
 * reads the same lines.
 *
 * Acquisition through community, not price (7PA-241): no discount language,
 * ever.
 */

import { MEMBERSHIP_PITCH } from '~/content/membership';
import { type FilesImage, filesImage } from '~/lib/shopifyFiles';

/** The lists a visitor can join. The API rejects anything else with a 400. */
const JOIN_LISTS = ['newsletter', 'waitlist'] as const;

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
export type JoinDialogCopy = JoinFormCopy & {
  heading: string;
  body: string;
  /** The dialog's side image (Shopify Files); omit for a text-only panel. */
  image?: FilesImage;
};

/**
 * The waitlist confirmation, shared by the homepage dialog and the FIRST
 * LIGHT Early Access block (one list, two doors) — the same voice either way.
 */
export const WAITLIST_SUCCESS_MESSAGE = 'You’re on it. See you at first light.';

export const JOIN_COPY: Record<JoinList, JoinDialogCopy> = {
  /**
   * The roster (email only). One set of lines shared by the footer signup and
   * the click-triggered "Join the roster" dialog, so the
   * dialog continues the CTA that opened it — the body opens with the same
   * pitch paragraph the homepage Roster section and PDP banner show.
   */
  newsletter: {
    heading: 'Join the roster',
    body: `${MEMBERSHIP_PITCH.body} Leave your email and we add your name to the book.`,
    emailPlaceholder: 'your@email.com',
    submitLabel: 'Add my name',
    successMessage: 'You’re in the book. See you at the next session.',
    // Decorative — hidden below `sm`, and the heading carries the meaning.
    image: filesImage('jahli_full_body_behind_in_gym.jpg', {
      v: 1793245833,
      width: 3580,
      height: 4000,
      alt: '',
    }),
  },
  /** The Drop 02 waitlist (name + email), opened by the Coming Soon card. */
  waitlist: {
    heading: 'Get on the List',
    body: 'DAYBREAK™ and FRONTRUNNER™ land 11.13.26. Leave your name and we’ll tell you the moment they do.',
    namePlaceholder: 'Name',
    emailPlaceholder: 'Email address',
    submitLabel: 'Get on the List',
    successMessage: WAITLIST_SUCCESS_MESSAGE,
  },
};
