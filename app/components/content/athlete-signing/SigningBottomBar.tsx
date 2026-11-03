import { Container } from '~/components/common/Container';
import { Logo } from '~/components/common/Logo';
import { SPEC_LINE_CLASS } from '~/components/common/SpecLine';
import type { AthleteSigningContent } from '~/content/athlete-signing';
import { cn } from '~/lib/cn';

export const SigningBottomBar = ({ chrome }: { chrome: AthleteSigningContent['chrome'] }) => (
  <footer className="border-t border-border-subtle-night">
    <Container className="flex flex-col items-center gap-2.5 py-8 text-center md:flex-row md:justify-between md:gap-4 md:py-6 md:text-left">
      <Logo tone="light" className="h-5" />
      <span className={cn(SPEC_LINE_CLASS, 'text-support-night')}>{chrome.designedLine}</span>
      <span className={cn(SPEC_LINE_CLASS, 'text-support-night')}>{chrome.existsLine}</span>
    </Container>
  </footer>
);
