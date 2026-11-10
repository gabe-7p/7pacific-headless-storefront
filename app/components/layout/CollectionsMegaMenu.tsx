import { ChevronDownIcon } from 'lucide-react';
import { NavigationMenu as NavigationMenuPrimitive } from 'radix-ui';
import { type ReactElement, useId, useState } from 'react';
import { NavLink } from 'react-router';

import { Container } from '~/components/common/Container';
import { Cta } from '~/components/common/Cta';
import { Image } from '~/components/common/Image';
import { SpecLine } from '~/components/common/SpecLine';
import {
  type HeaderMenuItem,
  MOBILE_ROW_CLASS,
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

/** Desktop: 2-up in a column capped at 30rem, from impulse-lg. */
const DESKTOP_CARD_SIZES = '(min-width: 1025px) 15rem, 0px';
/** Drawer: 2-up across the 350px (450px from sm) drawer, mobile only. */
const MOBILE_CARD_SIZES = '(min-width: 769px) 0px, (min-width: 640px) 13rem, 10rem';

/**
 * Each column slides in from the left a beat after the one before it, on top
 * of the panel's own slide. `fill-mode-both` holds the start frame through
 * the delay.
 */
const COLUMN_ENTER =
  'animate-in fade-in-0 slide-in-from-left-4 duration-500 ease-(--ease-brand) fill-mode-both motion-reduce:animate-none';

/**
 * How a link joins its surface. Desktop wraps it in `NavigationMenuLink` (so
 * a click counts as a menu selection and closes the panel); the drawer leaves
 * it bare and closes itself through `onNavigate`.
 */
type SectionProps = {
  entries: Array<CollectionEntry>;
  wrap: (link: ReactElement) => ReactElement;
  onNavigate?: () => void;
  className?: string;
};

const LinkList = ({
  title,
  to,
  entries,
  wrap,
  onNavigate,
  className,
}: SectionProps & { title: string; to: (entry: CollectionEntry) => string }) => (
  <div className={className}>
    <SpecLine className="text-support">{title}</SpecLine>
    <ul className="mt-4 flex flex-col gap-1">
      {entries.map((entry) => (
        <li key={entry.id}>
          {wrap(
            <NavLink
              end
              prefetch="intent"
              to={to(entry)}
              onClick={onNavigate}
              className={cn(NAV_LABEL_CLASS, 'px-0 py-1.5 text-base whitespace-nowrap')}
            >
              {entry.title}
            </NavLink>
          )}
        </li>
      ))}
    </ul>
  </div>
);

/** One photo per collection (those with a `media` entry), a Cta to the grid under each. */
const PhotoCards = ({
  entries,
  wrap,
  onNavigate,
  className,
  sizes,
}: SectionProps & { sizes: string }) => (
  <ul className={cn('grid grid-cols-2 gap-5', className)}>
    {entries.map((entry) => {
      const media = MEDIA[entry.handle];
      if (!media) return null;
      return (
        <li key={entry.id} className="flex flex-col items-center">
          {/* The Cta below is the accessible link; the photo is a pointer-only twin. */}
          {wrap(
            <NavLink
              to={entry.path}
              prefetch="intent"
              tabIndex={-1}
              aria-hidden
              onClick={onNavigate}
              className="w-full p-0"
            >
              <Image
                data={{ url: media.src, width: media.width, height: media.height }}
                alt={media.alt}
                sizes={sizes}
                // One card shape whatever the file's ratio (the First Light
                // photo is 4259×5511); top-anchored so heads stay in frame.
                aspectRatio="4/5"
                crop="top"
                className="w-full object-cover"
              />
            </NavLink>
          )}
          <Cta to={entry.path} prefetch="intent" size="xs" className="mt-4" onClick={onNavigate}>
            {entry.title}
          </Cta>
        </li>
      );
    })}
  </ul>
);

const wrapDesktop = (link: ReactElement) => <NavigationMenuLink asChild>{link}</NavigationMenuLink>;
const wrapBare = (link: ReactElement) => link;

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
          to={(entry) => dropUrl(entry.handle)}
          entries={entries}
          wrap={wrapDesktop}
          className={cn(COLUMN_ENTER, 'delay-75')}
        />
        <LinkList
          title={COLLECTIONS_MENU.shopTitle}
          to={(entry) => entry.path}
          entries={entries}
          wrap={wrapDesktop}
          className={cn(COLUMN_ENTER, 'delay-150')}
        />
        {/* The photo cards need the width; below impulse-lg the lists are enough. */}
        <PhotoCards
          entries={entries}
          wrap={wrapDesktop}
          sizes={DESKTOP_CARD_SIZES}
          className={cn(
            COLUMN_ENTER,
            'hidden w-full max-w-120 justify-self-end delay-225 impulse-lg:grid'
          )}
        />
      </Container>
    </NavigationMenuPrimitive.Content>
  </NavigationMenuItem>
);

/**
 * The same three sections in the mobile drawer, stacked: the item's title is a
 * disclosure row (chevron, `aria-expanded`) that opens Explore, Shop and the
 * photo cards beneath it. Hand-built rather than an accordion primitive: one
 * button toggling one region needs no roving focus or keyboard model. The
 * height animates through `grid-rows` 0fr → 1fr, and `inert` keeps the closed
 * region's links out of the tab order.
 */
export const CollectionsMobileGroup = ({
  item,
  entries,
  onNavigate,
}: {
  item: HeaderMenuItem;
  entries: Array<CollectionEntry>;
  onNavigate: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const regionId = useId();
  return (
    <div className="flex flex-col">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={regionId}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          MOBILE_ROW_CLASS,
          'flex cursor-pointer items-center justify-between text-left'
        )}
      >
        {item.title}
        <ChevronDownIcon
          aria-hidden
          className={cn(
            'size-4 transition-transform duration-300 ease-(--ease-brand) motion-reduce:transition-none',
            open && 'rotate-180'
          )}
        />
      </button>
      <div
        id={regionId}
        inert={!open}
        className={cn(
          'grid transition-[grid-template-rows] duration-300 ease-(--ease-brand) motion-reduce:transition-none',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden">
          <div className="border-border-subtle flex flex-col gap-8 border-b px-5 py-6">
            <LinkList
              title={COLLECTIONS_MENU.exploreTitle}
              to={(entry) => dropUrl(entry.handle)}
              entries={entries}
              wrap={wrapBare}
              onNavigate={onNavigate}
            />
            <LinkList
              title={COLLECTIONS_MENU.shopTitle}
              to={(entry) => entry.path}
              entries={entries}
              wrap={wrapBare}
              onNavigate={onNavigate}
            />
            <PhotoCards
              entries={entries}
              wrap={wrapBare}
              onNavigate={onNavigate}
              sizes={MOBILE_CARD_SIZES}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
