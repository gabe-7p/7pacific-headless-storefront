import { BrandDialogContent, BrandDialogTitle } from '~/components/common/BrandDialog';
import { WaitlistForm } from '~/components/common/WaitlistForm';
import { Dialog, DialogDescription } from '~/components/ui/dialog';
import { HOME_DROP_TWO } from '~/content/home';

/**
 * The Drop 02 waitlist modal — a single dark panel with the name/email form,
 * opened only by the homepage Coming Soon card, so it's a controlled dialog
 * with local state at the callsite (no provider, unlike `NewsletterDialog`).
 * Click-triggered only, per the no-interruption-modals rule.
 */
export const WaitlistDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <BrandDialogContent className="p-8 sm:max-w-md">
      <BrandDialogTitle>{HOME_DROP_TWO.waitlist.heading}</BrandDialogTitle>
      <DialogDescription className="mt-3 text-sm text-support-night">
        {HOME_DROP_TWO.waitlist.body}
      </DialogDescription>
      {/* Night-tier underline fields — the footer/newsletter input recipe. */}
      <WaitlistForm
        copy={HOME_DROP_TWO.waitlist}
        className="mt-5 space-y-4"
        fieldClassName="w-full rounded-none border-0 border-b border-border-subtle bg-transparent px-0 py-2 text-ink-night placeholder:text-support-night focus:border-ink-night focus:outline-none"
        errorClassName="mt-1 text-xs text-support-night"
        ctaClassName="mt-2"
      />
    </BrandDialogContent>
  </Dialog>
);
