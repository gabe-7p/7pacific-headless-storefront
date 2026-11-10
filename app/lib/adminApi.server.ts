/**
 * Server-only Shopify Admin API client — the one place the app holds Admin
 * credentials. Used for writes the Storefront API can't do (saving signups
 * as customers, lib/signups.server.ts).
 *
 * Auth is the client credentials grant: Shopify retired admin-created custom
 * apps, so the store's Admin access comes from a Dev Dashboard app (owned by
 * the same organization as the store and installed on it). Its client id and
 * secret mint a 24-hour token; we keep it for the life of the worker isolate
 * and mint a new one shortly before it expires. Setup: docs/architecture.md
 * (Environment & secrets).
 */

const ADMIN_API_VERSION = '2026-10';

/** Mint a new token this long before Shopify's expiry, so a request never races it. */
const EXPIRY_MARGIN_MS = 5 * 60 * 1000;

let cachedToken: { value: string; expiresAt: number } | undefined;

/** Thrown for missing credentials, a failed token exchange or a transport/GraphQL error. */
class AdminApiError extends Error {
  override name = 'AdminApiError';
}

const getAdminToken = async (env: Env): Promise<string> => {
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value;

  const clientId = env.PRIVATE_SHOPIFY_ADMIN_CLIENT_ID;
  const clientSecret = env.PRIVATE_SHOPIFY_ADMIN_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new AdminApiError(
      'PRIVATE_SHOPIFY_ADMIN_CLIENT_ID / PRIVATE_SHOPIFY_ADMIN_CLIENT_SECRET are not set'
    );
  }

  const response = await fetch(`https://${env.PUBLIC_STORE_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });
  if (!response.ok) {
    throw new AdminApiError(
      `Admin token exchange failed: ${response.status} ${await response.text()}`
    );
  }

  const { access_token: value, expires_in: expiresIn } = (await response.json()) as {
    access_token: string;
    expires_in: number;
  };
  cachedToken = { value, expiresAt: Date.now() + expiresIn * 1000 - EXPIRY_MARGIN_MS };
  return value;
};

/**
 * Run one Admin GraphQL document and return its `data`. Throws AdminApiError
 * on a transport failure or top-level GraphQL `errors`; mutation
 * `userErrors` are data, left to the caller.
 */
export const adminGraphql = async <Data>(
  env: Env,
  query: string,
  variables: Record<string, unknown>
): Promise<Data> => {
  const token = await getAdminToken(env);
  const response = await fetch(
    `https://${env.PUBLIC_STORE_DOMAIN}/admin/api/${ADMIN_API_VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({ query, variables }),
    }
  );
  // A revoked or rotated token: forget it so the next request mints a fresh one.
  if (response.status === 401) cachedToken = undefined;
  if (!response.ok) {
    throw new AdminApiError(`Admin API ${response.status}: ${await response.text()}`);
  }

  const { data, errors } = (await response.json()) as { data?: Data; errors?: unknown };
  if (errors || !data) throw new AdminApiError(`Admin API errors: ${JSON.stringify(errors)}`);
  return data;
};

/** Test seam: drop the cached token between cases. */
export const resetAdminTokenForTests = () => {
  cachedToken = undefined;
};
