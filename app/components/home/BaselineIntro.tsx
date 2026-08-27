import { Cta } from '~/components/common/Cta';
import { TeaserSection } from '~/components/home/TeaserSection';
import { HOME_BASELINE_INTRO } from '~/content/home';

/**
 * "Baseline: ED. 01" — the intro teaser below the Name/Spec banner, pointing
 * deeper into the live first collection: the /drops/baseline editorial page
 * and the collection film on YouTube (new tab). No countdown — the drop is
 * live. Stateless; the shared TeaserSection owns the layout.
 */
export const BaselineIntro = () => {
  const { collection, film } = HOME_BASELINE_INTRO.cards;

  return (
    <TeaserSection
      heading={HOME_BASELINE_INTRO.heading}
      subtitle={HOME_BASELINE_INTRO.subtitle}
      cards={[
        {
          content: collection,
          cta: (
            <Cta to={collection.cta.href} prefetch="intent" size="xs" className="mt-4">
              {collection.cta.label}
            </Cta>
          ),
        },
        {
          content: film,
          cta: (
            <Cta href={film.cta.href} target="_blank" size="xs" className="mt-4">
              {film.cta.label}
            </Cta>
          ),
        },
      ]}
    />
  );
};
