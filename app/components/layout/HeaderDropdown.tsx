import { NavLink } from 'react-router';

import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from '~/components/ui/navigation-menu';
import { cn } from '~/lib/cn';
import type { HeaderData } from '~/lib/fragments';

/** A top-level `main-menu` item; nested ones carry their children in `items`. */
export type HeaderMenuItem = NonNullable<HeaderData['menu']>['items'][number];

/**
 * The caps-UI tier every header nav label shares: Archivo Condensed Medium
 * (Gabe's override of the Inter caps-UI rule), ALL CAPS, +0.08em tracking.
 */
export const NAV_LABEL_CLASS = 'font-display font-medium tracking-caps uppercase';

/**
 * Live's desktop underline wipe (.site-nav__link--underline:after): a 2px rule
 * that grows left-to-right over 500ms on hover. A dropdown trigger also holds
 * it while its panel is open.
 */
export const NAV_DESKTOP_CLASS = cn(
  NAV_LABEL_CLASS,
  'relative inline-flex items-center py-1 text-xs after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-500 after:content-[""] hover:after:scale-x-100 data-[state=open]:after:scale-x-100 motion-reduce:after:transition-none'
);

/** A row in the mobile drawer: caps label, full-width hairline under it. */
export const MOBILE_ROW_CLASS = cn(
  NAV_LABEL_CLASS,
  'border-border-subtle border-b px-5 py-4 text-sm transition-opacity hover:opacity-70'
);

/**
 * A desktop nav item with children: a caps trigger that opens a panel of its
 * child links (hover, click or keyboard — Radix NavigationMenu). The parent's
 * own Shopify link is never rendered; Shopify requires one, so it only matters
 * to a build that ignores children.
 */
export const HeaderDropdown = ({
  item,
  resolveUrl,
}: {
  item: HeaderMenuItem;
  resolveUrl: (url: string) => string;
}) => (
  <NavigationMenuItem>
    <NavigationMenuTrigger className={NAV_DESKTOP_CLASS}>{item.title}</NavigationMenuTrigger>
    {/* Always the solid chrome, even over a transparent header (homepage hero, drop collection banners). */}
    <NavigationMenuContent className="mt-3 min-w-44 p-1">
      <ul className="flex flex-col">
        {item.items.map(
          (child) =>
            child.url && (
              <li key={child.id}>
                <NavigationMenuLink asChild>
                  <NavLink
                    end
                    prefetch="intent"
                    to={resolveUrl(child.url)}
                    className={cn(NAV_LABEL_CLASS, 'px-3 py-2.5 text-xs whitespace-nowrap')}
                  >
                    {child.title}
                  </NavLink>
                </NavigationMenuLink>
              </li>
            )
        )}
      </ul>
    </NavigationMenuContent>
  </NavigationMenuItem>
);
