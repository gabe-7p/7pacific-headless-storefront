import { useEffect, useState } from 'react';

import { NewsletterForm } from '~/components/common/NewsletterForm';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '~/components/ui/dialog';
import { BRAND } from '~/lib/brand';

const DISMISSED_KEY = 'nl_popup_dismissed';
const IMAGE = `${BRAND.filesCdn}/24_121_7pacific_019221_cropped2.png`;

/**
 * Site-wide "Join the Membership" newsletter popup. Shows once per visitor
 * (gated by localStorage) a few seconds after load; reuses the /api/newsletter
 * fetcher submit. Mounted once in PageLayout.
 */
export const NewsletterPopup = () => {
  const [open, setOpen] = useState(false);
  const { heading, body } = BRAND.newsletter;

  const dismiss = () => {
    setOpen(false);
    try {
      localStorage.setItem(DISMISSED_KEY, '1');
    } catch {
      // ignore storage failures (private mode, etc.)
    }
  };

  // Show once, a short beat after load, if not previously dismissed.
  useEffect(() => {
    let seen = true;
    try {
      seen = localStorage.getItem(DISMISSED_KEY) !== null;
    } catch {
      seen = false;
    }
    if (seen) return;
    const timer = setTimeout(() => setOpen(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Don't re-nag after a successful signup.
  const persistDismissal = () => {
    try {
      localStorage.setItem(DISMISSED_KEY, '1');
    } catch {
      // ignore
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? setOpen(true) : dismiss())}>
      <DialogContent className="grid max-w-2xl gap-0 overflow-hidden p-0 sm:grid-cols-2">
        <img src={IMAGE} alt="" className="hidden h-full w-full object-cover sm:block" />
        <div className="p-8">
          <DialogTitle className="text-xl font-bold tracking-wide uppercase">{heading}</DialogTitle>
          <DialogDescription className="mt-3 text-sm text-neutral-600">{body}</DialogDescription>

          <NewsletterForm variant="popup" onSuccess={persistDismissal} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
