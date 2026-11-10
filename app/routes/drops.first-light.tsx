import { FirstLightTeaser } from '~/components/content/FirstLightTeaser';
import { FIRST_LIGHT } from '~/content/first-light';
import { buildMeta } from '~/lib/seo';

import type { Route } from './+types/drops.first-light';

export const meta: Route.MetaFunction = () =>
  buildMeta({
    title: FIRST_LIGHT.seoTitle,
    description: FIRST_LIGHT.seoDescription,
    image: FIRST_LIGHT.ogImage,
  });

const FirstLightPage = () => <FirstLightTeaser />;

export default FirstLightPage;
