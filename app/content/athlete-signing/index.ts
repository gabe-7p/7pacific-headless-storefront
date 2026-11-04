/**
 * Athlete-signing page content — one-off commemorative pages served by the
 * dynamic route /athletes/<handle> (routes/athletes.$handle.tsx). A new
 * signing is a new `AthleteSigningContent` object in its own file (named
 * after the URL handle) plus one line in the `ATHLETE_SIGNINGS` registry
 * below — no new routes or components.
 */

import { AARON_LEE } from './aaron-lee';
import { AMIR_SMITH } from './amir-smith';
import { JOSH_WYCHE } from './josh-wyche';
import { KENNETH_PIERCE } from './kenneth-pierce';
import { DAKOTAH_RIEMER } from './kody-riemer';
import { NICK_GONZALEZ } from './nick-gonzalez';
import { OWEN_PLATT } from './owen-platt';
import type { AthleteSigningContent } from './types';

export type { AthleteSigningContent, ScaleMarkerPercent } from './types';

/** URL handle → signing page content. Adding an athlete = one line here. */
const ATHLETE_SIGNINGS: Record<string, AthleteSigningContent> = {
  'amir-smith': AMIR_SMITH,
  'josh-wyche': JOSH_WYCHE,
  'kenneth-pierce': KENNETH_PIERCE,
  'owen-platt': OWEN_PLATT,
  'aaron-lee': AARON_LEE,
  'nick-gonzalez': NICK_GONZALEZ,
  'kody-riemer': DAKOTAH_RIEMER,
};

/** Returns null for unknown handles — the route turns that into a 404. */
export const getAthleteSigning = (handle: string | undefined) =>
  (handle && ATHLETE_SIGNINGS[handle]) || null;
