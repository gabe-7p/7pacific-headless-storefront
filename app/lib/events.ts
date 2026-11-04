/** What `isPlainActivation` reads, so a React or a native click event both fit. */
type ActivationEvent = {
  defaultPrevented: boolean;
  button: number;
  metaKey: boolean;
  altKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  currentTarget: EventTarget | null;
};

/**
 * Whether a link click is ours to handle client-side: a primary click, not
 * already prevented, no modifier key, and the link opens in this tab. Anything
 * else (a new tab, a new window, a download) belongs to the browser, so the
 * handler returns and the `href` stays in charge.
 *
 * `link` is the anchor when the handler is delegated from a parent (`Prose`);
 * a handler on the link itself leaves it to `currentTarget`.
 */
export const isPlainActivation = (
  event: ActivationEvent,
  link: Element | null = event.currentTarget instanceof Element ? event.currentTarget : null
): boolean => {
  const target = link?.getAttribute('target');
  return (
    !event.defaultPrevented &&
    event.button === 0 &&
    !event.metaKey &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    (!target || target === '_self') &&
    !link?.hasAttribute('download')
  );
};
