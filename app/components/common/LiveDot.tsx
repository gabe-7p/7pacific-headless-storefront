/**
 * Ember live-signal dot with the radar ping ("signal live") — the drop-page
 * eyebrow device. The ring expands out of the dot and dissolves; the dot
 * itself never moves, and the ring sits out under motion-reduce. Shared by
 * the FIRST LIGHT teaser and the BASELINE drop page so the accent-ration
 * exception (7PA-230) has one owner.
 */
export const LiveDot = () => (
  <span aria-hidden className="relative size-2.5 shrink-0">
    <span className="animate-radar-ping border-brand absolute inset-0 rounded-full border motion-reduce:hidden" />
    <span className="bg-brand absolute inset-0 rounded-full" />
  </span>
);
