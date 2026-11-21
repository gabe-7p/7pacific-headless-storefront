import type { ReactNode } from 'react';

/**
 * The one element the app renders into `<body>`; root.tsx `Layout` wraps its
 * children in it. React 19 skips a node in `<body>` that it doesn't expect, but
 * only when the node's tag differs from the tag React expects next. Instagram's
 * iOS in-app browser can add a `<div>` to `<body>` before hydration; when the
 * page's first element was also a `<div>`, React claimed the foreign node,
 * failed hydration (minified error #418), re-rendered the page and deleted it.
 * No other script makes this custom tag, so React skips every foreign node.
 */
export const BodyRoot = ({ children }: { children?: ReactNode }) => (
  <storefront-root className="block">{children}</storefront-root>
);
