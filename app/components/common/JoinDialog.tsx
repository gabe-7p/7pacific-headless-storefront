import { type ReactNode, useCallback, useMemo, useState } from 'react';

import { BrandDialogContent, BrandDialogTitle } from '~/components/common/BrandDialog';
import { Image } from '~/components/common/Image';
import { JoinForm } from '~/components/common/JoinForm';
import { JoinDialogContext } from '~/components/common/useJoinDialog';
import { Dialog, DialogDescription } from '~/components/ui/dialog';
import { JOIN_COPY, type JoinList } from '~/content/join';
import { IMAGE_SIZES } from '~/lib/imageSizes';
import { shopifyImage } from '~/lib/shopifyFiles';

/** The roster dialog's image (Shopify Files). */
const IMAGE = {
  src: shopifyImage('jahli_full_body_behind_in_gym.jpg', { v: 1793245833 }),
  width: 3580,
  height: 4000,
};

/**
 * The signup modal, one per list, opened through `useJoinDialog().open(list)`.
 * `Cta` opens the newsletter for any CTA whose href is the `#newsletter`
 * marker, so the content files stay declarative; the homepage Coming Soon
 * card opens the waitlist the same way.
 *
 * Note this reinstates a signup outside the footer, which 7PA-241 had removed
 * on the "no interruption modals" rule. It is click-triggered only — nothing
 * opens on load or on exit intent — so it interrupts no one who didn't ask.
 */
export const JoinDialogProvider = ({ children }: { children: ReactNode }) => {
  // The list stays set while the dialog closes so the exit fade doesn't flip
  // panels mid-animation.
  const [list, setList] = useState<JoinList>('newsletter');
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback((next: JoinList) => {
    setList(next);
    setIsOpen(true);
  }, []);
  const value = useMemo(() => ({ open }), [open]);

  return (
    <JoinDialogContext.Provider value={value}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {list === 'newsletter' ? <NewsletterPanel /> : <WaitlistPanel />}
      </Dialog>
    </JoinDialogContext.Provider>
  );
};

/**
 * Production's two-up layout: image left, copy right. Carbon ground on the
 * copy panel so the form's light-on-dark styling carries over from the
 * footer unchanged. The image is hidden on phones, where a half-width crop
 * would read as a sliver.
 */
const NewsletterPanel = () => {
  const copy = JOIN_COPY.newsletter;
  return (
    <BrandDialogContent className="grid gap-0 overflow-hidden p-0 sm:max-w-3xl sm:grid-cols-2">
      <Image
        src={IMAGE.src}
        alt=""
        width={IMAGE.width}
        height={IMAGE.height}
        sizes={IMAGE_SIZES.dialogPanel}
        className="hidden size-full object-cover sm:block"
      />
      <div className="p-8">
        <BrandDialogTitle>{copy.heading}</BrandDialogTitle>
        <DialogDescription className="mt-3 text-sm text-support-night">
          {copy.body}
        </DialogDescription>
        <JoinForm
          list="newsletter"
          copy={copy}
          submit="mail"
          className="mt-5"
          errorClassName="mt-2 text-sm text-support-night"
        />
      </div>
    </BrandDialogContent>
  );
};

/** The Drop 02 waitlist — a single dark panel with the name/email form. */
const WaitlistPanel = () => {
  const copy = JOIN_COPY.waitlist;
  return (
    <BrandDialogContent className="p-8 sm:max-w-md">
      <BrandDialogTitle>{copy.heading}</BrandDialogTitle>
      <DialogDescription className="mt-3 text-sm text-support-night">{copy.body}</DialogDescription>
      <JoinForm
        list="waitlist"
        copy={copy}
        withName
        noValidate
        className="mt-5 space-y-4"
        errorClassName="mt-1 text-xs text-support-night"
        ctaClassName="mt-2"
      />
    </BrandDialogContent>
  );
};
