import { BaselineDrop } from '~/components/content/BaselineDrop';
import { BASELINE_DROP } from '~/content/baseline-drop';
import { buildMeta } from '~/lib/seo';

import type { Route } from './+types/drops.baseline';

export const meta: Route.MetaFunction = () =>
  buildMeta({ title: 'Baseline · 09.12.26', description: BASELINE_DROP.intro });

const BaselineDropPage = () => <BaselineDrop />;

export default BaselineDropPage;
