import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import { NewsletterForm } from '~/components/common/NewsletterForm';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '~/components/ui/dialog';
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
        {/* Width has to be set on the `sm:` variant: the primitive ships
            `sm:max-w-lg`, which a bare `max-w-*` can't override (different
            variant, so tailwind-merge keeps both and the sm one wins).
            rounded-[2px] is the brand radius live uses everywhere. */}
        <DialogContent className="bg-carbon text-chalk grid gap-0 overflow-hidden rounded-[2px] border-white/15 p-0 sm:max-w-3xl sm:grid-cols-2">
          <img
            src={IMAGE}
            alt=""
            width={1372}
            height={1350}
            className="hidden size-full object-cover sm:block"
          />
          <div className="p-8">
            <DialogTitle className="font-display tracking-header text-2xl font-medium uppercase">
              {BRAND.newsletter.heading}
            </DialogTitle>
            <DialogDescription className="mt-3 text-sm text-white/80">
              {BRAND.newsletter.body}
            </DialogDescription>
            <NewsletterForm />
          </div>
        </DialogContent>
      </Dialog>
    </NewsletterDialogContext.Provider>
  );
};

/** Returns null outside the provider so a CTA can fall back to a plain link. */
export const useNewsletterDialog = () => useContext(NewsletterDialogContext);
