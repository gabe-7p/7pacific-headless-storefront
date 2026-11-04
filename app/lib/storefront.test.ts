import { Cache } from '@shopify/hydrogen';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ROBOTS_QUERY } from '~/lib/robots';
import { queryStorefront, queryStorefrontOrThrow, type StorefrontClient } from '~/lib/storefront';

const clientReturning = (result: { data: unknown; errors?: unknown }) => {
  const graphql = vi.fn(async () => ({ headers: new Headers(), ...result }));
  return { client: { graphql } as unknown as StorefrontClient, graphql };
};

afterEach(() => vi.restoreAllMocks());

describe('queryStorefront', () => {
  it('returns data and passes the document and options through', async () => {
    const { client, graphql } = clientReturning({ data: { shop: { id: 'gid://shopify/Shop/1' } } });
    const options = { cache: Cache.long() };
    await expect(queryStorefront(client, ROBOTS_QUERY, options)).resolves.toEqual({
      shop: { id: 'gid://shopify/Shop/1' },
    });
    expect(graphql).toHaveBeenCalledWith(ROBOTS_QUERY, options);
  });

  it('logs GraphQL errors and still returns partial data', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const errors = [{ message: 'boom' }];
    const { client } = clientReturning({ data: { shop: { id: 'x' } }, errors });
    await expect(queryStorefront(client, ROBOTS_QUERY, { cache: Cache.long() })).resolves.toEqual({
      shop: { id: 'x' },
    });
    expect(error).toHaveBeenCalledWith(errors);
  });

  it('returns null when the API returned no data', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { client } = clientReturning({ data: null, errors: [{ message: 'down' }] });
    await expect(
      queryStorefront(client, ROBOTS_QUERY, { cache: Cache.long() })
    ).resolves.toBeNull();
  });
});

describe('queryStorefrontOrThrow', () => {
  it('returns data when present', async () => {
    const { client } = clientReturning({ data: { shop: { id: 'x' } } });
    await expect(
      queryStorefrontOrThrow(client, ROBOTS_QUERY, { cache: Cache.long() }, 'Missing')
    ).resolves.toEqual({ shop: { id: 'x' } });
  });

  it('throws a 404 Response with the message when data is null', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { client } = clientReturning({ data: null });
    const thrown = await queryStorefrontOrThrow(
      client,
      ROBOTS_QUERY,
      { cache: Cache.long() },
      'Missing'
    ).catch((error: unknown) => error);
    expect(thrown).toBeInstanceOf(Response);
    expect((thrown as Response).status).toBe(404);
    await expect((thrown as Response).text()).resolves.toBe('Missing');
  });
});
