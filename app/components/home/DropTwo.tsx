import { useState } from 'react';

import { Cta } from '~/components/common/Cta';
import { TeaserSection } from '~/components/home/TeaserSection';
import { WaitlistDialog } from '~/components/home/WaitlistDialog';
import { HOME_DROP_TWO } from '~/content/home';

/**
 * "Drop 02: FW26" — the First Light teaser directly below the Name/Spec
 * banner: section title, live countdown to the drop, and the two teaser
 * cards (Fall Gear → collection page, Coming Soon → waitlist dialog).
 * The waitlist dialog state lives here — the only per-instance behavior
 * the shared TeaserSection can't own.
 */
export const DropTwo = () => {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const { fallGear, comingSoon } = HOME_DROP_TWO.cards;

  return (
    <>
      <TeaserSection
        heading={HOME_DROP_TWO.heading}
        countdown={{ dropIso: HOME_DROP_TWO.dropIso, labels: HOME_DROP_TWO.countdownLabels }}
        cards={[
          {
            content: fallGear,
            cta: (
              <Cta to={fallGear.cta.href} prefetch="intent" size="xs" className="mt-4">
                {fallGear.cta.label}
              </Cta>
            ),
          },
          {
            content: comingSoon,
            cta: (
              <Cta onClick={() => setWaitlistOpen(true)} size="xs" className="mt-4">
                {comingSoon.cta.label}
              </Cta>
            ),
          },
        ]}
      />
      <WaitlistDialog open={waitlistOpen} onOpenChange={setWaitlistOpen} />
    </>
  );
};
