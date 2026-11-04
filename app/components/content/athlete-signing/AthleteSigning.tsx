import { Container } from '~/components/common/Container';
import type { AthleteSigningContent } from '~/content/athlete-signing';

import { CreatorPanel } from './CreatorPanel';
import { FounderVideo } from './FounderVideo';
import { PerformanceReadout } from './PerformanceReadout';
import { SigningBottomBar } from './SigningBottomBar';
import { SigningHero } from './SigningHero';
import { SigningTopBar } from './SigningTopBar';

/**
 * One-off athlete-signing page (mockup: sealed dark page, no store chrome).
 * Purely presentational — all copy/assets come from an `AthleteSigningContent`
 * object, so a second signing is a new content object, not new components.
 * The route opts out of PageLayout (`handle: { chrome: false }`), so this
 * renders its own top/bottom bars and `main` landmark.
 */
export const AthleteSigning = ({ content }: { content: AthleteSigningContent }) => (
  <div className="bg-field-night text-ink-night flex min-h-svh flex-col bg-[image:var(--file-grid)]">
    <SigningTopBar chrome={content.chrome} />
    <main className="flex-1">
      <SigningHero content={content} />
      <Container>
        <div className="border-t border-border-subtle-night" />
      </Container>
      <Container className="py-10 md:py-16">
        {/* The video column is sized for a portrait (phone) source; readout +
            creator stack beside it to match its height. */}
        <div className="grid gap-12 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-10 lg:gap-16">
          <FounderVideo video={content.founderVideo} />
          <div className="flex flex-col gap-12 md:gap-10">
            <PerformanceReadout readout={content.readout} />
            <CreatorPanel instagram={content.instagram} />
          </div>
        </div>
      </Container>
    </main>
    <SigningBottomBar chrome={content.chrome} />
  </div>
);
