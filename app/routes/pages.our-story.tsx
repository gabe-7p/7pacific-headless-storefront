import { OurStory } from '~/components/content/OurStory';
import { buildMeta } from '~/lib/seo';

import type { Route } from './+types/pages.our-story';

export const meta: Route.MetaFunction = () => {
  return buildMeta({ title: 'Our Story' });
};

const OurStoryPage = () => <OurStory />;

export default OurStoryPage;
