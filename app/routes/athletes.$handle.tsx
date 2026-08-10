import { useLoaderData } from 'react-router';

import { AthleteSigning } from '~/components/content/AthleteSigning';
import { getAthleteSigning } from '~/content/athlete-signing';
import { notFound } from '~/lib/http';
import { buildMeta } from '~/lib/seo';
import type { RouteHandle } from '~/root';

import type { Route } from './+types/athletes.$handle';

// Signing pages render their own bars instead of the site chrome.
export const handle: RouteHandle = { chrome: false };

// No fetching — the loader just resolves the typed content constant for the
// handle (404 on unknown) so meta and the component share one lookup.
export async function loader({ params }: Route.LoaderArgs) {
  const athlete = getAthleteSigning(params.handle);
  if (!athlete) throw notFound('Athlete not found');
  return { athlete };
}

export const meta: Route.MetaFunction = ({ loaderData }) => {
  if (!loaderData) return buildMeta({});
  const { lead, name } = loaderData.athlete.headline;
  return buildMeta({ title: `${lead} ${name}`.replace(/\.$/, '') });
};

const AthletePage = () => {
  const { athlete } = useLoaderData<typeof loader>();
  return <AthleteSigning content={athlete} />;
};

export default AthletePage;
