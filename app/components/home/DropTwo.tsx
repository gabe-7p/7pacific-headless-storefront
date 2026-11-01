import { Cta } from '~/components/common/Cta';
import { useJoinDialog } from '~/components/common/useJoinDialog';
import { TeaserSection } from '~/components/home/TeaserSection';
import { HOME_DROP_TWO } from '~/content/home';

/**
 * "Drop 02: FW26" — the First Light teaser directly below the Name/Spec
 * banner: section title, live countdown to the drop, and the two teaser
 * cards (Fall Gear → collection page, Coming Soon → the waitlist in the
 * shared `JoinDialog`).
 */
export const DropTwo = () => {
  const join = useJoinDialog();
  const { fallGear, comingSoon } = HOME_DROP_TWO.cards;

  return (
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
            <Cta onClick={() => join?.open('waitlist')} size="xs" className="mt-4">
              {comingSoon.cta.label}
            </Cta>
          ),
        },
      ]}
    />
  );
};
