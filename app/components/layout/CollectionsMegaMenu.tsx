import { NavigationMenu as NavigationMenuPrimitive } from 'radix-ui';
import { NavLink } from 'react-router';

import { Container } from '~/components/common/Container';
import { Cta } from '~/components/common/Cta';
import { Image } from '~/components/common/Image';
import { SpecLine } from '~/components/common/SpecLine';
import {
  type HeaderMenuItem,
  NAV_DESKTOP_CLASS,
  NAV_LABEL_CLASS,
} from '~/components/layout/HeaderDropdown';
import {
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from '~/components/ui/navigation-menu';
import { COLLECTIONS_MENU } from '~/content/navigation';
import { cn } from '~/lib/cn';
import type { FilesImage } from '~/lib/shopifyFiles';
import { collectionHandleFromPath, dropUrl } from '~/lib/urls';

type CollectionEntry = { id: string; title: string; path: string; handle: string };

/**
 * The item's children as collections, or null when any linked child isn't a
 * collection link (then the item keeps the plain `HeaderDropdown`).
 */
export const getCollectionEntries = (
  item: HeaderMenuItem,
  resolveUrl: (url: string) => string
): Array<CollectionEntry> | null => {
  const entries = item.items.flatMap((child) => {
    if (!child.url) return [];
    const path = resolveUrl(child.url);
    return [{ id: child.id, title: child.title, path, handle: collectionHandleFromPath(path) }];
  });
  if (entries.length === 0) return null;
  return entries.every((entry): entry is CollectionEntry => entry.handle !== null) ? entries : null;
};

const MEDIA: Partial<Record<string, FilesImage>> = COLLECTIONS_MENU.media;

/** The photo cards are 2-up in a column capped at 30rem, desktop only. */
const CARD_SIZES = '(min-width: 1025px) 15rem, 0px';

/**
 * Each column slides in from the left a beat after the one before it, on top
 * of the panel's own slide. `fill-mode-both` holds the start frame through
 * the delay.
 */
const COLUMN_ENTER =
  'animate-in fade-in-0 slide-in-from-left-4 duration-500 ease-(--ease-brand) fill-mode-both motion-reduce:animate-none';

const LinkList = ({
  title,
  entries,
  to,
  delayClass,
}: {
  title: string;
  entries: Array<CollectionEntry>;
  to: (entry: CollectionEntry) => string;
  delayClass: string;
}) => (
  <div className={cn(COLUMN_ENTER, delayClass)}>
    <SpecLine className="text-support">{title}</SpecLine>
    <ul className="mt-4 flex flex-col gap-1">
      {entries.map((entry) => (
        <li key={entry.id}>
          <NavigationMenuLink asChild>
            <NavLink
              end
              prefetch="intent"
              to={to(entry)}
              className={cn(NAV_LABEL_CLASS, 'px-0 py-1.5 text-base whitespace-nowrap')}
            >
              {entry.title}
            </NavLink>
          </NavigationMenuLink>
        </li>
      ))}
    </ul>
  </div>
);

/**
 * The Collections mega-menu: a full-width panel under the header in the
 * header's own `bg-nav`, sliding in left to right. Explore (each collection's
 * drop page, the story), Shop (the collection grid), and a photo card per
 * collection with a Cta to the grid. Copy and photos in content/navigation.ts.
 *
 * The panel is Radix's Content composed directly, not the shadcn
 * `NavigationMenuContent`: that wrapper's zoom/fade recipe and dropdown frame
 * are what this panel replaces (the same call as `product/SizeGuide` composing
 * `Sheet`). It positions against the `<header>`, so the item, the root and
 * Radix's list wrapper are all `static` (see `HeaderMenu`).
 */
export const CollectionsMegaMenu = ({
  item,
  entries,
}: {
  item: HeaderMenuItem;
  entries: Array<CollectionEntry>;
}) => (
  <NavigationMenuItem className="static">
    <NavigationMenuTrigger className={NAV_DESKTOP_CLASS}>{item.title}</NavigationMenuTrigger>
    <NavigationMenuPrimitive.Content className="bg-nav text-nav-text border-border-subtle data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-left-8 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-left-8 absolute top-full left-0 w-full border-b shadow-sm duration-300 ease-(--ease-brand) motion-reduce:animate-none">
      <Container className="grid grid-cols-[auto_auto_1fr] gap-x-16 py-8 impulse-lg:gap-x-24">
        <LinkList
          title={COLLECTIONS_MENU.exploreTitle}
          entries={entries}
          to={(entry) => dropUrl(entry.handle)}
          delayClass="delay-75"
        />
        <LinkList
          title={COLLECTIONS_MENU.shopTitle}
          entries={entries}
          to={(entry) => entry.path}
          delayClass="delay-150"
        />
        {/* The photo cards need the width; below impulse-lg the lists are enough. */}
        <ul
          className={cn(
            COLUMN_ENTER,
            'hidden w-full max-w-120 grid-cols-2 gap-5 justify-self-end delay-225 impulse-lg:grid'
          )}
        >
          {entries.map((entry) => {
            const media = MEDIA[entry.handle];
            if (!media) return null;
            return (
              <li key={entry.id} className="flex flex-col items-center">
                <NavigationMenuLink asChild className="w-full p-0">
                  <NavLink to={entry.path} prefetch="intent" tabIndex={-1} aria-hidden>
                    <Image
                      data={{ url: media.src, width: media.width, height: media.height }}
                      alt={media.alt}
                      sizes={CARD_SIZES}
                      className="w-full object-cover"
                    />
                  </NavLink>
                </NavigationMenuLink>
                <Cta to={entry.path} prefetch="intent" size="xs" className="mt-4">
                  {entry.title}
                </Cta>
              </li>
            );
          })}
        </ul>
      </Container>
    </NavigationMenuPrimitive.Content>
  </NavigationMenuItem>
);
