import { FirstLightTeaser } from '~/components/content/FirstLightTeaser';
import { FIRST_LIGHT } from '~/content/first-light';
import { buildMeta } from '~/lib/seo';

import type { Route } from './+types/drops.first-light';

export const meta: Route.MetaFunction = () =>
  buildMeta({ title: 'First Light · 09.13.26', description: FIRST_LIGHT.intro });

const FirstLightPage = () => <FirstLightTeaser />;

export default FirstLightPage;
