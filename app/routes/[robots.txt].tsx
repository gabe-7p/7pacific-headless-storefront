import { getRobotsTxt } from '~/lib/robots';
import { storefrontClientContext } from '~/lib/storefront';

import type { Route } from './+types/[robots.txt]';

export async function loader({ url, context }: Route.LoaderArgs) {
  return getRobotsTxt(context.get(storefrontClientContext), url.origin);
}
