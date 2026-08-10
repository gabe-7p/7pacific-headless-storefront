import { WaitlistForm } from '~/components/home/WaitlistForm';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '~/components/ui/dialog';
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
    {/* Width must be overridden on the `sm:` variant — the primitive ships
        `sm:max-w-lg`, which a bare `max-w-*` can't beat in the merge.
        rounded-[2px] is the brand radius. */}
    <DialogContent className="bg-field-night text-ink-night rounded-[2px] border-border-subtle-night p-8 sm:max-w-md">
      <DialogTitle className="font-display tracking-header text-2xl font-medium uppercase">
        {HOME_DROP_TWO.waitlist.heading}
      </DialogTitle>
      <DialogDescription className="mt-3 text-sm text-support-night">
        {HOME_DROP_TWO.waitlist.body}
      </DialogDescription>
      <WaitlistForm />
    </DialogContent>
  </Dialog>
);
