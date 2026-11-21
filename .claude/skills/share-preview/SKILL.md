---
name: share-preview
description: Change the storefront's link-preview media: the og:image and og:video that iMessage, Instagram, Facebook, Slack and texts show when someone shares a 7pacificapparel.com link, a checkout.7pacificapparel.com link or a creator discount link. Use whenever the homepage share image or video, the share title or description, or Shopify's "Social sharing image" changes, or when a shared link previews the wrong (old) picture.
---

# Changing the share image and video

A shared link can be read by a crawler in **three different places**, and each holds its own copy of the share media. Change all three in one go, or links shared through one of them keep the old preview.

| #   | Where                                                                                                   | Serves                                                                                                                                                               | Changed by                                     |
| --- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| 1   | Hydrogen code: `HOME_META` in `app/content/home.ts`, still at `public/og-home.jpg`                      | `7pacificapparel.com/`, plus every link that redirects there (`/discount/<CODE>` creator links)                                                                      | a PR + deploy                                  |
| 2   | Online Store theme **"Hydrogen Redirect"** (theme id `189873389885`), `layout/theme.liquid`             | every `checkout.7pacificapparel.com/...` page, which includes Shopify's own discount **Share** links. Crawlers don't run its JS redirect, so they read this `<head>` | Shopify CLI push to the live theme (no deploy) |
| 3   | Shopify admin → **Online Store → Preferences** → Social sharing image, homepage title, meta description | the fallback Shopify injects when a theme has no `og:image`, and Shopify's own surfaces (Shop app, some feeds)                                                       | the admin UI, by hand                          |

History: on 2026-11-20 a creator's Shopify discount link previewed the 2025 battle-ropes photo. The Hydrogen site was right, but the link went through #2, which had no og tags, so Shopify filled in #3's old image.

## 0. Prepare the media

- **Image:** 1200×630 JPG, under ~300 KB. It goes in `public/`. Give it a **new filename** (e.g. `og-home-2027-03.jpg`). Every app caches previews by URL, so reusing `og-home.jpg` keeps showing the old picture for weeks.
- **Video:** landscape 1280×720 H.264 mp4, on **Shopify Files**, never in `public/`. Apple's player needs byte-range (206) responses, and Oxygen answers a `Range` request for a `public/` file with the whole body (200), so iMessage falls back to the still. Upload large files with a staged upload (`stagedUploadsCreate` → curl → `fileCreate`). Then read the media id and the `HD-720p-…` rendition name off the file's `sources`, which is what `shopifyVideo(id, rendition)` takes.
- Both are the same frame as the homepage hero, with the white lockup burned in (see the `HOME_META` comment). Re-render both together.

## 1. Hydrogen (code, PR)

1. Add the new still to `public/` and delete the old one.
2. In `app/content/home.ts`, update `HOME_META.ogImage` (absolute URL, built on `BRAND.siteUrl`) and `HOME_META.ogVideo` (`shopifyVideo(id, rendition)`, `width`, `height`).
3. If the title or description changes: the title is `HOME_META.title`, and the description is `BRAND.seo.defaultDescription` in `app/content/brand.ts` (it quotes the free-shipping threshold, so a threshold change is a share-text change too).
4. Update the `og-home.jpg` mention in `CLAUDE.md` (repo map, `public/`) if the filename changed.
5. `routes/_index.tsx` passes both through `buildMeta` (`app/lib/seo.ts`), so nothing else in the code needs to change.

Other pages set their own share image where they have one: journal articles (the article image), CMS pages (the first `<img>` in the body) and `/drops/first-light` (`FIRST_LIGHT.ogImage`). Products, collections, cart, Our Story, athlete pages and `/drops/baseline` currently set **no** `og:image`. That's a known gap, not part of this procedure.

## 2. The redirect theme (live theme, no deploy)

The claude.ai Shopify connector can't edit themes ("Insufficient scope"). Use the Shopify CLI bundled in the repo, which is already logged in to the store:

```bash
SHOPIFY=./node_modules/.bin/shopify
STORE=7pacific-7311.myshopify.com
DIR=<scratchpad>/redirect-theme   # outside the repo

$SHOPIFY theme pull --store $STORE --theme 189873389885 --path $DIR
```

1. Copy `$DIR` to a backup folder first: that's your rollback.
2. In `$DIR/layout/theme.liquid`, the block under the "Link previews" comment mirrors `HOME_META`. Update `og:image` + `og:image:secure_url` (+ width/height), the five `og:video*` tags, `twitter:image`, and the title/description tags if those changed. Use the same absolute URLs as step 1, so it must be the deployed filename.
3. Test on an unpublished copy, read as a crawler:

   ```bash
   $SHOPIFY theme push --store $STORE --unpublished --theme "Hydrogen Redirect (og test)" --path $DIR --json
   # note the new theme id from the JSON, then:
   curl -sL -c /tmp/sp.jar -b /tmp/sp.jar -A 'facebookexternalhit/1.1' \
     "https://checkout.7pacificapparel.com/?preview_theme_id=<test id>" \
     | grep -oE '<meta (property|name)="(og|twitter):[^>]+>'
   ```

   The page should report the test theme (`Shopify.theme` names it). Expect exactly one `og:image` (yours). When the theme sets its own, Shopify stops injecting #3's image.

4. Push only that file to the live theme, then delete the test copy:

   ```bash
   $SHOPIFY theme push --store $STORE --theme 189873389885 --only layout/theme.liquid --allow-live --path $DIR
   $SHOPIFY theme delete --store $STORE --theme <test id> --force
   ```

Don't touch the rest of `theme.liquid`: its script is the redirect to `7pacificapparel.com`, and it hands discount codes over as `?discount=` (see `docs/runbooks/creator-links.md`).

## 3. Shopify admin (by hand)

Online Store → Preferences:

- **Social sharing image** → upload the same 1200×630 still.
- **Title and meta description** → the same text as `HOME_META.title` and `BRAND.seo.defaultDescription`.

It's only a fallback while #2 has its own tags, but keep it current in case the theme is ever swapped or reset.

## 4. Verify, then refresh caches

After the PR has deployed:

```bash
UA='facebookexternalhit/1.1'
for u in https://7pacificapparel.com/ \
         https://checkout.7pacificapparel.com/ \
         'https://7pacificapparel.com/discount/TEST?utm_source=check'; do
  echo "== $u"; curl -sL -A "$UA" "$u" | grep -oE '<meta property="og:(image|video)"[^>]+>'
done
# the video must answer a range request with 206:
curl -s -o /dev/null -w '%{http_code}\n' -H 'Range: bytes=0-1' '<og:video url>'
```

All three should print the new image and video, and the range request should print `206`.

Then refresh the caches:

- **Facebook / Instagram / Messenger:** Facebook Sharing Debugger → paste each URL → **Scrape Again**.
- **iMessage:** there's no refresh. Only newly sent links get the new preview, which is another reason to use a new filename.
- **Slack:** paste the link once; a new URL gets a fresh preview.
