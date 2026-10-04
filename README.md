# Birdie Blooms

The website for Birdie Blooms, a one-woman seasonal flower studio. It is a fast, static site: plain HTML, CSS and JavaScript with no build step. GSAP handles the motion.

The design brief was **high-end yet approachable, white and clean**. The research behind it is in [`docs/research.md`](docs/research.md). It covers 11 independent florists and includes their fonts, price ladders, forms and tone of voice.

## Pages

| Page | What's on it |
|---|---|
| `index.html` | Hero, values marquee, this week's flowers, ways to send, subscriptions, a weddings teaser, meet the florist, the studio notebook, and a pinned gallery |
| `shop.html` | 12 named bouquets with size and price pickers, filters, a basket, subscription tiers, and how delivery works |
| `weddings.html` | Approach, three packages, an à la carte price guide, a pinned 4-step process, events, FAQ, and a full wedding enquiry form |
| `about.html` | The founder's story, "clear rules" sustainability bento, and a week in the studio |
| `contact.html` | General enquiry form, contact details, studio hours and FAQ |
| `policies.html` | Delivery, substitutions, flower care, refunds, wedding terms, privacy and terms |
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
- **Della Respira** for headings. It's a 1920s Art Nouveau serif that sits naturally next to her wordmark.
- **EB Garamond** for reading text.
- **Josefin Sans** for labels, buttons and navigation. It's the font in her logo tagline, set lowercase and spaced the same way.
- White background, chocolate ink (`#2b1f19`), and one dusty-rose accent (`#a84e62`).

## Brand assets: `assets/brand/`

The logo is traced from the first post on [@birdie.blooms](https://www.instagram.com/birdie.blooms/) and rebuilt as clean vectors:

| File | Use |
|---|---|
| `birdie-blooms-logo.svg` / `-cream.svg` | Full lockup: wordmark plus the "flowers with a little bit of yesterday" tagline |
| `birdie-blooms-wordmark.svg` / `-cream.svg` | Wordmark only (used in the header) |
| `birdie-blooms-squiggle.svg` | The swash from the "B", used as the brand device (intro, hero, marquee, success messages) |
| `birdie-blooms-monogram.svg` | The "B" on its own (the favicon is built from it) |

The cream versions are for photos and dark backgrounds. The trace came from a 1080px Instagram image, so it's sharp on screen but has a faintly hand-drawn edge when blown up very large. For print or signage, export the original logo file at full size (from Canva or wherever it was made) and swap it in.

## Change products and prices: `assets/js/products.js`

Each bouquet has a name, description, photo, category and one or more sizes with prices. Change them there and both the shop and the homepage update. Two flags change how a product behaves:

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
| Products | `products.js` | Her real first edit from Instagram: The Pumpkin Edit (orange and ghost, £35 each) and The Birdie Bunch (£35) |
| Phone **07700 900418** (an Ofcom fictional number) | Footer, contact, forms | Your number |
| `hello@birdieblooms.co.uk` and `@birdie.blooms` | `CONFIG.email` and footer links | Your real email address and Instagram |
| **Photography** (free Pexels stock in `assets/img/`) | Everywhere | Your own photos, saved at the same file names |
| **Prices, cut-offs, delivery radius** | `products.js`, `shop.html`, `weddings.html`, `policies.html` | Your real figures (current ones are set from the research) |
| **Policies** | `policies.html` | Review them against your real terms before launch |
| `og:image` | Each page `<head>` | Change it to an absolute URL (`https://yourdomain/assets/img/og-image.jpg`) once you have a domain |

The site deliberately has **no invented reviews, ratings or press logos**. Add real client words when you have them; under the DMCC Act 2024, fake reviews are illegal in the UK. The quote carousel on the homepage currently shows the florist's own notes.

## Motion

GSAP 3.13 is loaded from cdnjs, with ScrollTrigger, SplitText and Flip. The motion includes:

- masked line-by-line headline reveals and clip-path image wipes
- her logo squiggle inking itself in, in the once-per-visit loader and the hero
- a values marquee that speeds up with scroll velocity
- statement words that "ink in" as you read
- an image that follows the cursor over the occasions list
- a pinned horizontal gallery and a pinned wedding process
- Flip-animated shop filters
- a fly-to-basket effect, magnetic buttons and page fades

Motion is switched off for visitors who ask their device for reduced motion. All content still shows if the scripts fail to load.

## Deploy

Upload the folder to any static host: Netlify, Vercel, Cloudflare Pages or GitHub Pages. `serve.py` is only for local preview.
