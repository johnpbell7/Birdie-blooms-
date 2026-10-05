# Birdie Blooms

The website for Birdie Blooms, a one-woman seasonal flower studio. It is a fast, static site: plain HTML, CSS and JavaScript with no build step. GSAP handles the motion.

The look is **Studio**: bold and certain rather than light and airy. Her photos run full-bleed with the logo huge across them, sections are solid blocks of colour, one sturdy serif is used big everywhere, labels are bold capitals, and chunky ink drawings draw themselves as you scroll. It was chosen from the design directions in [`directions/`](directions/index.html). The research behind the site is in [`docs/research.md`](docs/research.md). It covers 11 independent florists and includes their fonts, price ladders, forms and tone of voice.

## Pages

| Page | What's on it |
|---|---|
| `index.html` | Full-screen hero (her photo with the logo big across it and "Flowers for big days, and Tuesdays."), a pastel intro with what's in season, flowers-to-send and weddings collages, The First Edit on the season's colour, ways to send, the Birdie Card, subscriptions, a full-bleed weddings band, the studio notebook, meet the florist, and an Instagram strip linking to her posts |
| `shop.html` | The First Edit, then the wider range with size and price pickers and filters, a basket, subscription tiers, and how delivery works |
| `weddings.html` | Approach, three packages, an à la carte price guide, a pinned 4-step process, events, FAQ, and a full wedding enquiry form |
| `about.html` | The founder's story, "clear rules" sustainability bento, and a week in the studio |
| `contact.html` | General enquiry form, contact details, studio hours and FAQ |
| `policies.html` | Delivery, substitutions, flower care, refunds, wedding terms, privacy and terms |
| `seasons.html` | Through the seasons: the four seasonal looks, what's in bloom in each, and buttons to preview the site in any season |
| `404.html` | Branded not-found page |

## Run it locally

```bash
python3 serve.py
```

- Site: http://localhost:4190/index.html
- Visual style sheet: http://localhost:4190/styleguide/
- The Studio direction: http://localhost:4190/directions/studio.html

It uses port 4190 so it doesn't collide with other local projects. If that port is busy, run `PORT=4191 python3 serve.py`.

## Change the look: `styleguide/tokens.css`

Every colour, font, size, radius, spacing value and motion duration lives in `styleguide/tokens.css`, and every page reads from it. You have two ways to change them:

- Edit the file by hand.
- Open `/styleguide/` and use the visual editor. It shows the real site live on the right, and **Save to tokens.css** writes your changes back.

Current look (Studio):
- **Newsreader** for headings and reading text: one sturdy serif, used big.
- **Josefin Sans** in bold capitals for labels, buttons and small print. It's the font in her logo tagline.
- Warm paper (`#fbf7f0`), chocolate ink (`#2b1a16`), butter (`#f4e4a4`) and stone (`#ece6dc`) blocks, 2px ink lines and hard ink shadows on cards.
- A **seasonal bloom colour** for the big solid blocks, plus a matching pastel (see below). `tokens.css` holds the autumn values.

## Seasons: colours that follow the flowers

The site changes its colours by date, four times a year:

| Season | Dates | Flowers | Bloom | Tint | Accent |
|---|---|---|---|---|---|
| Winter | 1 Dec – end Feb | Amaryllis & hellebores | berry `#a8313c` | rose `#f1e2e4` | plum `#5a2b4b` |
| Spring | 1 Mar – 31 May | Tulips & narcissi | tulip pink `#e8879f` | blossom `#fbe5ea` | tulip `#a8385a` |
| Summer | 1 Jun – 31 Aug | Sweet peas & cornflowers | cornflower `#3f62c6` | sky `#e3e9f8` | navy `#34529c` |
| Autumn | 1 Sep – 30 Nov | Dahlias & amaranth | dahlia `#e0662c` | peach `#f7e2d0` | amaranth `#7a2431` |

Each season changes all of these:
- the **bloom** colour: the solid block behind The First Edit (on the homepage and in the shop), the Birdie Card stamps, the season dots and the featured subscription
- the **text on bloom** (`--c-on-bloom`): ink on the light blooms, paper on the dark ones
- the **tint**: the pastel blocks (the homepage intro, page headers, meet the florist)
- the **accent**: link hovers and small touches
- the **homepage photo**
- the **tab icon** (`assets/img/favicon-*.svg`)
- the **"in season now" flower list**
- the close-up colour textures on **Through the seasons** (`assets/img/season-*.webp`)

**See it in any season.** Every page has a season switcher in the footer, and the homepage has one in its intro, under "In season now". Pick Winter, Spring, Summer or Autumn and the whole site cross-fades into that season's colours, photos and flower lists. Nothing reloads. "now" marks today's season.
- The choice follows you from page to page.
- A "Back to today" chip resets it.
- It lasts only for that browser tab, so every new visitor sees the real season.

How it works:
- A tiny script at the top of each page sets `data-season` on `<html>` before anything is drawn, so there's no flash of the wrong colours.
- The colours live in `assets/css/seasons.css`.
- The switcher is `initSeasons()` in `assets/js/site.js`.
- The buttons on **Through the seasons** (`seasons.html`) open the homepage in the season you picked.

**Seasonal photos.** The homepage photo changes with the season. Autumn uses her own pumpkin arrangement. Winter, spring and summer use stock stand-ins: winter candles and white blooms, spring tulips, summer peonies. Replace them as she photographs each season's flowers. They're the four `<img data-season-only="…">` tags at the top of the hero in `index.html`. Landscape photos at least 1600px wide work best, because they fill the whole screen. Also update The First Edit (`products.js`) and its "Three for autumn" heading when the next collection launches.

## Brand assets: `assets/brand/`

The logo is traced from the first post on [@birdie.blooms](https://www.instagram.com/birdie.blooms/) and rebuilt as clean vectors:

| File | Use |
|---|---|
| `birdie-blooms-logo.svg` / `-cream.svg` | Full lockup: wordmark plus the "flowers with a little bit of yesterday" tagline |
| `birdie-blooms-wordmark.svg` / `-cream.svg` | Wordmark only (the header, and big at the foot of every page) |
| `birdie-blooms-squiggle.svg` | The swash from the "B", used as a small brand device (the Instagram follow card, "photo coming soon" panels, the basket and success messages, Through the seasons) |
| `birdie-blooms-monogram.svg` | The "B" on its own (the favicon, the header over the homepage photo, and the Birdie Card stamps) |

The cream versions are for photos and dark backgrounds. On the site the marks are drawn as CSS masks, so they take any colour. The big hero logo is inline SVG, one path per letter, so the letters can rise in one by one.

The hand-drawn illustrations (bird, dahlia, wheat, tulip, sprig, pumpkin) are in `assets/illustrations/`. On the site they're inline, drawn with a thick ink line and one touch of the season's bloom colour.

All the marks have been smoothed into clean vector curves: the wordmark, the B monogram and the squiggle (which keeps its original pinched "beak"). They're traced from a 1080px Instagram image, so for large print or signage it's still worth exporting her original logo file at full size and comparing. The tab icon is the B in each season's accent colour.

## Change products and prices: `assets/js/products.js`

Each bouquet has a name, description, photo, category and one or more sizes with prices. Change them there and both the shop and the homepage update.

**The First Edit** (her real autumn collection from Instagram) sits at the top of the file: The Birdie Bunch, The Pumpkin Edit · Orange and The Pumpkin Edit · Ghost, at £35 each. Anything with the `edit` category is featured on the homepage and in its own section at the top of the shop. To launch the next collection, give the new products `edit` and remove it from the old ones.

Everything below The First Edit is a **placeholder range** with stock photos and researched prices. Confirm, re-price or delete those.

A few settings change how a product looks or behaves:

- `img: null` with `placeholder: "…"` shows a cream "photo coming soon" panel with the squiggle. The Ghost pumpkin uses this until it's photographed.
- `enquire: true` shows an **Enquire** button instead of **Add to basket**. Funeral tributes use this.
- `badge` adds a small label to the photo.

Subscription tiers are in `shop.html`, and wedding packages and the price guide are in `weddings.html`.

## Forms and orders

There are four forms: the basket order request, the contact form, the wedding enquiry form and the newsletter sign-up ("Seasonal letters", at the foot of every page). All of them validate inline. Spam is caught by a hidden honeypot field.

Where submissions go is set at the top of `assets/js/site.js`, in `CONFIG.formMode`:

| `formMode` | What happens |
|---|---|
| `"mailto"` | Opens the visitor's email app with everything filled in, addressed to `CONFIG.email`. Works anywhere with no account. |
| `"endpoint"` | Sends the form to `CONFIG.formEndpoint`, for example a Formspree, Basin or Web3Forms URL. **Recommended before launch.** |
| `"netlify"` | For Netlify hosting. The forms are already tagged for Netlify Forms. |
| `"preview"` (**current setting**) | Design previews only. Nothing is sent, and the success message says so. Pair it with `preview: true`, which shows a small "Design preview · not live yet" badge. |

The site is in preview mode for now, because the GitHub Pages address is public and the contact details are still placeholders. At launch, set `preview: false` and choose `"endpoint"` (or `"mailto"`/`"netlify"`).

The basket sends an **order request**, not a payment. The flow is:
1. The customer sends the request.
2. You confirm stock.
3. You send a payment link, for example a Stripe or SumUp Payment Link.

Delivery fee (£6.50), the free-delivery threshold (£75) and the open days (Tue–Sat) are also set in `CONFIG`.

## Placeholders to replace before going live

| What | Where it appears now | Replace with |
|---|---|---|
| Founder name **"Hannah"** and her story | Home, About, page titles | Your real name and story |
| **The Birdie Card** (every bunch earns a B, the sixth is free) | Homepage, menu and footer | Confirm she wants to run it, and how the stamps are given (a paper card in each bouquet works). Otherwise delete the `#card` section in `index.html` and its links |
| Location: **Ravenstone & Kibworth, Leicestershire** (taken from her Instagram) | Footer, contact, FAQ | The exact studio address, if she wants it shown |
| Ghost pumpkin photo | `products.js` (`pumpkin-edit-ghost`) | A photo of the white Pumpkin Edit (4:5, about 1080×1350) |
| Placeholder range | `products.js`, below The First Edit | Confirm, re-price or delete |
| Winter, spring and summer homepage photos | `index.html` (the hero's `data-season-only` images) | Her own photos of each season's flowers |
| Phone **07700 900418** (an Ofcom fictional number) | Footer, contact, forms | Your number |
| `hello@birdieblooms.co.uk` and `@birdie.blooms` | `CONFIG.email` and footer links | Your real email address and Instagram |
| **Photography** | Her Instagram photos (`assets/img/bb-*.webp`) are used for the hero, The First Edit, the statement and the Instagram strip. Everything else is free Pexels stock. | Her own photos as she takes them, saved at the same file names. Weddings, the studio and her portrait are the biggest gaps. |
| **Prices, cut-offs, delivery radius** | `products.js`, `shop.html`, `weddings.html`, `policies.html` | Your real figures (current ones are set from the research) |
| **Policies** | `policies.html` | Review them against your real terms before launch |
| **Preview mode** | `CONFIG.preview` and `CONFIG.formMode` in `assets/js/site.js` | `preview: false` and a real `formMode`, so orders and enquiries reach her |
| `og:image` | Each page `<head>` | Change it to an absolute URL (`https://yourdomain/assets/img/og-image.jpg`) once you have a domain |

The site deliberately has **no invented reviews, ratings or press logos**. Add real client words when you have them; under the DMCC Act 2024, fake reviews are illegal in the UK. The big quote carousel on the homepage ("From the studio notebook") currently shows the florist's own notes. The Studio direction mock-up showed example reviews there; they were left out of the real site on purpose.

## Motion

GSAP 3.13 is loaded from cdnjs, with ScrollTrigger, SplitText, Flip and DrawSVG. The motion is confident and unfussy:

- on the homepage, her photo settles and the Birdie Blooms logo rises letter by letter, then the strapline and button
- the header floats over the homepage photo (just the B), then turns into a solid bar with the full wordmark once you scroll past it
- blocks rise in as they arrive, and big inner-page titles rise line by line
- photo collages where the back photo moves at a different pace to the front one
- the ink drawings draw themselves, then their touch of colour pops in
- the Birdie Card lands on the table; tap it to stamp a B, and a full card bursts petals
- the big logo at the foot of every page rises as you arrive
- an image that follows the cursor over the "ways to send" list
- a pinned wedding process, Flip-animated shop filters, a fly-to-basket effect and page fades

Motion is switched off for visitors who ask their device for reduced motion. All content still shows if the scripts fail to load.

## See it live: GitHub Pages

**https://johnpbell7.github.io/Birdie-blooms-/**

`.github/workflows/pages.yml` publishes the site every time the `ccr-6ac9390c-7l5oj2` or `claude/modest-noether-try4h3` branch is pushed. It takes about a minute. Progress shows in the repo's **Actions** tab.

GitHub only lets the branches listed under **Settings → Environments → github-pages → Deployment branches and tags** publish. If a push to a new branch shows a failed run that stopped after a couple of seconds, add that branch there, then re-run the workflow.

**Settings → Pages → Source** is already set to **GitHub Actions**. If the site ever stops updating, check that setting first. To republish without pushing anything, open **Actions → Publish to GitHub Pages → Run workflow**.

If you later rename the branch, change the branch name in the workflow too.

## Deploy elsewhere

Upload the folder to any static host: Netlify, Vercel, Cloudflare Pages or GitHub Pages with your own domain. `serve.py` is only for local preview.
