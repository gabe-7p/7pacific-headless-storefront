import { OurStory } from '~/components/content/OurStory';
import { OUR_STORY } from '~/content/our-story';
import { buildMeta } from '~/lib/seo';

import type { Route } from './+types/pages.our-story';

export const meta: Route.MetaFunction = () => {
  return buildMeta({ title: OUR_STORY.seoTitle });
};

const OurStoryPage = () => <OurStory />;

export default OurStoryPage;
