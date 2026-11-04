import logoDarkBg from '~/assets/logo-dark-bg.svg';
import logoLightBg from '~/assets/logo-light-bg.svg';
import { BRAND } from '~/content/brand';
import { cn } from '~/lib/cn';

/**
 * The sport-tag lockup: boxed race-bib "7" + PACIFIC wordmark. `tone` picks the
 * file: 'dark' = the Light-Bg file for light surfaces (default), 'light' = the
 * Dk-Bg file for dark/overlay surfaces. Never recolor.
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
