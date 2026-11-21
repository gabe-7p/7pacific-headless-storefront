# Creator discount links

A creator's link is `https://7pacificapparel.com/discount/<CODE>`. It puts the code on the
visitor's cart and lands them on the site with tracking tags attached, so you can report
visits and sales per creator. No deploy is needed for a new creator: create the discount
in Shopify and share the link.

## Make a link

1. Shopify admin → **Discounts** → create the code (e.g. `DAKOTAH15`).
2. Share `https://7pacificapparel.com/discount/DAKOTAH15`, optionally with:
   - `?redirect=/products/<handle>` (or any other path on the site) to land on a page other
     than the homepage;
   - your own `utm_source` / `utm_medium` / `utm_campaign` / `utm_content`. A link without
     a `utm_source` gets `utm_source=creator&utm_medium=discount_link&utm_campaign=<code>`.

Example: `https://7pacificapparel.com/discount/DAKOTAH15?redirect=/collections/shop&utm_source=instagram&utm_content=dakotah-riemer`

Shopify's own **Share** button still builds a `checkout.7pacificapparel.com/discount/…` link.
That one works too: the Online Store redirect theme hands the visitor to the site with
`?discount=<CODE>`, and the root middleware sends that through the same route. Prefer
the `7pacificapparel.com` link, since it skips a redirect.

## What happens

`routes/discount.$code.tsx` → `lib/discountLinks.server.ts` adds the code to the visitor's
cart, creating a cart if they have none, then 302s to the landing page with the link's UTMs
and `creator_code=<CODE>` (`lib/discountLinks.ts`). On a cart with no items, Shopify reports
the code as not applicable and the drawer hides it. Once a product it covers is added, it
applies and shows in the drawer and at checkout. Link previews (iMessage, Instagram,
Slack) follow the redirect and show the landing page's share image and video.

## Reports

**Shopify** (the record for sales):

- Orders: filter by the discount code. **Analytics → Reports → Sales by discount**
  gives orders and revenue per code.
- Visits: Shopify's sessions reports see the landing URL, so the UTM and landing-page
  breakdowns (e.g. `utm_content=dakotah-riemer`, or landing pages containing
  `creator_code=DAKOTAH15`) count each creator's visits.

**PostHog** (the browsing funnel; consent-gated, so EU/UK visitors who decline don't appear):

- `creator_link_opened` fires once per landing, with `creator_code`, `landing_path` and
  the `utm_*` tags. Break down by `creator_code` for visits per creator.
- After that, every event from that visitor carries the `creator_code` super property
  (the newest creator link wins). A funnel of `creator_link_opened` →
  `product_added_to_cart` → `checkout_started`, broken down by `creator_code`, shows how
  far each creator's audience gets.
- PostHog doesn't see orders (checkout runs on Shopify), so take sales figures from Shopify.
