import { useEffect, useState } from 'react';
import { useFetcher } from 'react-router';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '~/components/ui/dialog';
import { BRAND } from '~/lib/brand';
import type { NewsletterResponse } from '~/routes/api.newsletter';

const DISMISSED_KEY = 'nl_popup_dismissed';
const IMAGE =
  'https://cdn.shopify.com/s/files/1/0686/3988/3581/files/24_121_7pacific_019221_cropped2.png';

/**
 * Site-wide "Join the Membership" newsletter popup. Shows once per visitor
 * (gated by localStorage) a few seconds after load; reuses the /api/newsletter
 * fetcher submit. Mounted once in PageLayout.
 */
export const NewsletterPopup = () => {
  const [open, setOpen] = useState(false);
  const fetcher = useFetcher<NewsletterResponse>();
  const submitting = fetcher.state !== 'idle';
  const succeeded = fetcher.data?.ok === true;
  const { heading, body, placeholder, submitLabel, successMessage } = BRAND.newsletter;

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
  useEffect(() => {
    if (succeeded) {
      try {
        localStorage.setItem(DISMISSED_KEY, '1');
      } catch {
        // ignore
      }
    }
  }, [succeeded]);

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? setOpen(true) : dismiss())}>
      <DialogContent className="grid max-w-2xl gap-0 overflow-hidden p-0 sm:grid-cols-2">
        <img src={IMAGE} alt="" className="hidden h-full w-full object-cover sm:block" />
        <div className="p-8">
          <DialogTitle className="text-xl font-bold tracking-wide uppercase">{heading}</DialogTitle>
          <DialogDescription className="mt-3 text-sm text-neutral-600">{body}</DialogDescription>

          {succeeded ? (
            <p className="mt-6 text-sm font-medium">{successMessage}</p>
          ) : (
            <fetcher.Form method="post" action="/api/newsletter" className="mt-6">
              <label htmlFor="nl-popup-email" className="sr-only">
                {placeholder}
              </label>
              <input
                id="nl-popup-email"
                type="email"
                name="email"
                required
                autoCorrect="off"
                autoCapitalize="off"
                placeholder={placeholder}
                className="border-border-subtle w-full border bg-white px-4 py-3 text-sm focus:border-black focus:outline-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="bg-brand text-brand-text mt-3 w-full px-6 py-3 text-sm font-bold tracking-[0.15em] uppercase transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? 'Signing up…' : submitLabel}
              </button>
              {fetcher.data?.error && (
                <p className="mt-2 text-sm text-neutral-500">{fetcher.data.error}</p>
              )}
            </fetcher.Form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
