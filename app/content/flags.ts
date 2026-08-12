/**
 * Code-level feature flags — hand-edited toggles for showing/hiding whole
 * sections without deleting them. Flip a value and the site follows on the
 * next build/deploy (they're plain constants, not env vars or runtime state).
 */
export const FEATURE_FLAGS: {
  /** The homepage "Drop 02: FW26" teaser (countdown + Fall Gear / Coming
      Soon cards). `false` hides the whole section, including its waitlist
      dialog; the /api/waitlist endpoint stays live either way. */
  dropTwoTeaser: boolean;
} = {
  dropTwoTeaser: false,
};
