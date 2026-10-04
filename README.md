# Birdie Blooms

The website for Birdie Blooms, a one-woman seasonal flower studio. It is a fast, static site: plain HTML, CSS and JavaScript with no build step. GSAP handles the motion.

The design brief was **high-end yet approachable, white and clean**. The research behind it is in [`docs/research.md`](docs/research.md). It covers 11 independent florists and includes their fonts, price ladders, forms and tone of voice.

## Pages

| Page | What's on it |
|---|---|
| `index.html` | Hero (her pumpkin arrangement), values marquee, The First Edit, ways to send, subscriptions, a weddings teaser, meet the florist, the studio notebook, and an Instagram strip linking to her posts |
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

- Site: http://localhost:4178/index.html
- Visual style sheet: http://localhost:4178/styleguide/

## Change the look: `styleguide/tokens.css`

Every colour, font, size, radius, spacing value and motion duration lives in `styleguide/tokens.css`, and every page reads from it. You have two ways to change them:

- Edit the file by hand.
- Open `/styleguide/` and use the visual editor. It shows the real site live on the right, and **Save to tokens.css** writes your changes back.

Current look:
- **Gilda Display** for headings.
- **Josefin Sans** for everything else, light (300) for reading text. It's the font in her logo tagline; labels are set lowercase and spaced the same way.
- White background, chocolate ink (`#2b1a16`), and **seasonal colour** (see below). `tokens.css` holds the autumn values.

## Seasons: colours that follow the flowers

The site changes its colours by date, four times a year:

| Season | Dates | Flowers | Accent | Splash | Tint |
|---|---|---|---|---|---|
| Winter | 1 Dec – end Feb | Amaryllis & hellebores | plum `#5a2b4b` | berry `#b8323a` | frost `#f2f3f0` |
| Spring | 1 Mar – 31 May | Tulips & narcissi | tulip `#a8385a` | narcissus `#e8b32a` | blossom `#fcf3f1` |
| Summer | 1 Jun – 31 Aug | Sweet peas & cornflowers | cornflower `#34529c` | sweet pea `#c46aa8` | lavender `#f4f4fa` |
| Autumn | 1 Sep – 30 Nov | Dahlias & amaranth | amaranth `#7a2431` | dahlia `#d9662e` | linen `#f6efe7` |

Each season changes all of these:
- the **accent**: buttons, the announcement bar, the squiggle and tags
- the **splash**: step lines and the marquee squiggles
- the **tint**: cream sections and the footer
- the hero's **close-up colour texture** (`assets/img/season-*.webp`)
- the **hero photos**
- the **tab icon** (`assets/img/favicon-*.svg`)
- the **"in season now" flower list** and the announcement bar text

How it works:
- A tiny script at the top of each page sets `data-season` on `<html>` before anything is drawn, so there's no flash of the wrong colours.
- The colours live in `assets/css/seasons.css`.
- On **Through the seasons** (`seasons.html`), "See the site in…" previews any season. A "Back to today" chip resets it, and the preview lasts only for that browser tab.

**Seasonal photos.** Autumn uses her own photos. Winter, spring and summer use stock stand-ins: winter candles and white blooms, spring tulips, summer peonies and hydrangea. Replace them as she photographs each season's flowers. They're listed in `HERO_IMGS` near the hero in `index.html`. Also update The First Edit (`products.js`) and its "Three for autumn" heading when the next collection launches.

## Brand assets: `assets/brand/`

The logo is traced from the first post on [@birdie.blooms](https://www.instagram.com/birdie.blooms/) and rebuilt as clean vectors:

| File | Use |
|---|---|
| `birdie-blooms-logo.svg` / `-cream.svg` | Full lockup: wordmark plus the "flowers with a little bit of yesterday" tagline |
| `birdie-blooms-wordmark.svg` / `-cream.svg` | Wordmark only (used in the header) |
| `birdie-blooms-squiggle.svg` | The swash from the "B", used as the brand device (intro, hero, marquee, success messages) |
| `birdie-blooms-monogram.svg` | The "B" on its own (the favicon is built from it) |

The cream versions are for photos and dark backgrounds.

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

There are four forms: the basket order request, the contact form, the wedding enquiry form and the newsletter sign-up. All of them validate inline. Spam is caught by a hidden honeypot field.

Where submissions go is set at the top of `assets/js/site.js`, in `CONFIG.formMode`:

| `formMode` | What happens |
|---|---|
| `"mailto"` (default) | Opens the visitor's email app with everything filled in, addressed to `CONFIG.email`. Works anywhere with no account. |
| `"endpoint"` | Sends the form to `CONFIG.formEndpoint`, for example a Formspree, Basin or Web3Forms URL. **Recommended before launch.** |
| `"netlify"` | For Netlify hosting. The forms are already tagged for Netlify Forms. |
| `"preview"` | Design previews only. Nothing is sent, and the success message says so. Pair it with `preview: true`, which shows a small "Design preview · not live yet" badge. |

The basket sends an **order request**, not a payment. The flow is:
1. The customer sends the request.
2. You confirm stock.
3. You send a payment link, for example a Stripe or SumUp Payment Link.

Delivery fee (£6.50), the free-delivery threshold (£75) and the open days (Tue–Sat) are also set in `CONFIG`.

## Placeholders to replace before going live

| What | Where it appears now | Replace with |
|---|---|---|
| Founder name **"Hannah"** and her story | Home, About, page titles | Your real name and story |
| Location: **Ravenstone & Kibworth, Leicestershire** (taken from her Instagram) | Footer, contact, FAQ | The exact studio address, if she wants it shown |
| Ghost pumpkin photo | `products.js` (`pumpkin-edit-ghost`) | A photo of the white Pumpkin Edit (4:5, about 1080×1350) |
| Placeholder range | `products.js`, below The First Edit | Confirm, re-price or delete |
| Winter, spring and summer hero photos | `index.html` (`HERO_IMGS`) | Her own photos of each season's flowers |
| Phone **07700 900418** (an Ofcom fictional number) | Footer, contact, forms | Your number |
| `hello@birdieblooms.co.uk` and `@birdie.blooms` | `CONFIG.email` and footer links | Your real email address and Instagram |
| **Photography** | Her Instagram photos (`assets/img/bb-*.webp`) are used for the hero, The First Edit, the statement and the Instagram strip. Everything else is free Pexels stock. | Her own photos as she takes them, saved at the same file names. Weddings, the studio and her portrait are the biggest gaps. |
| **Prices, cut-offs, delivery radius** | `products.js`, `shop.html`, `weddings.html`, `policies.html` | Your real figures (current ones are set from the research) |
| **Policies** | `policies.html` | Review them against your real terms before launch |
| `og:image` | Each page `<head>` | Change it to an absolute URL (`https://yourdomain/assets/img/og-image.jpg`) once you have a domain |

The site deliberately has **no invented reviews, ratings or press logos**. Add real client words when you have them; under the DMCC Act 2024, fake reviews are illegal in the UK. The quote carousel on the homepage currently shows the florist's own notes.

## Motion

GSAP 3.13 is loaded from cdnjs, with ScrollTrigger, SplitText and Flip. The motion includes:

- masked line-by-line headline reveals and clip-path image wipes
- her logo squiggle inking itself in, in the once-per-visit loader, the hero and the seasons page
- a seasonal close-up colour texture behind the hero, with her photo laid over it like a print
- a values marquee that speeds up with scroll velocity
- statement words that "ink in" as you read
- an image that follows the cursor over the occasions list
- a pinned wedding process
- Flip-animated shop filters
- a fly-to-basket effect, magnetic buttons and page fades

Motion is switched off for visitors who ask their device for reduced motion. All content still shows if the scripts fail to load.

## Deploy

Upload the folder to any static host: Netlify, Vercel, Cloudflare Pages or GitHub Pages. `serve.py` is only for local preview.
