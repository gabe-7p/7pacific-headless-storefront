import { redirect } from 'react-router';

import { discountLandingUrl, normalizeDiscountCode } from '~/lib/discountLinks';
import { applyDiscountCode } from '~/lib/discountLinks.server';
import { storefrontClientContext } from '~/lib/storefront';

import type { Route } from './+types/discount.$code';

/**
 * `/discount/<CODE>`: the creator link on our own domain (lib/discountLinks.ts).
 * Applies the code to the visitor's cart, then 302s to the landing page with
 * the link's UTMs and `creator_code`. Link-preview crawlers follow the
 * redirect and read the landing page's share tags. An unusable code skips the
 * cart and still lands the visitor.
 */
export async function loader({ context, params, request, url }: Route.LoaderArgs) {
  const code = normalizeDiscountCode(params.code);
  if (!code) return redirect('/', 302);

  const headers = await applyDiscountCode(context.get(storefrontClientContext), request, code);
  headers.set('Cache-Control', 'no-store');
  return redirect(discountLandingUrl(url, code), { status: 302, headers });
}
