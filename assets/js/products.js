/* =========================================================================
   Birdie Blooms — the shop list.
   Edit names, words and prices here; the shop and the homepage update.
   category: any of  edit · hand-tied · vase · posy · dried · sympathy  (space-separated)
             "edit" = the current seasonal collection, shown first on the home page and shop
   sizes:    one or more { label, price } — the first is the "from" price
   img:      a photo, or null to show a "photo coming soon" panel (set placeholder text)
   enquire:  true → shows an "Enquire" button instead of "Add to basket"

   The First Edit (top three) is her real autumn collection from Instagram.
   Everything below it is a placeholder range to confirm, re-price or delete.
   ========================================================================= */
window.BB_PRODUCTS = [
  {
    id: "the-birdie-bunch",
    name: "The Birdie Bunch",
    category: "edit hand-tied",
    badge: "The First Edit", badgeAccent: true,
    desc: "A hand-tied, florist’s-choice seasonal bouquet. Dahlias, hydrangea, eucalyptus and whatever else the week brings, wrapped and ready to give.",
    img: "assets/img/bb-birdie-bunch.webp", w: 1080, h: 1350,
    alt: "Seen from behind, a woman in a denim jacket holds a large hand-tied bouquet of pink dahlias, white hydrangea, eucalyptus and dried grasses",
    sizes: [{ label: "Hand-tied", price: 35 }],
    note: "Collection or local delivery"
  },
  {
    id: "pumpkin-edit-orange",
    name: "The Pumpkin Edit · Orange",
    category: "edit",
    badge: "The First Edit", badgeAccent: true,
    desc: "Seasonal flowers styled in an orange pumpkin: dahlias, burgundy hydrangea, amaranth and pincushion protea, finished with a chocolate satin bow.",
    img: "assets/img/bb-pumpkin-orange.webp", w: 1080, h: 1350,
    alt: "An autumn arrangement of red dahlias, burgundy hydrangea, amaranth and eucalyptus in an orange pumpkin, tied with a brown satin ribbon",
    sizes: [{ label: "In an orange pumpkin", price: 35 }],
    note: "Collection or local delivery"
  },
  {
    id: "pumpkin-edit-ghost",
    name: "The Pumpkin Edit · Ghost",
    category: "edit",
    badge: "The First Edit", badgeAccent: true,
    desc: "A white pumpkin with a seasonal floral arrangement. Softer and paler than its orange twin, for people who like their autumn quiet.",
    img: null,
    placeholder: "A white pumpkin, seasonal flowers. Photo coming soon.",
    alt: "",
    sizes: [{ label: "In a white pumpkin", price: 35 }],
    note: "Collection or local delivery"
  },
  {
    id: "peony-season",
    name: "Peony Season",
    category: "hand-tied",
    badge: "May – June only", badgeAccent: true,
    desc: "Fat, blush-pink peonies and nothing else. Bought at their best and tied tight, so they open slowly over the week.",
    img: "assets/img/hero-peonies.webp", w: 1350, h: 1800,
    alt: "A bunch of pink peonies wrapped in white paper against a white wall",
    sizes: [{ label: "Classic", price: 55 }, { label: "Generous", price: 78 }, { label: "Abundant", price: 110 }],
    note: "Limited stems each week"
  },
  {
    id: "the-tuesday-posy",
    name: "The Tuesday Posy",
    category: "posy",
    desc: "A small, cheerful posy for no reason at all. The easiest way to make someone’s week.",
    img: "assets/img/shop-tuesday-posy.webp", w: 733, h: 1100,
    alt: "A hand holding a small posy of white and green flowers against a pale wall",
    sizes: [{ label: "One size", price: 32 }],
    note: "Hand-delivered locally"
  },
  {
    id: "the-studio-vase",
    name: "The Studio Vase",
    category: "vase",
    desc: "Arranged in a hand-thrown ceramic vase that’s theirs to keep. No unwrapping, no hunting for scissors.",
    img: "assets/img/shop-peony-vase.webp", w: 733, h: 1100,
    alt: "Pink peonies arranged in a white ribbed ceramic vase in soft natural light",
    sizes: [{ label: "Medium", price: 85 }, { label: "Large", price: 125 }],
    note: "Vase included"
  },
  {
    id: "garden-hydrangea",
    name: "Garden Hydrangea",
    category: "hand-tied",
    badge: "Late summer",
    desc: "Cloud-soft hydrangea heads in lilac, white and cream, finished with whatever the garden is giving this week.",
    img: "assets/img/shop-hydrangea.webp", w: 825, h: 1100,
    alt: "A hand holding a bouquet of lilac, blue and white hydrangeas against a white wall",
    sizes: [{ label: "Classic", price: 52 }, { label: "Generous", price: 75 }],
    note: "Same-day when ordered by 11am"
  },
  {
    id: "white-tulips",
    name: "White Tulips, Simply",
    category: "vase",
    desc: "Twenty-five white tulips in a clear glass vase. Quiet, elegant and always right.",
    img: "assets/img/shop-white-tulips.webp", w: 733, h: 1100,
    alt: "White tulips in a clear glass vase on a table beside a window",
    sizes: [{ label: "With glass vase", price: 58 }]
  },
  {
    id: "everlasting-dried",
    name: "Everlasting Dried",
    category: "dried",
    desc: "Dried strawflower, bunny tails, poppy heads and grasses in warm autumn tones. Lasts a year or more, no water needed.",
    img: "assets/img/shop-dried.webp", w: 733, h: 1100,
    alt: "Dried flowers in rust, mustard and cream tones against a white wall",
    sizes: [{ label: "Petite", price: 42 }, { label: "Full", price: 65 }],
    note: "Posted nationwide"
  },
  {
    id: "something-green",
    name: "Something Green",
    category: "posy",
    desc: "For people who don’t do pink. Green craspedia, foliage and texture, wrapped in printed kraft paper.",
    img: "assets/img/shop-craspedia.webp", w: 733, h: 1100,
    alt: "A bunch of green button craspedia flowers wrapped in illustrated kraft paper",
    sizes: [{ label: "One size", price: 38 }]
  },
  {
    id: "thank-you-posy",
    name: "The Thank-You Posy",
    category: "posy",
    desc: "Daisies, chamomile and little white things — the floral equivalent of a handwritten note.",
    img: "assets/img/shop-daisy-posy.webp", w: 1400, h: 934,
    alt: "An outstretched hand holding a small bunch of white daisies against a white brick wall",
    sizes: [{ label: "One size", price: 30 }]
  },
  {
    id: "spring-jar",
    name: "Spring Jar",
    category: "vase",
    badge: "Spring",
    desc: "Blush tulips in a ridged glass jar, ready to go straight onto a desk, bedside or kitchen table.",
    img: "assets/img/shop-pink-tulips.webp", w: 733, h: 1100,
    alt: "Pale pink tulips in a ribbed glass vase against a warm neutral background",
    sizes: [{ label: "With glass jar", price: 44 }]
  },
  {
    id: "with-sympathy",
    name: "With Sympathy",
    category: "sympathy",
    desc: "Soft whites and quiet greens, arranged gently and delivered with care and a handwritten card.",
    img: "assets/img/shop-sympathy.webp", w: 733, h: 1100,
    alt: "White narcissi standing upright against a plain white background",
    sizes: [{ label: "Classic", price: 55 }, { label: "Generous", price: 75 }, { label: "Abundant", price: 100 }],
    note: "Handwritten card included"
  },
  {
    id: "funeral-tributes",
    name: "Funeral Tributes",
    category: "sympathy",
    desc: "Wreaths, coffin sprays and posies, designed with you and delivered to the funeral director. Wreaths from £85.",
    img: "assets/img/studio-single-stem.webp", w: 1400, h: 1400,
    alt: "A single stem of delicate white flowers casting a soft shadow on a pale wall",
    sizes: [{ label: "Made to order", price: 85 }],
    enquire: true,
    enquireType: "Sympathy"
  }
];
