import { Image } from '@shopify/hydrogen';
import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import { BrandDialogContent, BrandDialogTitle } from '~/components/common/BrandDialog';
import { NewsletterForm } from '~/components/common/NewsletterForm';
import { Dialog, DialogDescription } from '~/components/ui/dialog';
import { BRAND } from '~/lib/brand';

/** The membership image the production popup uses (Shopify Files). */
const IMAGE = `${BRAND.filesCdn}/24_121_7pacific_019221_cropped2.png`;

type NewsletterDialogContextValue = { open: () => void };

const NewsletterDialogContext = createContext<NewsletterDialogContextValue | null>(null);

/**
 * The membership signup modal. `Cta` opens it for any CTA whose href is the
 * `#newsletter` marker, so the content files stay declarative and no callsite
 * wires up dialog state.
 *
 * Note this reinstates a signup outside the footer, which 7PA-241 had removed
 * on the "no interruption modals" rule. It is click-triggered only — nothing
 * opens on load or on exit intent — so it interrupts no one who didn't ask.
 */
export const NewsletterDialogProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const value = useMemo(() => ({ open }), [open]);

  return (
    <NewsletterDialogContext.Provider value={value}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {/* Production's two-up layout: image left, copy right. Carbon ground on
            the copy panel so the form's light-on-dark styling carries over from
            the footer unchanged. The image is hidden on phones, where a
            half-width crop would read as a sliver. */}
        <BrandDialogContent className="grid gap-0 overflow-hidden p-0 sm:max-w-3xl sm:grid-cols-2">
          <Image
            src={IMAGE}
            alt=""
            width={1372}
            height={1350}
            sizes="(min-width: 640px) 384px, 0px"
            className="hidden size-full object-cover sm:block"
          />
          <div className="p-8">
            <BrandDialogTitle>{BRAND.newsletter.heading}</BrandDialogTitle>
            <DialogDescription className="mt-3 text-sm text-support-night">
              {BRAND.newsletter.body}
            </DialogDescription>
            <NewsletterForm />
          </div>
        </BrandDialogContent>
      </Dialog>
    </NewsletterDialogContext.Provider>
  );
};

/** Returns null outside the provider so a CTA can fall back to a plain link. */
export const useNewsletterDialog = () => useContext(NewsletterDialogContext);
