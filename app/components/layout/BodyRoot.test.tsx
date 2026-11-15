// @vitest-environment jsdom
import { act, type ReactNode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { BodyRoot } from '~/components/layout/BodyRoot';

/** The shape of root.tsx `Layout`: the page starts with a `<div>` (PageLayout's sticky topbar). */
const Doc = ({ wrap }: { wrap: boolean }) => {
  const page: ReactNode = (
    <>
      <div className="sticky">header</div>
      <main>page</main>
    </>
  );
  return (
    <html lang="en">
      <head />
      <body>{wrap ? <BodyRoot>{page}</BodyRoot> : page}</body>
    </html>
  );
};

/** Serve the SSR markup, add a foreign `<div>` to the top of `<body>`, then hydrate. */
const hydrateWithForeignDiv = async (wrap: boolean) => {
  const html = renderToString(<Doc wrap={wrap} />);
  document.documentElement.innerHTML = html.replace(
    /^(<!DOCTYPE html>)?<html[^>]*>|<\/html>$/g,
    ''
  );
  const foreign = document.createElement('div');
  document.body.prepend(foreign);

  const onRecoverableError = vi.fn();
  await act(async () => {
    hydrateRoot(document, <Doc wrap={wrap} />, { onRecoverableError });
  });
  return { foreign, onRecoverableError };
};

beforeAll(() => {
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
});

afterEach(() => {
  document.documentElement.innerHTML = '<head></head><body></body>';
});

describe('BodyRoot', () => {
  it('hydrates when a script added a <div> to <body> first', async () => {
    const { foreign, onRecoverableError } = await hydrateWithForeignDiv(true);

    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(foreign.isConnected).toBe(true);
    expect(document.querySelector('storefront-root')?.className).toBe('block');
  });

  it('is what prevents the mismatch: without it React claims the foreign <div>', async () => {
    const { foreign, onRecoverableError } = await hydrateWithForeignDiv(false);

    expect(onRecoverableError).toHaveBeenCalledOnce();
    expect(String(onRecoverableError.mock.calls[0]?.[0])).toContain('Hydration failed');
    expect(foreign.isConnected).toBe(false);
  });
});
