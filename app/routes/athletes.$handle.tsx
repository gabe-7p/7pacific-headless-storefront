import { AthleteSigning } from '~/components/content/AthleteSigning';
import { getAthleteSigning } from '~/content/athlete-signing';
import { buildMeta } from '~/lib/seo';
import type { RouteHandle } from '~/root';

import type { Route } from './+types/athletes.$handle';

// Signing pages render their own bars instead of the site chrome.
export const handle: RouteHandle = { chrome: false };

// No fetching — the loader just resolves the typed content constant for the
// handle (404 on unknown) so meta and the component share one lookup.
export const loader = ({ params }: Route.LoaderArgs) => {
  const athlete = getAthleteSigning(params.handle);
  if (!athlete) throw new Response('Athlete not found', { status: 404 });
  return { athlete };
};

export const meta: Route.MetaFunction = ({ data }) => {
  if (!data) return buildMeta({});
  const { lead, name } = data.athlete.headline;
  return buildMeta({ title: `${lead} ${name}`.replace(/\.$/, '') });
};

const AthletePage = ({ loaderData }: Route.ComponentProps) => (
  <AthleteSigning content={loaderData.athlete} />
);

export default AthletePage;
