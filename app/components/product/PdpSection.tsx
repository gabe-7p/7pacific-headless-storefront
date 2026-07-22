import type { ReactNode } from 'react';

import { Container } from '~/components/common/Container';
import { cn } from '~/lib/cn';

/**
 * Dark full-width PDP content section (PRODUCT DETAILS, TECH STACK). Wraps its
 * children in the page Container with vertical padding.
 */
export const PdpSection = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <section className={cn('bg-carbon py-14 text-court md:py-20', className)}>
    <Container>{children}</Container>
  </section>
);
