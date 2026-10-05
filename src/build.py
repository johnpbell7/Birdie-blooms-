#!/usr/bin/env python3
"""Builds the Birdie Blooms site: every page shares one header, footer, stylesheet and script.

    python3 src/build.py

Edit the words, products and reviews here, then run it again. Pages are written to the repo root.
"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
V = "?v=5"            # bump to make browsers fetch new CSS/JS/logo files
EMAIL = "hello@birdieblooms.co.uk"
INSTA = "https://www.instagram.com/birdie.blooms/"
IMG = "assets/img/"

# ---- content you'll want to edit ---------------------------------------------------------
PRODUCTS = [
    # name, price, photo (or None to show a drawing), drawing, description
    ("The Birdie Bunch", "£35", "bb-bunch-detail.webp", "dahlia",
     "Dahlias, hydrangea, wheat and eucalyptus, hand-tied and wrapped in paper."),
    ("The Pumpkin Edit · Orange", "£35", "bb-pumpkin-orange.webp", "pumpkin",
     "Dahlias, amaranth and hydrangea gathered round a little orange pumpkin, finished with ribbon."),
    ("The Pumpkin Edit · Ghost", "£35", None, "pumpkin",
     "The same idea in pale, ghostly tones, round a white pumpkin."),
]

# Real reviews only (with the customer's permission). While this is empty, the page invites reviews instead.
REVIEWS = [
    # ("What they said.", "Their name, and where or what for"),
]

SEASONS = [
    ("winter", "Winter", "December to February", "berry red", "sprig",
     ["Amaryllis", "Hellebores", "Paperwhites", "Anemones", "Eucalyptus", "Ilex berries"],
     "Deep reds and frosted greens. Paperwhites for the windowsill and amaryllis for the table."),
    ("spring", "Spring", "March to May", "tulip pink", "tulip",
     ["Tulips", "Narcissi", "Ranunculus", "Hyacinths", "Blossom", "Muscari"],
     "The first British stems of the year: tulips in every shade, narcissi and armfuls of blossom."),
    ("summer", "Summer", "June to August", "cornflower blue", "wheat",
     ["Sweet peas", "Peonies", "Cornflowers", "Garden roses", "Cosmos", "Larkspur"],
     "Garden flowers at their best. Sweet peas, cornflowers and the short, glorious peony season."),
    ("autumn", "Autumn", "September to November", "dahlia orange", "dahlia",
     ["Dahlias", "Amaranth", "Rosehips", "Chrysanthemums", "Hydrangea", "Pumpkins"],
     "Rich oranges and deep burgundies. Dahlias by the bucketful, amaranth and the odd pumpkin."),
]

NAV = [("Flowers", "shop.html"), ("Weddings", "weddings.html"), ("Seasons", "seasons.html"), ("About", "about.html")]

# ---- building blocks ----------------------------------------------------------------------
ARROW = '<svg class="arr" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1.5 8h12.5M9.5 3.5 14 8l-4.5 4.5"/></svg>'
MENU_ICON = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 7h14M3 13h14"/></svg>'
CLOSE_ICON = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15"/></svg>'
GLYPHS = open(os.path.join(ROOT, "src/partials/wordmark-glyphs.svg")).read()

def wordmark(cls, label=False):
    aria = 'role="img" aria-label="Birdie Blooms"' if label else 'aria-hidden="true"'
    return f'<svg class="wm {cls}" viewBox="7 8 6174 828" {aria}>{GLYPHS}</svg>'

def illo(name, cls=""):
    t = open(os.path.join(ROOT, f"assets/illustrations/{name}.svg")).read()
    inner = t[t.index(">", t.index("<svg")) + 1: t.rindex("</svg>")]
    return f'<svg class="illo {cls}" data-illo="{name}" viewBox="0 0 120 160" aria-hidden="true">{inner}</svg>'

def enquire_link(**q):
    from urllib.parse import urlencode
    return "contact.html" + ("?" + urlencode(q) if q else "") + "#enquire"

def nav_links(current):
    out = []
    for i, (label, href) in enumerate(NAV):
        cur = ' aria-current="page"' if href == current else ""
        out.append(f'<a href="{href}"{cur}>{label}</a>')
    return "<span>~</span>".join(out)

def head(title, desc, inner=True):
    return f'''<!doctype html>
<html lang="en-GB" class="m">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="robots" content="noindex">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{IMG}og-image.jpg">
<link rel="icon" id="favicon" href="{IMG}favicon-autumn.svg{V}" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..600&family=Josefin+Sans:wght@400;600;700&display=swap">
<link rel="stylesheet" href="assets/css/studio.css{V}">
<script>
  (function (d) {{
    var r = d.documentElement, m = new Date().getMonth();
    var s = m < 2 || m === 11 ? "winter" : m < 5 ? "spring" : m < 8 ? "summer" : "autumn";
    r.setAttribute("data-season", s); r.setAttribute("data-today", s);
    d.getElementById("favicon").href = "{IMG}favicon-" + s + ".svg{V}";
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) r.classList.remove("m");
    setTimeout(function () {{ if (!window.gsap) r.classList.remove("m"); }}, 2500);
  }})(document);
</script>
</head>
<body{' class="inner"' if inner else ''}>
<a class="sr" href="#main">Skip to content</a>
'''

def bar(current, home):
    return f'''<header class="bar{'' if home else ' show'}" aria-label="Site">
  <a class="bar-logo" href="index.html" aria-label="Birdie Blooms, home">{wordmark("wm-bar")}</a>
  <nav class="bar-nav" aria-label="Primary">{nav_links(current)}</nav>
  <div class="bar-right"><a class="pill-cta" href="{enquire_link()}">Enquire</a><button class="menu-btn" type="button" aria-label="Menu" aria-expanded="false">{MENU_ICON}</button></div>
</header>
<div class="menu" role="dialog" aria-modal="true" aria-label="Menu">
  <div class="menu-top"><a href="index.html" aria-label="Birdie Blooms, home">{wordmark("wm-menu")}</a><button class="menu-btn menu-close" type="button" aria-label="Close menu" style="display:grid">{CLOSE_ICON}</button></div>
  <nav aria-label="Menu">{"".join(f'<a href="{h}">{l}</a>' for l, h in [("Home", "index.html")] + NAV)}</nav>
  <a class="btn" href="{enquire_link()}">Make an enquiry {ARROW}</a>
</div>
'''

def footer():
    now = "".join(f'<span data-only="{k}">In season now: {fl[0].lower()}, {fl[1].lower()} and {fl[2].lower()}</span>' for k, n, months, colour, art, fl, line in SEASONS)
    return f'''<footer class="foot">
  <div class="foot-cols">
    <div><p class="label">Birdie Blooms</p><p>Flowers with a little bit of yesterday.<br>Ravenstone &amp; Kibworth, Leicestershire</p></div>
    <div><p class="label">Get in touch</p><p><a href="{enquire_link()}">Make an enquiry</a><br><a href="mailto:{EMAIL}">{EMAIL}</a><br><a href="{INSTA}">Instagram @birdie.blooms</a></p></div>
    <div><p class="label">Good to know</p><p><a href="policies.html#delivery">Delivery &amp; collection</a><br><a href="policies.html#care">Flower care</a><br><a href="policies.html#privacy">Privacy</a></p></div>
  </div>
  <div class="foot-mark">{wordmark("wm-foot")}</div>
  <div class="foot-base">
    <span class="label">© 2026 Birdie Blooms</span>
    <span class="foot-now label">{now}</span>
  </div>
</footer>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/ScrollTrigger.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/DrawSVGPlugin.min.js"></script>
<script src="assets/js/studio.js{V}"></script>
</body>
</html>
'''

def page_hero(label, title, sub, block, art=None, cta=None, photo=None):
    btn = f'<a class="btn" href="{cta[1]}">{cta[0]} {ARROW}</a>' if cta else ""
    if photo:
        side = f'<figure class="ph-photo"><img src="{IMG}{photo[0]}" alt="{photo[1]}">{illo(art, "ph-illo") if art else ""}</figure>'
        return f'''<section class="page-hero has-photo {block}">
  <div class="page-hero-in">
    <div><p class="label">{label}</p><h1>{title}</h1><p class="sub">{sub}</p>{btn}</div>
    {side}
  </div>
</section>'''
    return f'''<section class="page-hero {block}">
  <div class="page-hero-in">
    <div><p class="label">{label}</p><h1>{title}</h1><p class="sub">{sub}</p>{btn}</div>
    {illo(art) if art else ""}
  </div>
</section>'''

def collage(front, back, alt, cls=""):
    return (f'<div class="collage {cls}"><img class="c-back" src="{IMG}{back}" alt="" loading="lazy">'
            f'<img class="c-front" src="{IMG}{front}" alt="{alt}" loading="lazy"></div>')

def product_cards():
    out = []
    for name, price, photo, art, desc in PRODUCTS:
        pic = (f'<a class="p-img" href="{enquire_link(bouquet=name)}"><img src="{IMG}{photo}" alt="{name}" loading="lazy"></a>' if photo
               else f'<a class="p-img p-illo" href="{enquire_link(bouquet=name)}" aria-label="{name}">{illo(art)}</a>')
        out.append(f'''
        <article class="product" data-up>
          {pic}
          <div class="p-row"><h3>{name}</h3><span class="p-price">{price}</span></div>
          <p class="p-desc">{desc}</p>
          <a class="btn btn-light" href="{enquire_link(bouquet=name)}">Enquire {ARROW}</a>
        </article>''')
    return "".join(out)

def first_edit(heading_tag="h2"):
    return f'''<section class="edit block-bloom" id="bouquets">
    <div class="edit-head" data-up>
      <div><p class="label">This season</p><{heading_tag} class="huge-serif">Autumn bouquets</{heading_tag}></div>
      <p class="edit-note">Three bouquets for autumn, made to order with the season’s best stems.</p>
    </div>
    <div class="products">{product_cards()}</div>
    <div class="edit-more" data-up>
      <p>Looking for something else? Tell me the occasion, the colours and your budget, and I’ll make something just for you.</p>
      <a class="btn btn-light" href="{enquire_link(**{'for': 'Bouquet or arrangement'})}">Make an enquiry {ARROW}</a>
    </div>
  </section>'''

PALETTES = {"winter": "Berry red and frosted green", "spring": "Tulip pink and narcissus yellow",
            "summer": "Cornflower blue and sweet-pea pink", "autumn": "Dahlia orange and amaranth red"}

def season_picker():
    cards = "".join(f'''
        <article class="swatch" data-s="{k}" role="listitem">
          <span class="sw-dot" aria-hidden="true">{illo(art, "sw-illo")}</span>
          <h3 class="sw-name">{n}</h3>
          <p class="sw-months label">{months}</p>
          <p class="sw-colours"><i aria-hidden="true"></i>{PALETTES[k]}</p>
          <p class="sw-flowers">{", ".join(fl[:4])}</p>
          <span class="sw-now label">In season now</span>
        </article>''' for k, n, months, colour, art, fl, line in SEASONS)
    return f'''<section class="palette" id="colours" aria-labelledby="pal-title">
    <div class="pal-head" data-up>
      <p class="label">What’s in season</p>
      <h2 class="big-serif" id="pal-title">Flowers for every season.</h2>
      <p class="pal-sub">The best flowers are the ones that are ready now. Here’s what each season brings, and the colours that come with it.</p>
    </div>
    <div class="swatches" role="list">{cards}</div>
    <p class="pal-more" data-up><a class="text-link" href="seasons.html">The full seasonal guide {ARROW}</a></p>
  </section>'''

def birdie_card(cta=True):
    stamps = '<li class="on"><span class="mark mono"></span></li>' * 2 + '<li><span class="mark mono"></span></li>' * 3 + '<li class="free"><span>free</span></li>'
    btn = f'<a class="btn" href="{enquire_link(**{"for": "The Birdie Card"})}">Start your card {ARROW}</a>' if cta else ""
    return f'''<section class="loyalty block-butter" id="card">
    <div class="card-stage" data-up>
      <div class="bcard" role="img" aria-label="The Birdie Card">
        <div class="bcard-top"><span class="bcard-title">The Birdie Card</span>{illo("bird", "bcard-bird")}</div>
        <ol class="stamps" aria-label="Two of five stamps collected">{stamps}</ol>
        <p class="bcard-foot label">A B for every bunch</p>
      </div>
    </div>
    <div class="loyalty-copy" data-up>
      <p class="label">The Birdie Card</p>
      <h2 class="big-serif">Every bunch earns a B. The sixth one’s on me.</h2>
      <ol class="steps">
        <li><b>1</b>Your card comes with your first bunch</li>
        <li><b>2</b>Every bunch earns a B stamp</li>
        <li><b>3</b>Five Bs, and your next bunch is free</li>
      </ol>
      {btn}
    </div>
  </section>'''

def kind_words():
    bs = '<span class="bs" aria-hidden="true">' + '<i class="mark mono"></i>' * 5 + '</span>'
    if REVIEWS:
        quotes = "".join(f'<figure class="quote{" is-on" if i == 0 else ""}"><blockquote>“{q}”</blockquote><figcaption class="label">{w}</figcaption></figure>'
                         for i, (q, w) in enumerate(REVIEWS))
        nav = ""
        if len(REVIEWS) > 1:
            dots = "".join(f'<i{" class=is-on" if i == 0 else ""}></i>' for i in range(len(REVIEWS)))
            nav = f'<div class="q-nav"><button type="button" class="q-prev" aria-label="Previous review">{ARROW}</button><span class="q-dots">{dots}</span><button type="button" class="q-next" aria-label="Next review">{ARROW}</button></div>'
        return f'<section class="reviews"><p class="label" data-up>Kind words</p>{bs}<div class="quotes" data-up>{quotes}</div>{nav}</section>'
    return f'''<section class="reviews">
    <div class="invite" data-up>
      <p class="label">Kind words</p>
      {bs}
      <h2 class="big-serif">Had flowers from Birdie Blooms? I’d love to hear what you thought.</h2>
      <div class="invite-actions">
        <a class="btn" href="mailto:{EMAIL}?subject=A%20few%20kind%20words">Send a few words {ARROW}</a>
        <a class="btn btn-ghost" href="{INSTA}">Tag @birdie.blooms</a>
      </div>
    </div>
  </section>'''

def letters():
    return f'''<section class="letters block-butter" id="letters">
    <div class="letters-copy" data-up>
      <h2 class="huge-serif">Seasonal letters.</h2>
      <p>What’s coming into season, new collections and the odd Birdie Card bonus. Four emails a year, never more.</p>
      <form class="signup" data-letters>
        <label class="sr" for="em">Email address</label>
        <input id="em" type="email" placeholder="Your email address" required autocomplete="email">
        <button class="btn" type="submit">Sign up</button>
        <p class="thanks">Thank you. Press send in your email and you’re on the list.</p>
      </form>
    </div>
    <div class="letters-art" data-up>
      <img class="la1" src="{IMG}bb-pumpkin-orange.webp" alt="" loading="lazy">
      <img class="la2" src="{IMG}bb-birdie-bunch.webp" alt="" loading="lazy">
      <img class="la3" src="{IMG}bb-bunch-detail.webp" alt="" loading="lazy">
    </div>
  </section>'''

def cta_band(title, text, label, href, block=""):
    return f'''<section class="cta-band {block}">
    {illo("bird", "spot")}
    <h2 class="big-serif" data-up>{title}</h2>
    <p data-up>{text}</p>
    <a class="btn" href="{href}" data-up>{label} {ARROW}</a>
  </section>'''

def write(name, html):
    open(os.path.join(ROOT, name), "w").write(html)
    print("wrote", name, f"{len(html) // 1024} KB")

# ===========================================================================================
# HOME
# ===========================================================================================
home = head("Birdie Blooms · Seasonal flowers in Ravenstone &amp; Kibworth",
            "Seasonal flowers for big days, and Tuesdays. A one-woman flower studio in Ravenstone &amp; Kibworth, Leicestershire.", inner=False)
home += bar("index.html", home=True) + f'''
<section class="hero" id="top">
  <img class="hero-img" src="{IMG}bb-pumpkin-orange.webp" alt="An autumn arrangement of dahlias, amaranth and hydrangea round a little pumpkin, tied with a brown ribbon">
  <div class="hero-shade" aria-hidden="true"></div>
  <header class="hero-top">
    <a class="hero-b" href="index.html" aria-label="Birdie Blooms, home"><span class="mark mono"></span></a>
    <nav aria-label="Primary">{nav_links("index.html")}</nav>
    <div class="hero-right"><a class="pill-cta" href="{enquire_link()}">Enquire</a><button class="menu-btn" type="button" aria-label="Menu" aria-expanded="false">{MENU_ICON}</button></div>
  </header>
  <div class="hero-center">
    <h1 class="hero-mark">{wordmark("wm-hero", label=True)}</h1>
    <p class="hero-line">Flowers for big days, and Tuesdays.</p>
    <a class="btn btn-light" href="{enquire_link()}">Enquire about flowers {ARROW}</a>
  </div>
</section>

<main id="main">
  <section class="intro block-pastel">
    <p class="big-serif" data-up>Hi, I’m Birdie Blooms: a one-woman flower studio in Ravenstone &amp; Kibworth, making loose, seasonal flowers for every kind of day.</p>
    {illo("bird", "spot")}
  </section>

  <section class="two-up">
    <h2 class="mid-serif" data-up>Seasonal flowers, made by hand.</h2>
    <div class="two-cols">
      <div class="col" data-up>
        <p class="label">Flowers to send</p>
        <p class="col-text">Hand-tied bouquets and arrangements in the season’s best stems, for birthdays, thank-yous and just-becauses. <a href="shop.html">See the flowers</a>.</p>
        {collage("bb-birdie-bunch.webp", "bb-bunch-detail.webp", "A hand-tied bouquet of dahlias and hydrangea carried over a shoulder")}
      </div>
      <div class="col col-low" data-up>
        <p class="label">Weddings &amp; events</p>
        <p class="col-text">From a single bouquet to flowers for the whole day, made to suit you and the season. <a href="weddings.html">Ask about your date</a>.</p>
        {collage("bb-pumpkin-orange.webp", "bb-motion.webp", "An autumn arrangement with dahlias and a pumpkin", "c-flip")}
      </div>
    </div>
    {illo("dahlia", "spot spot-sm")}
  </section>

  {first_edit()}

  {season_picker()}

  {birdie_card()}

  {kind_words()}

  <section class="about block-pastel">
    {collage("bb-birdie-bunch.webp", "bb-pumpkin-orange.webp", "A bouquet of autumn flowers", "c-about")}
    <div class="about-copy" data-up>
      <p class="label">About</p>
      <h2 class="big-serif">Flowers with a little bit of yesterday.</h2>
      <p>I make loose, garden-style flowers with a nostalgic feel: soft colours, seasonal stems and the odd unexpected thing, like a pumpkin. Every arrangement is made by hand, to order, in Ravenstone and Kibworth.</p>
      <a class="text-link" href="about.html">More about me {ARROW}</a>
    </div>
  </section>

  <section class="insta">
    <h2 class="mid-serif" data-up>Follow along on Instagram</h2>
    <div class="ig">{"".join(f'<a href="{INSTA}" data-up><img src="{IMG}{i}" alt="" loading="lazy"></a>' for i in ["bb-pumpkin-orange.webp", "bb-birdie-bunch.webp", "bb-motion.webp", "bb-bunch-detail.webp"])}</div>
    <p class="ig-handle">New flowers most weeks at <a href="{INSTA}">@birdie.blooms</a></p>
    {illo("wheat", "spot spot-sm")}
  </section>

  {letters()}
</main>
''' + footer()
write("index.html", home)

# ===========================================================================================
# FLOWERS (shop.html)
# ===========================================================================================
shop = head("Flowers · Birdie Blooms", "Seasonal bouquets and arrangements, made to order in Ravenstone &amp; Kibworth.") + bar("shop.html", False) + f'''
<main id="main">
  {page_hero("Flowers", "Flowers to send.", "Hand-tied bouquets and arrangements, made to order with the season’s best stems.", "block-pastel", "dahlia", ("Make an enquiry", enquire_link(**{"for": "Bouquet or arrangement"})))}

  {first_edit()}

  <section class="section">
    <div class="split">
      <div class="prose" data-up>
        <p class="label">Florist’s choice</p>
        <h2 class="big-serif">Leave it to me.</h2>
        <p>Tell me who the flowers are for, what they love and your budget, and I’ll choose the best of what’s in season that week. Bright and joyful, soft and calm, or somewhere in between.</p>
        <p>Perfect for birthdays, thank-yous, new babies and get-wells, or for no reason at all.</p>
        <p style="margin-top:30px"><a class="btn" href="{enquire_link(**{"for": "Florist’s choice"})}">Enquire about florist’s choice {ARROW}</a></p>
      </div>
      <img class="split-img" src="{IMG}bb-motion.webp" alt="Dahlias and amaranth" loading="lazy" data-up>
    </div>
  </section>

  <section class="section block-bloom">
    <div class="section-head" data-up><p class="label">How it works</p><h2 class="big-serif">Ordering, simply.</h2></div>
    <ol class="steps-grid" style="--n:3">
      <li data-up><b>1</b><h3>Enquire</h3><p>Tell me what you’d like, the date, and whether it’s for delivery or collection.</p></li>
      <li data-up><b>2</b><h3>Confirm</h3><p>I’ll reply with what’s possible, a price and a secure link to pay.</p></li>
      <li data-up><b>3</b><h3>Flowers</h3><p>I make your flowers fresh for the day and deliver them locally, or have them ready to collect.</p></li>
    </ol>
  </section>

  {season_picker()}

  {cta_band("Something in mind?", "Big day or a Tuesday, tell me about it and I’ll come back to you with ideas and a price.", "Make an enquiry", enquire_link(), "block-pastel")}
</main>
''' + footer()
write("shop.html", shop)

# ===========================================================================================
# WEDDINGS
# ===========================================================================================
services = [
    ("bird", "Bouquets", "Bridal bouquets, bridesmaids’ posies and flowers for the people who matter."),
    ("sprig", "Buttonholes &amp; corsages", "Little matching sprigs for the wedding party, made to last the day."),
    ("tulip", "Ceremony flowers", "Arrangements for the aisle, the table where you sign, or an arch."),
    ("dahlia", "Tables", "Centrepieces, bud vases and garlands for the meal and the party."),
    ("wheat", "Hair flowers", "Flower crowns, combs and pins, from a few stems to a full crown."),
    ("pumpkin", "Events &amp; parties", "Birthdays, christenings, showers and suppers. Big or small, ask."),
]
wed_form = f'''<div class="form-shell">
      <form class="form" data-enquiry data-subject="Wedding enquiry" novalidate>
        <div class="field"><label for="w-name">Your names</label><input id="w-name" name="name" data-label="Names" required autocomplete="name"></div>
        <div class="field"><label for="w-email">Email</label><input id="w-email" name="email" type="email" data-label="Email" required autocomplete="email"></div>
        <div class="field"><label for="w-phone">Phone <span class="opt">optional</span></label><input id="w-phone" name="phone" type="tel" data-label="Phone" autocomplete="tel"></div>
        <div class="field"><label for="w-date">Wedding date</label><input id="w-date" name="date" type="date" data-label="Date"></div>
        <div class="field"><label for="w-venue">Venue</label><input id="w-venue" name="venue" data-label="Venue"></div>
        <div class="field"><label for="w-guests">Number of guests <span class="opt">roughly</span></label><input id="w-guests" name="guests" inputmode="numeric" data-label="Guests"></div>
        <fieldset class="field full"><legend>What you’d like</legend><div class="choices">
          {"".join(f'<label class="choice"><input type="checkbox" name="need" value="{v}" data-label="Would like"><span>{v}</span></label>' for v in ["Bridal bouquet", "Bridesmaids", "Buttonholes", "Ceremony", "Tables", "Hair flowers", "Not sure yet"])}
        </div></fieldset>
        <div class="field full"><label for="w-colours">Colours, flowers or feelings you love</label><input id="w-colours" name="colours" data-label="Colours and flowers"></div>
        <div class="field full"><label for="w-msg">Tell me about your day</label><textarea id="w-msg" name="message" data-label="Message"></textarea></div>
        <button class="btn" type="submit">Send enquiry {ARROW}</button>
      </form>
      <div class="form-done" role="status"><h3>Thank you.</h3><p>Your email is ready to send. Once it’s on its way, I’ll come back to you as soon as I can.</p></div>
    </div>'''
weddings = head("Weddings &amp; events · Birdie Blooms", "Loose, seasonal wedding and event flowers from Ravenstone &amp; Kibworth, Leicestershire.") + bar("weddings.html", False) + f'''
<main id="main">
  {page_hero("Weddings &amp; events", "Wedding flowers, gathered from the season.", "Loose, romantic flowers that look like they’ve just been picked, made for your day, your colours and the time of year.", "block-pastel", "bird", ("Enquire about your date", "#enquire"), ("wed-bride-garden.webp", "A bride holding a loose bouquet of white roses, daisies and green flowers"))}

  <section class="section">
    <div class="section-head center" data-up><p class="label">What I make</p><h2 class="big-serif">From one bouquet to the whole day.</h2></div>
    <div class="services">{"".join(f'<div class="service" data-up>{illo(a)}<h3>{t}</h3><p>{p}</p></div>' for a, t, p in services)}</div>
  </section>

  <section class="section block-bloom">
    <div class="section-head" data-up><p class="label">How it works</p><h2 class="big-serif">Your flowers, step by step.</h2></div>
    <ol class="steps-grid" style="--n:4">
      <li data-up><b>1</b><h3>Enquire</h3><p>Send me your date, venue and anything you already know you love.</p></li>
      <li data-up><b>2</b><h3>A chat</h3><p>We talk through your day, your colours and what’s in season then.</p></li>
      <li data-up><b>3</b><h3>Your proposal</h3><p>I send ideas, the flowers I’d use and a clear price.</p></li>
      <li data-up><b>4</b><h3>The day</h3><p>I make everything fresh and bring it to you, ready for the day.</p></li>
    </ol>
  </section>

  <section class="section block-butter" id="enquire">
    <div class="form-wrap">
      <div>
        <div class="section-head" data-up><p class="label">Enquire</p><h2 class="big-serif">Tell me about your day.</h2><p>Don’t worry if you don’t have all the answers yet. A date and a rough idea is a lovely place to start.</p></div>
        {wed_form}
      </div>
      <aside class="aside" data-up>
        <div class="aside-card"><p class="label">Good to know</p><p>Wedding dates book up, especially in summer, so it’s worth getting in touch as early as you can.</p></div>
        <div class="aside-card"><p class="label">Rather talk?</p><p>Email <a href="mailto:{EMAIL}">{EMAIL}</a> or send me a message on <a href="{INSTA}">Instagram</a>.</p></div>
      </aside>
    </div>
  </section>
</main>
''' + footer()
write("weddings.html", weddings)

# ===========================================================================================
# SEASONS
# ===========================================================================================
panels = "".join(f'''
  <section class="panel" data-s="{k}" id="{k}">
    <div class="panel-in">
      <div class="panel-dot">{illo(art)}</div>
      <div data-up>
        <p class="label">{months}</p>
        <h2>{n}</h2>
        <p class="lead">{line}</p>
        <ul class="flower-list">{"".join(f"<li>{f}</li>" for f in fl)}</ul>
        <a class="btn" href="{enquire_link(**{"for": "Bouquet or arrangement"})}">Enquire about {n.lower()} flowers {ARROW}</a>
      </div>
    </div>
  </section>''' for k, n, months, colour, art, fl, line in SEASONS)
seasons = head("What’s in season · Birdie Blooms", "Seasonal flowers through the year, from amaryllis in winter to dahlias in autumn.") + bar("seasons.html", False) + f'''
<main id="main">
  {page_hero("What’s in season", "Flowers for every season.", "From amaryllis at Christmas to dahlias in September, here’s what I look forward to through the year.", "block-butter", "tulip")}
  {panels}
  {cta_band("Not sure what to choose?", "Tell me the occasion and the colours you like, and I’ll pick the best of what’s in season.", "Make an enquiry", enquire_link())}
</main>
''' + footer()
write("seasons.html", seasons)

# ===========================================================================================
# ABOUT
# ===========================================================================================
about = head("About · Birdie Blooms", "Birdie Blooms is a one-woman flower studio in Ravenstone &amp; Kibworth, Leicestershire.") + bar("about.html", False) + f'''
<main id="main">
  <section class="section block-pastel">
    <div class="split">
      <img class="split-img" src="{IMG}bb-birdie-bunch.webp" alt="A hand-tied bouquet of dahlias and hydrangea carried over a shoulder" data-up>
      <div class="prose" data-up>
        <p class="label">About</p>
        <h1 class="big-serif">Hello, and welcome to Birdie Blooms.</h1>
        <p>Birdie Blooms is a small flower studio in Ravenstone and Kibworth, Leicestershire, run by me, one florist with a lot of buckets.</p>
        <p>I make loose, garden-style flowers with a little bit of yesterday in them: soft, nostalgic colours, seasonal stems and the odd surprise, like a pumpkin tucked into an autumn arrangement.</p>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="section-head center" data-up><p class="label">How I work</p><h2 class="big-serif">Three things I care about.</h2></div>
    <div class="values">
      <div class="value" data-up>{illo("tulip")}<h3>Seasonal first</h3><p>I use what’s growing now, so your flowers look and smell like the time of year.</p></div>
      <div class="value" data-up>{illo("bird")}<h3>Made by hand</h3><p>Every bunch is made to order, never pulled from a fridge of ready-mades.</p></div>
      <div class="value" data-up>{illo("wheat")}<h3>Close to home</h3><p>Made in Ravenstone and Kibworth and delivered nearby, often by me.</p></div>
    </div>
  </section>

  <section class="section block-bloom">
    <div class="split">
      <div class="prose" data-up>
        <p class="label">Where I deliver</p>
        <h2 class="big-serif">Ravenstone, Kibworth and the villages nearby.</h2>
        <p>Collection is welcome too. If you’re further afield, ask and I’ll let you know what I can do.</p>
      </div>
      <img class="split-img" src="{IMG}bb-pumpkin-orange.webp" alt="An autumn arrangement with a pumpkin and ribbon" loading="lazy" data-up>
    </div>
  </section>

  {cta_band("Let’s make something lovely.", "Flowers for a big day, a Tuesday, or someone who deserves them. Tell me what you have in mind.", "Make an enquiry", enquire_link())}
</main>
''' + footer()
write("about.html", about)

# ===========================================================================================
# ENQUIRE (contact.html)
# ===========================================================================================
what_options = ["Bouquet or arrangement", "Autumn bouquets", "Florist’s choice", "Wedding", "Event or party", "Sympathy", "The Birdie Card", "Something else"]
contact_form = f'''<div class="form-shell">
      <form class="form" data-enquiry data-subject="Flower enquiry" novalidate>
        <div class="field"><label for="c-name">Your name</label><input id="c-name" name="name" data-label="Name" required autocomplete="name"></div>
        <div class="field"><label for="c-email">Email</label><input id="c-email" name="email" type="email" data-label="Email" required autocomplete="email"></div>
        <div class="field"><label for="c-phone">Phone <span class="opt">optional</span></label><input id="c-phone" name="phone" type="tel" data-label="Phone" autocomplete="tel"></div>
        <div class="field"><label for="c-what">What it’s for</label><select id="c-what" name="what" data-label="For">{"".join(f'<option>{o}</option>' for o in what_options)}</select></div>
        <div class="field full"><label for="c-bouquet">Which bouquet <span class="opt">if you know</span></label><input id="c-bouquet" name="bouquet" data-label="Bouquet" list="bouquets"><datalist id="bouquets">{"".join(f'<option value="{p[0]}">' for p in PRODUCTS)}</datalist></div>
        <div class="field"><label for="c-date">Date needed</label><input id="c-date" name="date" type="date" data-label="Date"></div>
        <fieldset class="field"><legend>Delivery or collection</legend><div class="choices">
          <label class="choice"><input type="radio" name="how" value="Delivery" data-label="Delivery or collection" checked><span>Delivery</span></label>
          <label class="choice"><input type="radio" name="how" value="Collection" data-label="Delivery or collection"><span>Collection</span></label>
        </div></fieldset>
        <div class="field full"><label for="c-where">Delivery address or postcode <span class="opt">for delivery</span></label><input id="c-where" name="where" data-label="Deliver to" autocomplete="postal-code"></div>
        <div class="field full"><label for="c-msg">Anything else</label><textarea id="c-msg" name="message" data-label="Message" placeholder="Who the flowers are for, colours they love, your budget, a message for the card…"></textarea></div>
        <button class="btn" type="submit">Send enquiry {ARROW}</button>
      </form>
      <div class="form-done" role="status"><h3>Thank you.</h3><p>Your email is ready to send. Once it’s on its way, I’ll come back to you as soon as I can.</p></div>
    </div>'''
contact = head("Enquire · Birdie Blooms", "Enquire about flowers, weddings and events from Birdie Blooms in Ravenstone &amp; Kibworth.") + bar("contact.html", False) + f'''
<main id="main">
  {page_hero("Enquire", "Let’s talk flowers.", "Tell me what you’d like, when and where, and I’ll come back to you with ideas and a price.", "block-butter", "bird")}
  <section class="section" id="enquire">
    <div class="form-wrap">
      {contact_form}
      <aside class="aside" data-up>
        <div class="aside-card"><p class="label">What happens next</p><ol><li>I’ll reply with what’s possible and a price.</li><li>You pay through a secure link to confirm.</li><li>Your flowers are made fresh for the day.</li></ol></div>
        <div class="aside-card"><p class="label">Other ways to reach me</p><p><a href="mailto:{EMAIL}">{EMAIL}</a><br><a href="{INSTA}">Instagram @birdie.blooms</a></p></div>
        <div class="aside-card"><p class="label">Getting married?</p><p>There’s a wedding enquiry form with a few more questions on the <a href="weddings.html#enquire">weddings page</a>.</p></div>
      </aside>
    </div>
  </section>
</main>
''' + footer()
write("contact.html", contact)

# ===========================================================================================
# GOOD TO KNOW (policies.html)
# ===========================================================================================
policies = [
    ("ordering", "Ordering &amp; payment", [
        "Every order starts with an enquiry. Tell me what you’d like and when, and I’ll reply with what’s possible and a price.",
        "Once you’re happy, I’ll send you a secure link to pay. Your order is confirmed once it’s paid."]),
    ("delivery", "Delivery &amp; collection", [
        "I deliver around Ravenstone, Kibworth and the villages nearby. If you’re further afield, ask and I’ll let you know what I can do.",
        "Collection is welcome too. I’ll agree a time with you when you order.",
        "If nobody’s in, I’ll leave the flowers somewhere safe and sheltered, or with a neighbour, and let you know where."]),
    ("seasonal", "Seasonal flowers", [
        "I work with what’s in season, so no two bunches are quite the same. Photos show the style and colours; your flowers may vary a little depending on what’s at its best that week.",
        "If something isn’t available, I’ll swap it for something of the same feel and value."]),
    ("care", "Flower care", [
        "A little care helps your flowers last:",
        "<ul><li>Trim the stems at an angle and put them straight into clean water.</li><li>Keep them out of direct sun and away from radiators and fruit bowls.</li><li>Change the water every couple of days and trim again.</li><li>Take out any stems as they fade, and the rest will carry on.</li></ul>"]),
    ("changes", "Changes &amp; cancellations", [
        "Flowers are bought fresh for each order, so please let me know about any changes as soon as you can. I’ll always do my best to help.",
        "Wedding and event bookings have their own terms, which I’ll send with your proposal."]),
    ("privacy", "Privacy", [
        "When you enquire, I use your name and contact details only to reply to you and arrange your flowers. I don’t share them with anyone else.",
        "If you sign up for seasonal letters, I’ll only use your email to send them, and you can stop them at any time.",
        f"To see or delete what I hold about you, email <a href=\"mailto:{EMAIL}\">{EMAIL}</a>."]),
]
pol_html = "".join(f'<section class="policy" id="{k}" data-up><h2>{t}</h2><div>{"".join(p if p.startswith("<ul>") else f"<p>{p}</p>" for p in ps)}</div></section>' for k, t, ps in policies)
toc = "".join(f'<a href="#{k}">{t}</a>' for k, t, _ in policies)
good = head("Good to know · Birdie Blooms", "Ordering, delivery, flower care and privacy at Birdie Blooms.") + bar("policies.html", False) + f'''
<main id="main">
  {page_hero("Good to know", "The small print, kept small.", "How ordering, delivery and payment work, how to look after your flowers, and how I look after your details.", "block-pastel", "sprig")}
  <section class="section">
    <nav class="toc" aria-label="On this page" data-up>{toc}</nav>
    <div style="margin-top:50px">{pol_html}</div>
  </section>
  {cta_band("Still have a question?", "Just ask. I’m happy to help.", "Get in touch", enquire_link())}
</main>
''' + footer()
write("policies.html", good)
