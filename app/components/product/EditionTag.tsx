import { cn } from '~/lib/cn';

export type EditionStatus = 'live' | 'soon' | 'archived';

/**
 * Status colors per the guidelines' edition-number spec: Ember when LIVE,
 * Fog when SOON, Carbon at 60% when ARCHIVED. Ember is rationed to one
 * moment per page (7PA-230), so LIVE renders Fog unless the surface opts in
 * via `accent` (e.g. a drop-archive row with no other Ember on the page).
 */
const STATUS_CLASS: Record<EditionStatus, string> = {
  live: 'text-graphite',
  soon: 'text-graphite',
  archived: 'text-graphite',
};

const isEditionStatus = (value: string): value is EditionStatus =>
  value === 'live' || value === 'soon' || value === 'archived';

/**
 * The edition-number device (7PA-246): `ED. 01 · LIVE` — JetBrains Mono
 * Medium caps at +0.08em, colored by status. Renders nothing without a
 * number (the device is data-driven, never invented).
 */
export const EditionTag = ({
  number,
  status,
  accent = false,
  className,
}: {
  number?: string | null;
  status?: string | null;
  accent?: boolean;
  className?: string;
}) => {
  const parsed = Number.parseInt(number ?? '', 10);
  if (Number.isNaN(parsed)) return null;
  const normalized = status && isEditionStatus(status) ? status : null;
  const label = `ED. ${String(parsed).padStart(2, '0')}${normalized ? ` · ${normalized}` : ''}`;
  return (
    <span
      className={cn(
        'font-mono text-xs font-medium tracking-caps uppercase',
        normalized ? STATUS_CLASS[normalized] : 'text-graphite',
        accent && normalized === 'live' && 'text-brand',
        className
      )}
    >
      {label}
    </span>
  );
};
