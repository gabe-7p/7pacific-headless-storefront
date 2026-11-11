import { RouterContextProvider } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ANALYTICS_EVENT } from '~/lib/analytics/posthog.events';
import { posthogContext, type PostHogServerClient } from '~/lib/analytics/posthog.server';
import {
  INVALID_EMAIL_MESSAGE,
  REQUIRED_NAME_MESSAGE,
  SIGNUP_FAILED_MESSAGE,
  UNKNOWN_LIST_MESSAGE,
} from '~/lib/forms';
import { type OxygenBindings, oxygenContext } from '~/lib/oxygen';
import { saveSignup } from '~/lib/signups.server';
import { action } from '~/routes/api.subscribe';

vi.mock('~/lib/signups.server', () => ({ saveSignup: vi.fn() }));
const save = vi.mocked(saveSignup);

const capture = vi.fn();
const env = { PUBLIC_STORE_DOMAIN: 'test.myshopify.com' } as Env;

/** The router context server.ts builds, with a capture-only PostHog stub. */
const context = new RouterContextProvider();
context.set(posthogContext, { capture } as unknown as PostHogServerClient);
context.set(oxygenContext, { env } as OxygenBindings);

const post = (fields: Record<string, string>) => {
  const body = new FormData();
  for (const [key, value] of Object.entries(fields)) body.set(key, value);
  return new Request('http://localhost/api/subscribe', { method: 'POST', body });
};

const call = (request: Request) =>
  action({ request, context, params: {}, url: new URL(request.url), pattern: '/api/subscribe' });

beforeEach(() => {
  capture.mockClear();
  save.mockReset();
  save.mockResolvedValue({ ok: true });
});

describe('POST /api/subscribe', () => {
  it('confirms a valid newsletter signup and captures the event', async () => {
    const result = await call(
      post({ list: 'newsletter', name: 'Mason', email: 'mason@example.com' })
    );
    expect(result.data).toEqual({ ok: true });
    expect(result.init?.status).toBeUndefined();
    expect(capture).toHaveBeenCalledWith({ event: ANALYTICS_EVENT.newsletterSubscribed });
    expect(save).toHaveBeenCalledWith(env, {
      list: 'newsletter',
      email: 'mason@example.com',
      name: 'Mason',
    });
  });

  it('confirms a valid waitlist signup and captures the event', async () => {
    const result = await call(
      post({ list: 'waitlist', name: 'Mason', email: 'mason@example.com' })
    );
    expect(result.data).toEqual({ ok: true });
    expect(capture).toHaveBeenCalledWith({ event: ANALYTICS_EVENT.waitlistJoined });
    expect(save).toHaveBeenCalledWith(env, {
      list: 'waitlist',
      email: 'mason@example.com',
      name: 'Mason',
    });
  });

  it('reports a failed save on the form and skips the event', async () => {
    save.mockResolvedValue({ ok: false, reason: 'failed' });
    const result = await call(
      post({ list: 'waitlist', name: 'Mason', email: 'mason@example.com' })
    );
    expect(result.init?.status).toBe(502);
    expect(result.data).toEqual({ ok: false, errors: { list: SIGNUP_FAILED_MESSAGE } });
    expect(capture).not.toHaveBeenCalled();
  });

  it('shows an email Shopify rejects as an email error', async () => {
    save.mockResolvedValue({ ok: false, reason: 'invalid-email' });
    const result = await call(
      post({ list: 'newsletter', name: 'Mason', email: 'mason@example.c' })
    );
    expect(result.data).toEqual({ ok: false, errors: { email: INVALID_EMAIL_MESSAGE } });
  });

  it('rejects an invalid email with the email message', async () => {
    const result = await call(post({ list: 'newsletter', name: 'Mason', email: 'nope' }));
    expect(result.init?.status).toBe(400);
    expect(result.data).toEqual({ ok: false, errors: { email: INVALID_EMAIL_MESSAGE } });
    expect(capture).not.toHaveBeenCalled();
    expect(save).not.toHaveBeenCalled();
  });

  it.each(['waitlist', 'newsletter'])('requires a name on the %s', async (list) => {
    const blank = await call(post({ list, name: '  ', email: 'a@b.co' }));
    expect(blank.init?.status).toBe(400);
    expect(blank.data).toEqual({ ok: false, errors: { name: REQUIRED_NAME_MESSAGE } });

    const missing = await call(post({ list, email: 'a@b.co' }));
    expect(missing.data).toEqual({ ok: false, errors: { name: REQUIRED_NAME_MESSAGE } });
    expect(save).not.toHaveBeenCalled();
  });

  it('rejects an unknown list', async () => {
    const result = await call(post({ list: 'vip', email: 'a@b.co' }));
    expect(result.init?.status).toBe(400);
    expect(result.data).toEqual({ ok: false, errors: { list: UNKNOWN_LIST_MESSAGE } });
    expect(capture).not.toHaveBeenCalled();
  });

  it('answers a GET with 405', async () => {
    const result = await call(new Request('http://localhost/api/subscribe'));
    expect(result.init?.status).toBe(405);
    expect(result.data.ok).toBe(false);
    expect(capture).not.toHaveBeenCalled();
  });
});
