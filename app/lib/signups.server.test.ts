import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { resetAdminTokenForTests } from '~/lib/adminApi.server';
import { saveSignup } from '~/lib/signups.server';

const env = {
  PUBLIC_STORE_DOMAIN: 'test.myshopify.com',
  PRIVATE_SHOPIFY_ADMIN_CLIENT_ID: 'id',
  PRIVATE_SHOPIFY_ADMIN_CLIENT_SECRET: 'secret',
} as Env;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const token = () => json({ access_token: 'tok', scope: 'write_customers', expires_in: 86399 });

/** Stubs fetch with responses in call order; returns the mock to inspect calls. */
const stubFetch = (...responses: Array<Response>) => {
  const fetchMock = vi.fn<typeof fetch>();
  for (const response of responses) fetchMock.mockResolvedValueOnce(response);
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

/** The GraphQL `variables` of the nth fetch call. */
const variablesOf = (fetchMock: ReturnType<typeof stubFetch>, call: number) =>
  (JSON.parse(String(fetchMock.mock.calls[call]?.[1]?.body)) as { variables: unknown }).variables;

beforeEach(() => {
  resetAdminTokenForTests();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('saveSignup', () => {
  it('creates a new customer, subscribed and tagged, with the name split', async () => {
    const fetchMock = stubFetch(
      token(),
      json({ data: { customerByIdentifier: null } }),
      json({
        data: { customerCreate: { customer: { id: 'gid://shopify/Customer/1' }, userErrors: [] } },
      })
    );

    const result = await saveSignup(env, {
      list: 'waitlist',
      email: 'mason@example.com',
      name: 'Mason Van Reyes',
    });

    expect(result).toEqual({ ok: true });
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      'https://test.myshopify.com/admin/oauth/access_token'
    );
    expect(fetchMock.mock.calls[1]?.[1]?.headers).toMatchObject({
      'X-Shopify-Access-Token': 'tok',
    });
    expect(variablesOf(fetchMock, 2)).toEqual({
      input: {
        email: 'mason@example.com',
        firstName: 'Mason',
        lastName: 'Van Reyes',
        tags: ['first-light-waitlist', 'prospect'],
        emailMarketingConsent: {
          marketingState: 'SUBSCRIBED',
          marketingOptInLevel: 'SINGLE_OPT_IN',
        },
      },
    });
  });

  it('tags and subscribes a known customer without touching its name', async () => {
    const fetchMock = stubFetch(
      token(),
      json({
        data: {
          customerByIdentifier: {
            id: 'gid://shopify/Customer/7',
            firstName: 'Mason',
            lastName: 'Reyes',
          },
        },
      }),
      json({
        data: {
          tagsAdd: { userErrors: [] },
          customerEmailMarketingConsentUpdate: { userErrors: [] },
        },
      })
    );

    const result = await saveSignup(env, {
      list: 'newsletter',
      email: 'mason@example.com',
      name: 'M',
    });

    expect(result).toEqual({ ok: true });
    expect(variablesOf(fetchMock, 2)).toEqual({
      id: 'gid://shopify/Customer/7',
      tags: ['newsletter'],
      consent: {
        customerId: 'gid://shopify/Customer/7',
        emailMarketingConsent: {
          marketingState: 'SUBSCRIBED',
          marketingOptInLevel: 'SINGLE_OPT_IN',
        },
      },
      profile: { id: 'gid://shopify/Customer/7', firstName: 'M' },
      fillName: false,
    });
  });

  it('gives a known customer with no name the signup name', async () => {
    const fetchMock = stubFetch(
      token(),
      json({
        data: {
          customerByIdentifier: { id: 'gid://shopify/Customer/7', firstName: null, lastName: null },
        },
      }),
      json({
        data: {
          tagsAdd: { userErrors: [] },
          customerEmailMarketingConsentUpdate: { userErrors: [] },
          customerUpdate: { userErrors: [] },
        },
      })
    );

    const result = await saveSignup(env, {
      list: 'waitlist',
      email: 'mason@example.com',
      name: 'Mason Reyes',
    });

    expect(result).toEqual({ ok: true });
    expect(variablesOf(fetchMock, 2)).toMatchObject({
      profile: { id: 'gid://shopify/Customer/7', firstName: 'Mason', lastName: 'Reyes' },
      fillName: true,
    });
  });

  it('reuses the minted token on the next signup', async () => {
    const fetchMock = stubFetch(
      token(),
      json({ data: { customerByIdentifier: { id: 'gid://shopify/Customer/7' } } }),
      json({
        data: {
          tagsAdd: { userErrors: [] },
          customerEmailMarketingConsentUpdate: { userErrors: [] },
        },
      }),
      json({ data: { customerByIdentifier: { id: 'gid://shopify/Customer/7' } } }),
      json({
        data: {
          tagsAdd: { userErrors: [] },
          customerEmailMarketingConsentUpdate: { userErrors: [] },
        },
      })
    );

    await saveSignup(env, { list: 'newsletter', email: 'mason@example.com', name: 'Mason' });
    await saveSignup(env, { list: 'waitlist', email: 'mason@example.com', name: 'Mason' });

    const tokenCalls = fetchMock.mock.calls.filter(([url]) =>
      String(url).endsWith('/access_token')
    );
    expect(tokenCalls).toHaveLength(1);
  });

  it('reports an email Shopify rejects as invalid-email', async () => {
    stubFetch(
      token(),
      json({ data: { customerByIdentifier: null } }),
      json({
        data: {
          customerCreate: {
            customer: null,
            userErrors: [{ field: ['email'], message: 'Email is invalid' }],
          },
        },
      })
    );

    const result = await saveSignup(env, {
      list: 'newsletter',
      email: 'mason@example.c',
      name: 'Mason',
    });
    expect(result).toEqual({ ok: false, reason: 'invalid-email' });
  });

  it('fails without credentials, without calling Shopify', async () => {
    const fetchMock = stubFetch();
    const result = await saveSignup({ PUBLIC_STORE_DOMAIN: 'test.myshopify.com' } as Env, {
      list: 'newsletter',
      email: 'mason@example.com',
      name: 'Mason',
    });
    expect(result).toEqual({ ok: false, reason: 'failed' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('fails on a rejected token exchange or GraphQL errors', async () => {
    stubFetch(json({ error: 'shop_not_permitted' }, 400));
    expect(await saveSignup(env, { list: 'newsletter', email: 'a@b.co', name: 'A' })).toEqual({
      ok: false,
      reason: 'failed',
    });

    stubFetch(token(), json({ errors: [{ message: 'Access denied for customerByIdentifier' }] }));
    expect(await saveSignup(env, { list: 'newsletter', email: 'a@b.co', name: 'A' })).toEqual({
      ok: false,
      reason: 'failed',
    });
  });
});
