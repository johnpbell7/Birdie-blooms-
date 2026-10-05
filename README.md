# Birdie Blooms

The website for Birdie Blooms, a one-woman flower studio in Ravenstone & Kibworth, Leicestershire.

**Live:** https://johnpbell7.github.io/Birdie-blooms-/

It's a static site: plain HTML, one stylesheet and one script, with GSAP for the motion. There's no build step needed to host it.

## Pages

| Page | What's on it |
|---|---|
| `index.html` | Home: her flowers full-screen with the logo, autumn bouquets, what's in season, the Birdie Card, kind words, about, Instagram and seasonal letters |
| `shop.html` | Flowers: autumn bouquets, florist's choice and how ordering works |
| `weddings.html` | Weddings & events: what she makes, how it works, and a wedding enquiry form |
| `seasons.html` | What's in season: winter, spring, summer and autumn flowers |
| `about.html` | About: who she is, how she works and where she delivers |
| `contact.html` | Enquire: the enquiry form and other ways to get in touch |
| `policies.html` | Good to know: ordering, delivery, seasonal flowers, flower care, changes and privacy |
| `404.html` | Page not found |

## Changing words, products and reviews

All the pages are generated from one file, `src/build.py`. Edit it, then run:

```bash
python3 src/build.py
```

At the top of `src/build.py`:
- **`PRODUCTS`**: the season's bouquets, with name, price, photo and description. Set the photo to `None` to show a drawing instead.
- **`REVIEWS`**: real reviews only, used with the customer's permission. While the list is empty, the home page invites people to share a few words instead. Fake reviews are illegal in the UK.
- **`SEASONS`**: the flowers and words for each season.
- **`EMAIL`** and **`INSTA`**: contact details used across the site.

The look lives in `assets/css/studio.css` and the behaviour in `assets/js/studio.js`.

## Enquiries

Every button on the site leads to an enquiry, not a checkout. The flow is:
1. The customer fills in the form on `contact.html` or `weddings.html`.
2. Their email app opens with everything written out, addressed to `hello@birdieblooms.co.uk`.
3. She replies with a price and a payment link, for example a Stripe or SumUp link.

Each bouquet's "Enquire" button fills in which bouquet it's about.

To receive forms without the customer's email app, swap the email step for a form service such as Formspree or Netlify Forms. The submit code is in `assets/js/studio.js`, under "enquiry forms".

## Colours of the season

The site picks its colour by date:

| Season | Months | Colour |
|---|---|---|
| Winter | December to February | berry red |
| Spring | March to May | tulip pink |
| Summer | June to August | cornflower blue |
| Autumn | September to November | dahlia orange |

The colour appears on the bouquets block, the stamps and the browser-tab icon. The "What's in season" tiles highlight the current season.

## Before launch, please confirm

- **`hello@birdieblooms.co.uk`:** make sure this address exists and is hers, because every enquiry is sent to it.
- **Delivery area:** the site says Ravenstone, Kibworth and the villages nearby, with collection welcome.
- **The Birdie Card:** every bunch earns a stamp, and the sixth bunch is free. Is that the offer she wants to run?
- **Prices:** the autumn bouquets are £35 each.
- **Good to know:** check `policies.html` against how she actually works.
- **Photos:**
  - Only her own photos are used (`assets/img/bb-*.webp`).
  - There are no photos yet of her weddings, her studio or her, so those pages use drawings and colour instead.
  - New photos can be dropped in at the same file names, or added in `src/build.py`.
  - The Ghost pumpkin shows a drawing until it's photographed.
- **Search engines:** pages are set to `noindex` while the site is on GitHub. Remove that line in `src/build.py` (`head()`) when it moves to her own domain.

## Brand assets

| File | Use |
|---|---|
| `assets/brand/birdie-blooms-logo.svg` / `-cream.svg` | Full lockup with the tagline |
| `assets/brand/birdie-blooms-wordmark.svg` / `-cream.svg` | Wordmark only |
| `assets/brand/birdie-blooms-monogram.svg` | The B |
| `assets/brand/birdie-blooms-pattern.svg` | B pattern tile, for tissue paper, cards and similar |
| `assets/illustrations/` | The ink drawings: bird, dahlia, tulip, sprig, wheat and pumpkin |

Both Bs in the logo are the "Blooms" B. It's a full B with no break.

`directions/` keeps the earlier design concepts for reference. The live site doesn't link to them.

## Preview locally

```bash
python3 serve.py
```

Then open http://localhost:4178/

## Deploy

Every push to the `ccr-6ac9390c-7l5oj2` branch publishes to GitHub Pages through `.github/workflows/pages.yml`.
