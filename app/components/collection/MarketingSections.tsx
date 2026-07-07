import { cn } from '~/lib/cn';

export type MarketingSection = {
  imageUrl: string;
  heading: string;
  body: string;
  align?: 'left' | 'right';
};

/** Parse the collection's `custom.marketing_sections` JSON metafield value. */
export const parseMarketingSections = (value?: string | null): Array<MarketingSection> => {
  if (!value) return [];
  try {
    return JSON.parse(value) as Array<MarketingSection>;
  } catch {
    return [];
  }
};

/**
 * Image + text marketing sections shown below the collection product grid. Each
 * is a full-bleed image with an overlapping text card; the card alternates side
 * per `align`. Mirrors the live collection page's sub-sections.
 */
export const MarketingSections = ({ sections }: { sections: ReadonlyArray<MarketingSection> }) => {
  if (sections.length === 0) return null;

  return (
    <div className="mt-16 flex flex-col gap-3 md:mt-24 md:gap-4">
      {sections.map((section) => (
        <div key={section.heading} className="relative">
          <img
            src={section.imageUrl}
            alt=""
            loading="lazy"
            className="aspect-[4/5] w-full object-cover sm:aspect-[16/9] lg:aspect-[21/9]"
          />
          <div
            className={cn(
              'bottom-6 w-[85%] bg-white p-6 md:absolute md:w-[38%] md:p-8 lg:p-10',
              section.align === 'left' ? 'md:left-6' : 'md:right-6'
            )}
          >
            <h3 className="text-lg font-bold tracking-wide uppercase md:text-xl">
              {section.heading}
            </h3>
            <p className="mt-3 text-sm leading-6 text-neutral-600">{section.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
