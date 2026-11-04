import { RouterContextProvider } from 'react-router';
import { describe, expect, it } from 'vitest';

import {
  INVALID_EMAIL_MESSAGE,
  REQUIRED_MESSAGE_MESSAGE,
  REQUIRED_NAME_MESSAGE,
} from '~/lib/forms';
import { action } from '~/routes/pages.contact-us';

const post = (fields: Record<string, string>) => {
  const body = new FormData();
  for (const [key, value] of Object.entries(fields)) body.set(key, value);
  return new Request('http://localhost/pages/contact-us', { method: 'POST', body });
};

const call = (request: Request) =>
  action({
    request,
    context: new RouterContextProvider(),
    params: {},
    url: new URL(request.url),
    pattern: '/pages/contact-us',
  });

describe('POST /pages/contact-us', () => {
  it('confirms a valid message', async () => {
    const result = await call(post({ name: 'Mason', email: 'a@b.co', message: 'Hi' }));
    expect(result.data).toEqual({ ok: true });
    expect(result.init?.status).toBeUndefined();
  });

  it('reports every failed field with a 400', async () => {
    const result = await call(post({ name: ' ', email: 'nope', message: '' }));
    expect(result.init?.status).toBe(400);
    expect(result.data).toEqual({
      ok: false,
      errors: {
        name: REQUIRED_NAME_MESSAGE,
        email: INVALID_EMAIL_MESSAGE,
        message: REQUIRED_MESSAGE_MESSAGE,
      },
    });
  });

  it('reports only the failed field', async () => {
    const result = await call(post({ name: 'Mason', email: 'a@b.co', message: '' }));
    expect(result.data).toEqual({ ok: false, errors: { message: REQUIRED_MESSAGE_MESSAGE } });
  });

  it('answers a GET with 405', async () => {
    const result = await call(new Request('http://localhost/pages/contact-us'));
    expect(result.init?.status).toBe(405);
    expect(result.data.ok).toBe(false);
  });
});
