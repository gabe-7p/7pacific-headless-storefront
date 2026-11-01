import { Link } from 'react-router';

import { Container } from '~/components/common/Container';
import { Logo } from '~/components/common/Logo';
import type { AthleteSigningContent } from '~/content/athlete-signing';
import { BRAND } from '~/content/brand';
import { cn } from '~/lib/cn';

import { MONO_LABEL } from './monoLabel';

export const SigningTopBar = ({ chrome }: { chrome: AthleteSigningContent['chrome'] }) => (
  <header className="border-b border-border-subtle-night">
    {/* h-(--header-h) is deliberate: the page opts out of site chrome but its
        bar tracks the site header's height so the two never drift. */}
    <Container className="flex h-(--header-h) items-center justify-between gap-4">
      <Link prefetch="intent" to="/" aria-label={BRAND.name}>
        <Logo tone="light" className="h-5 md:h-6" />
      </Link>
      <span className={cn(MONO_LABEL, 'text-support-night max-md:hidden')}>{chrome.badge}</span>
      <span className={cn(MONO_LABEL, 'flex items-center gap-2 text-ink-night')}>
        <span
          aria-hidden
          className="bg-brand size-1.5 animate-pulse rounded-full motion-reduce:animate-none"
        />
        {chrome.privacy} · {chrome.edition}
      </span>
    </Container>
    <Container className="border-t border-border-subtle-night py-3 md:hidden">
      <span className={cn(MONO_LABEL, 'text-support-night flex items-center gap-2.5')}>
        <span aria-hidden className="border-border-subtle/60 size-2.5 border" />
        {chrome.urlLine}
      </span>
    </Container>
  </header>
);
