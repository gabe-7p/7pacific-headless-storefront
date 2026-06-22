import blackLogo from '~/assets/black_logo.svg';
import whiteLogo from '~/assets/white_logo.svg';
import { BRAND } from '~/lib/brand';
import { cn } from '~/lib/cn';

/**
 * Brand logo (from Shopify Files, vendored into app/assets). `tone` picks the
 * variant by background: 'dark' = the black logo for light backgrounds (default),
 * 'light' = the white logo for dark/overlay backgrounds (hero header, footer).
 */
export const Logo = ({
  tone = 'dark',
  className,
}: {
  tone?: 'dark' | 'light';
  className?: string;
}) => (
  <img
    src={tone === 'light' ? whiteLogo : blackLogo}
    alt={BRAND.name}
    width={1035}
    height={183}
    className={cn('h-7 w-auto', className)}
  />
);
