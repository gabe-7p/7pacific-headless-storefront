import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import { NewsletterForm } from '~/components/common/NewsletterForm';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '~/components/ui/dialog';
import { BRAND } from '~/lib/brand';

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
        {/* Carbon ground so the form's light-on-dark styling carries over from
            the footer unchanged. */}
        <DialogContent className="bg-carbon text-chalk border-white/15 sm:max-w-md">
          <DialogTitle className="font-display tracking-header text-2xl font-medium uppercase">
            {BRAND.newsletter.heading}
          </DialogTitle>
          <DialogDescription className="text-sm text-white/80">
            {BRAND.newsletter.body}
          </DialogDescription>
          <NewsletterForm />
        </DialogContent>
      </Dialog>
    </NewsletterDialogContext.Provider>
  );
};

/** Returns null outside the provider so a CTA can fall back to a plain link. */
export const useNewsletterDialog = () => useContext(NewsletterDialogContext);
