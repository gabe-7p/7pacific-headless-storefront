// @vitest-environment jsdom
import { render } from '@testing-library/react';
import { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { MetaPixelBridge as MetaPixelBridgeComponent } from '~/components/analytics/Trackers';
import { NonceProvider } from '~/lib/nonce';

describe('MetaPixelBridge', () => {
  let addDestination: ReturnType<typeof vi.fn>;
  let MetaPixelBridge: typeof MetaPixelBridgeComponent;

  beforeEach(async () => {
    vi.resetModules();
    addDestination = vi.fn(() => () => {});
    window.Shopify = {
      analytics: { addDestination, publish: vi.fn(), getConfig: vi.fn() },
    } as never;
    ({ MetaPixelBridge } = await import('~/components/analytics/Trackers'));
  });

  afterEach(() => {
    delete (window as { Shopify?: unknown }).Shopify;
  });

  it('adds no destination when the pixel is off', () => {
    render(
      <NonceProvider value="abc">
        <MetaPixelBridge pixelId={null} />
      </NonceProvider>
    );
    expect(addDestination).not.toHaveBeenCalled();
  });

  it('adds the destination once, even under Strict Mode', () => {
    render(
      <StrictMode>
        <NonceProvider value="abc">
          <MetaPixelBridge pixelId="123" />
        </NonceProvider>
      </StrictMode>
    );
    expect(addDestination).toHaveBeenCalledTimes(1);
    expect(addDestination.mock.calls[0]?.[0]).toMatchObject({ name: 'meta-pixel' });
  });
});
