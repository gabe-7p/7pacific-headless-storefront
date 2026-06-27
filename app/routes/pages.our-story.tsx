import { OurStory } from '~/components/content/OurStory';
import { pageTitle } from '~/lib/seo';

import type { Route } from './+types/pages.our-story';

export const meta: Route.MetaFunction = () => {
  return [{ title: pageTitle('Our Story') }];
};

const OurStoryPage = () => <OurStory />;

export default OurStoryPage;
