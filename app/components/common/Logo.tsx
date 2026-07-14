import logoDarkBg from '~/assets/logo-dark-bg.svg';
import logoLightBg from '~/assets/logo-light-bg.svg';
import { BRAND } from '~/lib/brand';
import { cn } from '~/lib/cn';

/**
 * The sport-tag lockup (7PA-245) — the final D9 V5 artwork from the brand's
 * Logo & Assets: boxed race-bib "7" + PACIFIC wordmark. `tone` picks the
 * variant by surface luminance: 'dark' = the Light-Bg file for light
 * surfaces (default), 'light' = the Dk-Bg file for dark/overlay surfaces
 * (hero header, footer). Never recolor these outside the artwork itself.
 */
export const Logo = ({
  tone = 'dark',
  className,
}: {
  tone?: 'dark' | 'light';
  className?: string;
}) => (
  <img
    src={tone === 'light' ? logoDarkBg : logoLightBg}
    alt={BRAND.name}
    width={1035}
    height={183}
    className={cn('h-7 w-auto', className)}
  />
);
