/**
 * Code-level feature flags — hand-edited toggles for showing/hiding whole
 * sections without deleting them. Flip a value and the site follows on the
 * next build/deploy (they're plain constants, not env vars or runtime state).
 */
export const FEATURE_FLAGS: {
  /** The homepage "Drop 02: FW26" teaser (countdown + Fall Gear / Coming
      Soon cards). `false` hides the whole section, including its door to
      the waitlist dialog; the /api/subscribe endpoint (and the FIRST LIGHT
      page's own waitlist form) stay live either way. */
  dropTwoTeaser: boolean;
  /** The homepage "Baseline V01" intro (The First Kit + Behind the Build
      cards), in the same slot below the Name/Spec banner. `false` hides it;
      its copy stays in HOME_BASELINE_INTRO (content/home.ts). */
  baselineIntro: boolean;
  /** The 4-up lookbook strip on /drops/first-light (the only page that has
      one). `false` hides it; its slots stay in FIRST_LIGHT.lookbook. */
  firstLightLookbook: boolean;
  /** The First Light collection in the header's Collections menu (Explore,
      Shop and its photo card, desktop and drawer). `false` until launch
      (11.13.26, DROP_TWO_LAUNCH): Shopify's Main Menu already lists it, so
      this is what keeps shoppers from reaching the collection from the nav. */
  firstLightCollection: boolean;
} = {
  dropTwoTeaser: true,
  baselineIntro: false,
  firstLightLookbook: false,
  firstLightCollection: false,
};
