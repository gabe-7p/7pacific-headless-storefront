import { cn } from '~/lib/cn';

export type EditionStatus = 'live' | 'soon' | 'archived';

const isEditionStatus = (value: string): value is EditionStatus =>
  value === 'live' || value === 'soon' || value === 'archived';

/**
 * The edition-number device (7PA-246): `ED. 01 · LIVE` — JetBrains Mono
 * Medium caps at +0.08em. Every status renders in Graphite — Ember is
 * rationed to one moment per page (7PA-230), and the tag never claims it.
 * Renders nothing without a number (the device is data-driven, never
 * invented).
 */
export const EditionTag = ({
  number,
  status,
  className,
}: {
  number?: string | null;
  status?: string | null;
  className?: string;
}) => {
  const parsed = Number.parseInt(number ?? '', 10);
  if (Number.isNaN(parsed)) return null;
  const normalized = status && isEditionStatus(status) ? status : null;
  const label = `ED. ${String(parsed).padStart(2, '0')}${normalized ? ` · ${normalized}` : ''}`;
  return (
    <span
      className={cn(
        'font-mono text-xs font-medium tracking-caps uppercase text-support',
        className
      )}
    >
      {label}
    </span>
  );
};
