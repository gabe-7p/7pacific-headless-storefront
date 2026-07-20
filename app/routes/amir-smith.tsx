import { AthleteSigning } from '~/components/content/AthleteSigning';
import { AMIR_SMITH } from '~/content/athlete-signing';
import { buildMeta } from '~/lib/seo';
import type { RouteHandle } from '~/root';

import type { Route } from './+types/amir-smith';

// One-off signing page: renders its own bars instead of the site chrome.
export const handle: RouteHandle = { chrome: false };

export const meta: Route.MetaFunction = () => {
  return buildMeta({ title: 'Welcome to the Team, Amir Smith' });
};

const AmirSmithPage = () => <AthleteSigning content={AMIR_SMITH} />;

export default AmirSmithPage;
