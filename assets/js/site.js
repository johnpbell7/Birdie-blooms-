/* =========================================================================
   Birdie Blooms — site behaviour
   1. CONFIG (edit me)          5. Forms (validation + sending)
   2. Helpers                   6. UI: header, menu, quotes, filters
   3. Products (render)         7. Motion (GSAP + ScrollTrigger + SplitText)
   4. Basket + order request
   ========================================================================= */
(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     1. CONFIG — the only block most people need to touch.
     formMode:
       "mailto"   → opens the visitor's email app with the form filled in
                    (works anywhere, no account needed — the default).
       "endpoint" → POSTs to formEndpoint (Formspree, Basin, Web3Forms, your
                    own API). Set formEndpoint to the URL they give you.
       "netlify"  → for sites hosted on Netlify (forms are pre-tagged).
       "preview"  → design previews only: nothing is sent, and the success
                    message says so.
     --------------------------------------------------------------------- */
  var CONFIG = {
    business: "Birdie Blooms",
    email: "hello@birdieblooms.co.uk",
    formMode: "mailto",
    formEndpoint: "",
    preview: false, // true shows a small "design preview" badge
    currency: "£",
    deliveryFee: 6.5,
    freeDeliveryOver: 75,
    openDays: [2, 3, 4, 5, 6] // Tue–Sat (0 = Sunday) for deliveries & collections
  };

  /* ---------------------------------------------------------------------
     2. Helpers
     --------------------------------------------------------------------- */
  var doc = document, root = doc.documentElement;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var hasGSAP = !!window.gsap;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!hasGSAP || reduceMotion) root.classList.remove("motion");
  var motionOn = root.classList.contains("motion");

  function money(n) {
    var whole = Math.round(n * 100) % 100 === 0;
    return CONFIG.currency + (whole ? Math.round(n).toString() : n.toFixed(2));
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function store(key, val) {
    try {
      if (val === undefined) return JSON.parse(localStorage.getItem(key) || "null");
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) { return null; }
  }
  function isoDate(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  var ICON = {
    arrow: '<svg class="arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1.5 8h12.5M9.5 3.5 14 8l-4.5 4.5"/></svg>',
    leaf: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 13.5C3 7 7 3 13.5 2.5 13 9 9 13 2.5 13.5Z"/><path d="M2.5 13.5 9 7"/></svg>',
    squiggle: '<svg class="squiggle" viewBox="0 0 418.7 600.3" aria-hidden="true" focusable="false"><use href="#bb-squiggle" width="418.7" height="600.3"/></svg>'
  };

  /* ---------------------------------------------------------------------
     3. Products — rendered from assets/js/products.js
     --------------------------------------------------------------------- */
  var PRODUCTS = (window.BB_PRODUCTS || []);
  function productById(id) { for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i]; return null; }

  function productCard(p, i) {
    var first = p.sizes[0];
    var many = p.sizes.length > 1 || !!p.enquire;
    var enquireHref = "contact.html?type=" + encodeURIComponent(p.enquireType || "Something else") + "&about=" + encodeURIComponent(p.name);
    var sizes = p.sizes.map(function (s, n) {
      return '<label class="size"><input type="radio" name="size-' + esc(p.id) + '" value="' + n + '"' + (n === 0 ? " checked" : "") + '><span>' + esc(s.label) + "</span></label>";
    }).join("");
    return '<article class="product" data-id="' + esc(p.id) + '" data-cat="' + esc(p.category) + '" data-reveal>' +
      '<div class="product-media" data-reveal-img>' +
        (p.badge ? '<span class="tag' + (p.badgeAccent ? " accent" : "") + '">' + esc(p.badge) + "</span>" : "") +
        (p.img
          ? '<img src="' + esc(p.img) + '" alt="' + esc(p.alt) + '" width="' + (p.w || 800) + '" height="' + (p.h || 1000) + '" loading="' + (i < 3 ? "eager" : "lazy") + '" decoding="async">'
          : '<div class="media-soon">' + ICON.squiggle + '<p>' + esc(p.placeholder || "Photo coming soon.") + "</p></div>") +
        (p.enquire ? "" : '<div class="product-quick"><button class="btn light block sm" type="button" data-add><span class="btn-label">Quick add · ' + esc(first.label) + " " + money(first.price) + "</span></button></div>") +
      "</div>" +
      '<div class="product-top"><h3 class="product-name h4">' + esc(p.name) + '</h3><p class="product-price num">' + (many ? '<span class="from">from</span>' : "") + '<span data-price>' + money(first.price) + "</span></p></div>" +
      '<p class="product-desc">' + esc(p.desc) + "</p>" +
      '<div class="product-foot">' +
        (p.enquire ? '<p class="caption">' + esc(first.label) + "</p>" : many ? '<fieldset class="sizes"><legend>Choose a size for ' + esc(p.name) + "</legend>" + sizes + "</fieldset>" : '<p class="caption">' + esc(first.label) + "</p>") +
        '<div class="product-actions">' + (p.enquire
          ? '<a class="btn sm ghost" href="' + enquireHref + '"><span class="btn-label">Enquire</span>' + ICON.arrow + "</a>"
          : '<button class="btn sm" type="button" data-add><span class="btn-label">Add to basket</span>' + ICON.arrow + "</button>") + "</div>" +
        (p.note ? '<p class="product-note">' + ICON.leaf + esc(p.note) + "</p>" : "") +
      "</div></article>";
  }

  function renderProducts() {
    $$("[data-products]").forEach(function (host) {
      var ids = (host.getAttribute("data-ids") || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
      var list = ids.length ? ids.map(productById).filter(Boolean) : PRODUCTS.slice();
      if (!list.length) {
        host.innerHTML = '<div class="empty-state"><p class="h4">The shop is being restocked.</p><p>Fresh flowers land on Tuesday — or <a href="contact.html">send me a message</a> and I’ll make something for you.</p></div>';
        return;
      }
      host.innerHTML = list.map(productCard).join("") +
        '<div class="empty-state" data-empty hidden><p class="h4">Nothing in this edit right now.</p><p>Seasonal stems come and go — <a href="contact.html">tell me what you’re after</a> and I’ll make it bespoke.</p></div>';
    });
  }

  function selectedSize(card) {
    var p = productById(card.getAttribute("data-id"));
    var r = $("input[type=radio]:checked", card);
    var n = r ? +r.value : 0;
    return { product: p, size: p.sizes[n], index: n };
  }

  doc.addEventListener("change", function (e) {
    var input = e.target;
    if (!input.matches || !input.matches(".size input")) return;
    var card = input.closest(".product"); var sel = selectedSize(card);
    var priceEl = $("[data-price]", card), from = $(".from", card);
    if (from) from.remove();
    var quick = $(".product-quick .btn-label", card);
    if (quick) quick.textContent = "Quick add · " + sel.size.label + " " + money(sel.size.price);
    if (motionOn) {
      var start = parseFloat(priceEl.textContent.replace(/[^\d.]/g, "")) || 0;
      var o = { v: start };
      gsap.to(o, { v: sel.size.price, duration: 0.5, ease: "power2.out", onUpdate: function () { priceEl.textContent = money(Math.round(o.v)); }, onComplete: function () { priceEl.textContent = money(sel.size.price); } });
    } else priceEl.textContent = money(sel.size.price);
  });

  /* ---------------------------------------------------------------------
     4. Basket + order request
     --------------------------------------------------------------------- */
  var BASKET_KEY = "bb-basket-v1";
  var basket = store(BASKET_KEY) || [];
  var drawer = $("#basket"), scrim = $(".scrim");
  var lastFocus = null;
  var step = 1;

  function saveBasket() { store(BASKET_KEY, basket); renderBasket(); }
  function basketCount() { return basket.reduce(function (n, l) { return n + l.qty; }, 0); }
  function subtotal() { return basket.reduce(function (n, l) { return n + l.qty * l.price; }, 0); }

  function addLine(line) {
    var key = line.id + "|" + line.size;
    var found = null;
    basket.forEach(function (l) { if (l.key === key) found = l; });
    if (found) found.qty += 1; else { line.key = key; line.qty = 1; basket.push(line); }
    if (drawer && drawer.classList.contains("is-done")) { drawer.classList.remove("is-done"); setStep(1); }
    saveBasket();
    var badge = $$(".basket-count");
    if (motionOn) badge.forEach(function (b) { gsap.fromTo(b, { scale: 0.4 }, { scale: 1, duration: 0.6, ease: "back.out(3)" }); });
    toast(line.name + " (" + line.size + ") added", "View basket", openBasket);
  }

  function renderBasket() {
    var count = basketCount();
    $$(".basket-count").forEach(function (b) { b.textContent = count; b.setAttribute("data-count", count); });
    $$("[data-basket-label]").forEach(function (b) { b.setAttribute("aria-label", "Basket, " + count + " item" + (count === 1 ? "" : "s")); });
    if (!drawer) return;
    var list = $("[data-basket-lines]", drawer), foot = $(".drawer-foot", drawer);
    if (!basket.length) {
      list.innerHTML = '<div class="basket-empty">' + ICON.squiggle + '<p class="h4">Your basket is empty.</p><p>Let’s fix that. This week’s flowers are in.</p><a class="btn" href="shop.html"><span class="btn-label">Shop flowers</span>' + ICON.arrow + "</a></div>";
      foot.hidden = true; return;
    }
    foot.hidden = step !== 1;
    list.innerHTML = basket.map(function (l, i) {
      return '<div class="line-item">' + (l.img ? '<img src="' + esc(l.img) + '" alt="" width="76" height="95" loading="lazy">' : '<div class="li-soon">' + ICON.squiggle + "</div>") +
        '<div><p class="li-name">' + esc(l.name) + '</p><p class="li-meta">' + esc(l.size) + (l.cadence ? " · " + esc(l.cadence) : "") + "</p>" +
        '<div class="qty" role="group" aria-label="Quantity for ' + esc(l.name) + '"><button type="button" data-qty="-1" data-i="' + i + '" aria-label="One fewer">−</button><output aria-live="polite">' + l.qty + '</output><button type="button" data-qty="1" data-i="' + i + '" aria-label="One more">+</button></div>' +
        '<button type="button" class="li-remove" data-remove="' + i + '">Remove</button></div>' +
        '<p class="li-price">' + money(l.price * l.qty) + "</p></div>";
    }).join("");
    var sub = subtotal(), left = Math.max(0, CONFIG.freeDeliveryOver - sub);
    $("[data-subtotal]", drawer).textContent = money(sub);
    var prog = $("[data-delivery-progress]", drawer);
    prog.querySelector("span").textContent = left > 0 ? "You’re " + money(left) + " away from free local delivery." : "Free local delivery unlocked.";
    prog.querySelector("i").style.transform = "scaleX(" + Math.min(1, sub / CONFIG.freeDeliveryOver) + ")";
    updateTotals();
  }

  function deliveryCost() {
    var method = $("[name=method]:checked", drawer);
    if (method && method.value === "Collection") return 0;
    return subtotal() >= CONFIG.freeDeliveryOver ? 0 : CONFIG.deliveryFee;
  }
  function updateTotals() {
    if (!drawer) return;
    var d = deliveryCost();
    $$("[data-delivery]", drawer).forEach(function (el) { el.textContent = d === 0 ? "Free" : money(d); });
    $$("[data-total]", drawer).forEach(function (el) { el.textContent = money(subtotal() + d); });
  }

  function setStep(n) {
    if (!drawer) return;
    step = n;
    $$("[data-step]", drawer).forEach(function (s) { s.hidden = s.getAttribute("data-step") !== String(n); });
    var foot = $(".drawer-foot", drawer); if (foot) foot.hidden = n !== 1 || !basket.length;
    var title = $("#basket-title"); if (title) title.textContent = n === 1 ? "Your basket" : n === 2 ? "Delivery details" : "Order sent";
    var body = $(".drawer-body", drawer); if (body) body.scrollTop = 0;
  }

  function openBasket() {
    if (!drawer) return;
    lastFocus = doc.activeElement;
    setStep(drawer.classList.contains("is-done") ? 3 : 1);
    drawer.classList.add("is-open"); scrim.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    doc.body.style.overflow = "hidden";
    setTimeout(function () { var c = $(".drawer-close", drawer); if (c) c.focus(); }, 60);
  }
  function closeBasket() {
    if (!drawer || !drawer.classList.contains("is-open")) return;
    drawer.classList.remove("is-open"); scrim.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    doc.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function flyToBasket(img) {
    var target = $(".nav-actions [data-open-basket]");
    if (!motionOn || !img || !target) return;
    var a = img.getBoundingClientRect(), b = target.getBoundingClientRect();
    var ghost = img.cloneNode(); ghost.removeAttribute("loading");
    ghost.setAttribute("aria-hidden", "true");
    Object.assign(ghost.style, { position: "fixed", left: a.left + "px", top: a.top + "px", width: a.width + "px", height: a.height + "px", objectFit: "cover", borderRadius: "4px", zIndex: 95, pointerEvents: "none", margin: 0 });
    doc.body.appendChild(ghost);
    gsap.timeline({ onComplete: function () { ghost.remove(); } })
      .to(ghost, { x: b.left + b.width / 2 - (a.left + a.width / 2), y: b.top + b.height / 2 - (a.top + a.height / 2), scale: 0.08, borderRadius: "50%", duration: 0.85, ease: "power3.inOut" })
      .to(ghost, { autoAlpha: 0, duration: 0.2 }, "-=0.2");
  }

  doc.addEventListener("click", function (e) {
    var t = e.target;
    var add = t.closest && t.closest("[data-add]");
    if (add) {
      var card = add.closest(".product");
      var sel = selectedSize(card);
      addLine({ id: sel.product.id, name: sel.product.name, size: sel.size.label, price: sel.size.price, img: sel.product.img });
      flyToBasket($(".product-media img", card));
      return;
    }
    var sub = t.closest && t.closest("[data-subscribe]");
    if (sub) {
      var tier = sub.closest("[data-tier]");
      var cad = tier ? $("input[name=cadence-" + tier.getAttribute("data-tier") + "]:checked", tier) : null;
      addLine({ id: "sub-" + sub.getAttribute("data-subscribe"), name: sub.getAttribute("data-name"), size: sub.getAttribute("data-size"), price: +sub.getAttribute("data-price"), img: sub.getAttribute("data-img"), cadence: cad ? cad.value : "Weekly" });
      return;
    }
    if (t.closest && t.closest("[data-open-basket]")) { e.preventDefault(); openBasket(); return; }
    if (t.closest && (t.closest(".drawer-close") || t === scrim)) { closeBasket(); return; }
    var q = t.closest && t.closest("[data-qty]");
    if (q) { var l = basket[+q.getAttribute("data-i")]; l.qty = Math.max(0, l.qty + (+q.getAttribute("data-qty"))); if (!l.qty) basket.splice(+q.getAttribute("data-i"), 1); saveBasket(); return; }
    var rm = t.closest && t.closest("[data-remove]");
    if (rm) { basket.splice(+rm.getAttribute("data-remove"), 1); saveBasket(); return; }
    if (t.closest && t.closest("[data-checkout]")) { setStep(2); var f = $("#order-name"); if (f) f.focus(); return; }
    if (t.closest && t.closest("[data-back]")) { setStep(1); return; }
  });
  doc.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeBasket(); closeMenu(); } });
  if (drawer) {
    drawer.addEventListener("change", function (e) {
      if (e.target.name !== "method") return;
      updateTotals();
      var collecting = e.target.value === "Collection";
      $$("[data-delivery-only]", drawer).forEach(function (el) {
        el.hidden = collecting;
        $$("input,textarea", el).forEach(function (i) { if (i.hasAttribute("data-req")) i.required = !collecting; });
      });
    });
    // simple focus trap while open
    drawer.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      var f = $$("a[href],button:not([disabled]),input:not([type=hidden]):not(.hp-field input),select,textarea", drawer).filter(function (el) { return el.offsetParent !== null; });
      if (!f.length) return;
      if (e.shiftKey && doc.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && doc.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
  }

  var toastEl = null, toastTimer = null;
  function toast(msg, actionLabel, action) {
    if (!toastEl) {
      toastEl = doc.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); toastEl.setAttribute("aria-live", "polite");
      doc.body.appendChild(toastEl);
    }
    toastEl.innerHTML = "<span>" + esc(msg) + "</span>" + (actionLabel ? '<button type="button">' + esc(actionLabel) + "</button>" : "");
    if (action) toastEl.querySelector("button").onclick = function () { toastEl.classList.remove("is-on"); action(); };
    requestAnimationFrame(function () { toastEl.classList.add("is-on"); });
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastEl.classList.remove("is-on"); }, 4200);
  }

  /* ---------------------------------------------------------------------
     5. Forms — validation, then send via CONFIG.formMode
     --------------------------------------------------------------------- */
  var MSG = {
    valueMissing: "Please fill this in so we can get back to you.",
    typeMismatch: { email: "That email doesn’t look quite right — try name@example.com.", url: "Please paste a full link, starting https://" },
    tooShort: "A little more detail would help.",
    patternMismatch: "Please check the format.",
    rangeUnderflow: "Please choose a date in the future."
  };
  function fieldMessage(input) {
    var v = input.validity, custom = input.getAttribute("data-error");
    if (v.valueMissing) return custom || MSG.valueMissing;
    if (v.typeMismatch) return MSG.typeMismatch[input.type] || MSG.patternMismatch;
    if (v.tooShort) return MSG.tooShort;
    if (v.patternMismatch) return custom || MSG.patternMismatch;
    if (v.rangeUnderflow) return MSG.rangeUnderflow;
    if (v.customError) return input.validationMessage;
    return "";
  }
  function checkDay(input) {
    if (!input.hasAttribute("data-open-days") || !input.value) return;
    var d = new Date(input.value + "T12:00:00");
    input.setCustomValidity(CONFIG.openDays.indexOf(d.getDay()) < 0 ? "We deliver and open the studio Tuesday to Saturday — please pick one of those days." : "");
  }
  function validateField(input) {
    checkDay(input);
    var field = input.closest(".field"); if (!field) return true;
    var group = $$("input[name='" + input.name + "']", field);
    var ok = input.type === "checkbox" && group.length > 1 && input.hasAttribute("data-min-one") ? group.some(function (c) { return c.checked; }) : input.checkValidity();
    var err = $(".error", field);
    field.classList.toggle("is-invalid", !ok);
    input.setAttribute("aria-invalid", ok ? "false" : "true");
    if (err) err.querySelector("span").textContent = ok ? "" : (input.type === "checkbox" && !input.checkValidity() ? "Please tick to continue." : fieldMessage(input) || "Please choose at least one.");
    return ok;
  }
  function serialise(form) {
    var lines = [], seen = {};
    $$("input,select,textarea", form).forEach(function (el) {
      if (!el.name || el.type === "hidden" || el.closest(".hp-field") || el.disabled) return;
      if (el.closest("[hidden]")) return;
      var label = el.getAttribute("data-label") || el.name;
      if ((el.type === "radio" || el.type === "checkbox")) {
        if (seen[el.name]) return; seen[el.name] = true;
        var vals = $$("input[name='" + el.name + "']:checked", form).map(function (c) { return c.value; });
        if (vals.length) lines.push(label + ": " + vals.join(", "));
        return;
      }
      if (el.value.trim()) lines.push(label + ": " + el.value.trim());
    });
    return lines;
  }
  function basketSummary() {
    if (!basket.length) return [];
    var out = ["", "ORDER"];
    basket.forEach(function (l) { out.push("• " + l.qty + " × " + l.name + " — " + l.size + (l.cadence ? " (" + l.cadence + ")" : "") + " — " + money(l.price * l.qty)); });
    out.push("Delivery: " + (deliveryCost() === 0 ? "Free" : money(deliveryCost())));
    out.push("Total: " + money(subtotal() + deliveryCost()));
    return out;
  }

  function sendForm(form) {
    var subject = form.getAttribute("data-subject") || "Website enquiry";
    var nameField = $("[name=name]", form);
    if (nameField && nameField.value) subject += " — " + nameField.value.trim();
    var lines = serialise(form);
    if (form.hasAttribute("data-order")) lines = lines.concat(basketSummary());
    var fd = new FormData(form);
    fd.append("_subject", subject);
    if (form.hasAttribute("data-order")) fd.append("order", basketSummary().join("\n"));

    if (CONFIG.formMode === "endpoint" && CONFIG.formEndpoint) {
      return fetch(CONFIG.formEndpoint, { method: "POST", body: fd, headers: { Accept: "application/json" } })
        .then(function (r) { if (!r.ok) throw new Error("bad status"); });
    }
    if (CONFIG.formMode === "preview") return new Promise(function (res) { setTimeout(res, 400); });
    if (CONFIG.formMode === "netlify") {
      return fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(fd).toString() })
        .then(function (r) { if (!r.ok) throw new Error("bad status"); });
    }
    var body = lines.join("\n") + "\n\n— sent from the " + CONFIG.business + " website";
    window.location.href = "mailto:" + CONFIG.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    return new Promise(function (res) { setTimeout(res, 500); });
  }

  function initForms() {
    var today = isoDate(new Date());
    $$("input[type=date][data-future]").forEach(function (d) { d.min = today; });
    $$("form[data-form]").forEach(function (form) {
      form.setAttribute("novalidate", "");
      var attempted = false;
      form.addEventListener("input", function (e) { if (attempted || e.target.closest(".is-invalid")) validateField(e.target); });
      form.addEventListener("change", function (e) { if (attempted || e.target.closest(".is-invalid")) validateField(e.target); });
      form.addEventListener("focusout", function (e) { if (attempted && e.target.matches("input,select,textarea")) validateField(e.target); });
      form.addEventListener("submit", function (e) {
        e.preventDefault(); attempted = true;
        var hp = $(".hp-field input", form); if (hp && hp.value) return; // bot
        var bad = null;
        $$("input,select,textarea", form).forEach(function (el) {
          if (!el.name || el.type === "hidden" || el.closest("[hidden]")) return;
          if (!validateField(el) && !bad) bad = el;
        });
        var status = $(".form-status", form);
        if (bad) {
          if (status) { status.className = "form-status is-error"; status.textContent = "A couple of things need a look — they’re marked below."; }
          bad.focus({ preventScroll: true });
          bad.closest(".field").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
          return;
        }
        if (status) { status.className = "form-status"; status.textContent = ""; }
        var btn = $("[type=submit]", form); if (btn) btn.classList.add("is-loading");
        sendForm(form).then(function () {
          if (form.hasAttribute("data-order")) {
            basket = []; store(BASKET_KEY, basket); form.reset(); attempted = false;
            drawer.classList.add("is-done"); setStep(3); renderBasket();
            $$("[data-mailto-note]", drawer).forEach(function (n) { noteFor(n); });
            var done = $("[data-step='3'] .form-success", drawer); if (done) { done.setAttribute("tabindex", "-1"); done.focus(); }
            return;
          }
          var shell = form.closest("[data-form-shell]") || form.parentElement;
          shell.classList.add("is-sent");
          $$("[data-mailto-note]", shell).forEach(function (n) { noteFor(n); });
          var ok = $(".form-success", shell) || $(".is-sent-msg", shell);
          if (ok) {
            ok.setAttribute("tabindex", "-1"); ok.focus({ preventScroll: true });
            if (shell.getBoundingClientRect().top < 0) shell.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
            if (motionOn) gsap.from(ok, { autoAlpha: 0, y: 24, duration: 0.8, ease: "power3.out" });
          }
        }).catch(function () {
          if (status) { status.className = "form-status is-error"; status.innerHTML = "That didn’t send — please try again, or email us at <a href=\"mailto:" + CONFIG.email + "\">" + CONFIG.email + "</a>."; }
        }).then(function () { if (btn) btn.classList.remove("is-loading"); });
      });
    });
    // pre-fill enquiry type from links like contact.html?type=Sympathy
    var params = new URLSearchParams(location.search);
    var type = params.get("type"), product = params.get("about");
    if (type) $$("select[name=type], input[name=type]").forEach(function (el) {
      if (el.tagName === "SELECT") { $$("option", el).forEach(function (o) { if (o.value === type || o.text === type) el.value = o.value; }); }
      else if (el.value === type) el.checked = true;
    });
    var msg = $("form[data-form] textarea[name=message]");
    if (product && msg && !msg.value) msg.value = "I'd love to ask about the " + product + ". ";
    $$("[data-package]").forEach(function (b) {
      b.addEventListener("click", function () {
        var m = $("#w-message"); if (m && !m.value) m.value = "We're interested in " + b.getAttribute("data-package") + ". ";
      });
    });
  }

  function noteFor(n) {
    if (CONFIG.formMode === "preview") { n.textContent = "Preview only: this form isn’t connected yet, so nothing was sent."; n.hidden = false; }
    else n.hidden = CONFIG.formMode !== "mailto";
  }

  /* ---------------------------------------------------------------------
     6. UI — header, mobile menu, filters, quotes
     --------------------------------------------------------------------- */
  var header = $(".site-header"), menu = $("#mobile-menu"), menuBtn = $(".menu-toggle");
  var lastY = 0;
  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    if (header) {
      header.classList.toggle("is-scrolled", y > 10);
      header.classList.toggle("is-hidden", y > 420 && y > lastY && !(menu && menu.classList.contains("is-open")));
    }
    lastY = y;
  }, { passive: true });

  function openMenu() {
    if (!menu) return;
    menu.classList.add("is-open"); menu.setAttribute("aria-hidden", "false");
    menuBtn.setAttribute("aria-expanded", "true"); doc.body.style.overflow = "hidden";
    if (motionOn) gsap.fromTo($$("li a, .mm-foot > *", menu), { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.7, stagger: 0.05, ease: "power3.out" });
    var c = $(".mobile-menu-close", menu); if (c) c.focus();
  }
  function closeMenu() {
    if (!menu || !menu.classList.contains("is-open")) return;
    menu.classList.remove("is-open"); menu.setAttribute("aria-hidden", "true");
    menuBtn.setAttribute("aria-expanded", "false"); doc.body.style.overflow = "";
    menuBtn.focus();
  }
  if (menuBtn) menuBtn.addEventListener("click", openMenu);
  if (menu) { $$(".mobile-menu-close, a", menu).forEach(function (a) { a.addEventListener("click", function () { if (a.classList.contains("mobile-menu-close")) closeMenu(); else { menu.classList.remove("is-open"); doc.body.style.overflow = ""; } }); }); }

  function initFilters() {
    var bar = $("[data-filters]"); if (!bar) return;
    var grid = $(bar.getAttribute("data-filters"));
    var chips = $$(".chip", bar);
    chips.forEach(function (c) {
      var f = c.getAttribute("data-filter"), n = f === "all" ? $$(".product", grid).length : $$('.product[data-cat~="' + f + '"]', grid).length;
      var span = $(".n", c); if (span) span.textContent = n;
    });
    function apply(f, animate) {
      var cards = $$(".product", grid);
      var state = animate && motionOn && window.Flip ? Flip.getState(cards) : null;
      chips.forEach(function (c) { c.setAttribute("aria-pressed", c.getAttribute("data-filter") === f ? "true" : "false"); });
      var shown = 0;
      cards.forEach(function (c) { var on = f === "all" || (" " + c.getAttribute("data-cat") + " ").indexOf(" " + f + " ") > -1; c.hidden = !on; if (on) shown++; });
      var empty = $("[data-empty]", grid); if (empty) empty.hidden = shown > 0;
      if (state) Flip.from(state, { duration: 0.7, ease: "power3.inOut", absolute: true, scale: true, onEnter: function (els) { return gsap.fromTo(els, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.6 }); }, onLeave: function (els) { return gsap.to(els, { autoAlpha: 0, duration: 0.3 }); }, onComplete: function () { if (window.ScrollTrigger) ScrollTrigger.refresh(); } });
      var live = $("[data-filter-status]"); if (live) live.textContent = shown + " arrangement" + (shown === 1 ? "" : "s") + " shown";
    }
    chips.forEach(function (c) { c.addEventListener("click", function () { var f = c.getAttribute("data-filter"); apply(f, true); history.replaceState(null, "", f === "all" ? location.pathname : "#" + f); }); });
    var hash = location.hash.replace("#", "");
    if (hash && chips.some(function (c) { return c.getAttribute("data-filter") === hash; })) apply(hash, false);
  }

  function initQuotes() {
    $$("[data-quotes]").forEach(function (wrap) {
      var items = $$(".quote", wrap), i = 0, timer = null;
      var count = $(".quote-count", wrap);
      if (items.length < 2) return;
      function show(n) {
        var prev = items[i]; i = (n + items.length) % items.length; var next = items[i];
        if (count) count.textContent = (i + 1) + " / " + items.length;
        if (prev === next) return;
        if (motionOn) {
          gsap.to(prev, { autoAlpha: 0, y: -16, duration: 0.45, ease: "power2.in", onComplete: function () { prev.classList.remove("is-active"); gsap.set(prev, { clearProps: "all" }); } });
          next.classList.add("is-active");
          gsap.fromTo(next, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.8, delay: 0.3, ease: "power3.out" });
        } else { prev.classList.remove("is-active"); next.classList.add("is-active"); }
      }
      function play() { stop(); if (!reduceMotion) timer = setInterval(function () { show(i + 1); }, 7000); }
      function stop() { clearInterval(timer); }
      $$("[data-quote-dir]", wrap).forEach(function (b) { b.addEventListener("click", function () { show(i + (+b.getAttribute("data-quote-dir"))); play(); }); });
      wrap.addEventListener("mouseenter", stop); wrap.addEventListener("mouseleave", play);
      wrap.addEventListener("focusin", stop); wrap.addEventListener("focusout", play);
      if (count) count.textContent = "1 / " + items.length;
      play();
    });
  }

  // seasons: preview another season from the seasons page (this tab only)
  function initSeasons() {
    var key = "bb-season-preview";
    $$("[data-preview-season]").forEach(function (b) {
      b.addEventListener("click", function () {
        try { sessionStorage.setItem(key, b.getAttribute("data-preview-season")); } catch (e) {}
        location.href = "index.html";
      });
    });
    if (!root.hasAttribute("data-season-preview")) return;
    var season = root.getAttribute("data-season");
    var chip = doc.createElement("div"); chip.className = "season-chip"; chip.setAttribute("role", "status");
    chip.innerHTML = "<span>Previewing " + esc(season) + "</span><button type=\"button\">Back to today</button>";
    chip.querySelector("button").addEventListener("click", function () {
      try { sessionStorage.removeItem(key); } catch (e) {}
      location.reload();
    });
    doc.body.appendChild(chip);
  }

  function initYear() { $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); }); }

  /* ---------------------------------------------------------------------
     7. Motion — GSAP (only when available and motion is welcome)
     --------------------------------------------------------------------- */
  function splitLines(el) {
    if (!window.SplitText) return null;
    return SplitText.create(el, { type: "lines", mask: "lines", linesClass: "split-line" });
  }

  // Ink the brand squiggle in along its centre line (mask path inside each [data-draw] svg)
  function drawSquiggle(svg, opts) {
    var line = $(".sq-line", svg); if (!line) return null;
    var len = line.getTotalLength();
    gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
    gsap.set(svg, { visibility: "visible" });
    return gsap.to(line, Object.assign({ strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" }, opts || {}));
  }

  function heroIntro() {
    var tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    var kids = [];
    $$(".hero-copy, .page-hero-copy").forEach(function (c) { kids = kids.concat($$(":scope > *", c)); });
    if (kids.length) {
      var head = $(".hero .display, .page-hero .display");
      var rest = kids.filter(function (el) { return el !== head; });
      gsap.set(kids, { visibility: "visible" });
      var split = head ? splitLines(head) : null;
      if (split) tl.from(split.lines, { yPercent: 110, duration: 1.3, stagger: 0.12, onComplete: function () { split.revert(); } }, 0);
      else if (head) tl.from(head, { y: 40, autoAlpha: 0, duration: 1.1 }, 0);
      tl.from(rest, { y: 28, autoAlpha: 0, duration: 1, stagger: 0.08, ease: "power3.out" }, 0.45);
    }
    var frames = $$(".hero-visual .frame");
    frames.forEach(function (f, n) {
      gsap.set(f, { visibility: "visible" });
      tl.fromTo(f, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" }, 0.15 + n * 0.25)
        .from($$("img", f).filter(function (im) { return im.offsetParent !== null; }), { scale: 1.35, duration: 1.9, ease: "expo.out" }, 0.25 + n * 0.25);
    });
    var sq = $(".hero-squiggle");
    if (sq) { var d = drawSquiggle(sq, { duration: 1.8 }); if (d) tl.add(d, 0.9); }
    return tl;
  }

  function initLoader() {
    var loader = $(".loader");
    if (!loader || !root.classList.contains("intro")) return null;
    try { sessionStorage.setItem("bb-seen", "1"); } catch (e) {}
    var tl = gsap.timeline({ onComplete: function () { root.classList.remove("intro"); gsap.set(loader, { clearProps: "all" }); } });
    var sq = $(".loader-squiggle", loader);
    if (sq) tl.add(drawSquiggle(sq, { duration: 1.1, ease: "power2.inOut" }), 0);
    tl.from($(".loader-logo", loader), { autoAlpha: 0, y: 14, duration: 0.8, ease: "power3.out" }, 0.55)
      .to(loader, { clipPath: "inset(0% 0% 100% 0%)", duration: 1, ease: "expo.inOut" }, "+=0.35");
    return tl;
  }

  function initMotion() {
    gsap.registerPlugin(ScrollTrigger);
    if (window.SplitText) gsap.registerPlugin(SplitText);
    if (window.Flip) gsap.registerPlugin(Flip);
    var mm = gsap.matchMedia();

    (function () {
      // intro: optional loader, then hero
      var loader = initLoader();
      var intro = heroIntro();
      if (loader) { intro.pause(); loader.add(function () { intro.play(); }, "-=0.75"); }

      // section headings — masked line reveal
      $$("[data-split]").forEach(function (el) {
        var split = splitLines(el); if (!split) return;
        gsap.from(split.lines, { yPercent: 110, duration: 1.2, stagger: 0.1, ease: "power4.out", scrollTrigger: { trigger: el, start: "top 88%", once: true }, onComplete: function () { split.revert(); } });
      });

      // generic fade-up reveals, batched for natural stagger
      ScrollTrigger.batch("[data-reveal]", {
        start: "top 90%", once: true,
        onEnter: function (els) { gsap.fromTo(els, { autoAlpha: 0, y: 44 }, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.09, ease: "power3.out", overwrite: true }); }
      });

      // image wipes
      $$("[data-reveal-img]").forEach(function (el) {
        var img = $("img", el);
        var tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 88%", once: true } });
        tl.set(el, { visibility: "visible" })
          .fromTo(el, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut" });
        if (img) tl.fromTo(img, { scale: 1.3 }, { scale: 1, duration: 1.8, ease: "expo.out", clearProps: "transform" }, 0.1);
      });

      // gentle parallax
      $$("[data-parallax]").forEach(function (el) {
        var amt = parseFloat(el.getAttribute("data-parallax")) || 10;
        gsap.fromTo(el, { yPercent: -amt / 2 }, { yPercent: amt / 2, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
      });

      // statement — words ink in as you read
      $$("[data-ink]").forEach(function (el) {
        var split = window.SplitText ? SplitText.create(el, { type: "words", wordsClass: "w" }) : null;
        if (!split) return;
        var faint = getComputedStyle(root).getPropertyValue("--c-hairline").trim() || "#d9d0c5";
        var ink = getComputedStyle(root).getPropertyValue("--c-ink").trim() || "#1e1a17";
        gsap.fromTo(split.words, { color: faint }, { color: ink, stagger: 0.1, ease: "none", scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 45%", scrub: 0.6 } });
      });

      // marquee — endless, nudged by scroll velocity
      $$(".marquee-track").forEach(function (track) {
        var loop = gsap.to(track, { xPercent: -50, duration: 38, ease: "none", repeat: -1 });
        var boost = gsap.quickTo(loop, "timeScale", { duration: 0.6, ease: "power2.out" });
        ScrollTrigger.create({ trigger: track, start: "top bottom", end: "bottom top", onUpdate: function (self) {
          var v = self.getVelocity() / 260; var s = gsap.utils.clamp(-5, 5, v);
          loop.timeScale(Math.abs(s) < 1 ? (s < 0 ? -1 : 1) : s); boost(s < 0 ? -1 : 1);
        } });
      });

      // any other squiggles ink in as they scroll into view
      $$("[data-draw]").forEach(function (svg) {
        if (svg.closest(".hero-visual") || svg.closest(".loader")) return;
        var t = drawSquiggle(svg, { paused: true });
        if (t) ScrollTrigger.create({ trigger: svg, start: "top 85%", once: true, onEnter: function () { t.play(); } });
      });

      // horizontal gallery — pinned on desktop only (mobile swipes natively)
      mm.add("(min-width: 901px)", function () {
        $$("[data-hscroll]").forEach(function (wrap) {
          var track = $(".hgallery-track", wrap);
          var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
          gsap.to(track, { x: function () { return -dist(); }, ease: "none", scrollTrigger: { trigger: wrap, start: "center center", end: function () { return "+=" + dist(); }, pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1 } });
        });
      });

      // pinned process — swap the picture as each step arrives
      $$("[data-process]").forEach(function (wrap) {
        var imgs = $$(".process-visual img", wrap);
        $$(".process-step", wrap).forEach(function (step, n) {
          ScrollTrigger.create({ trigger: step, start: "top 60%", end: "bottom 60%", onToggle: function (self) {
            if (!self.isActive && n === 0 && self.progress === 0) self = { isActive: true };
            if (!self.isActive || !imgs[n]) return;
            imgs.forEach(function (im, k) { gsap.to(im, { autoAlpha: k === n ? 1 : 0, scale: k === n ? 1 : 1.06, duration: 0.9, ease: "power2.out" }); });
          } });
        });
      });

      // counters
      $$("[data-count-to]").forEach(function (el) {
        var end = parseFloat(el.getAttribute("data-count-to")), o = { v: 0 };
        gsap.to(o, { v: end, duration: 1.8, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 85%", once: true }, onUpdate: function () { el.textContent = Math.round(o.v); } });
      });

      // occasions list: an image follows the cursor
      if (finePointer) {
        $$("[data-hover-reveal]").forEach(function (list) {
          var box = $(".hover-img", list.closest("section")); if (!box) return;
          var img = $("img", box);
          var xTo = gsap.quickTo(box, "x", { duration: 0.55, ease: "power3.out" }), yTo = gsap.quickTo(box, "y", { duration: 0.55, ease: "power3.out" });
          var rTo = gsap.quickTo(box, "rotation", { duration: 0.8, ease: "power3.out" });
          var lastX = 0;
          list.addEventListener("pointermove", function (e) {
            xTo(e.clientX + 28); yTo(e.clientY - box.offsetHeight / 2);
            rTo(gsap.utils.clamp(-8, 8, (e.clientX - lastX) * 0.6)); lastX = e.clientX;
          });
          $$("a[data-img]", list).forEach(function (a) {
            a.addEventListener("pointerenter", function () {
              if (img.getAttribute("src") !== a.getAttribute("data-img")) {
                img.src = a.getAttribute("data-img");
                gsap.fromTo(img, { scale: 1.2 }, { scale: 1, duration: 0.8, ease: "power3.out" });
              }
            });
          });
          list.addEventListener("pointerenter", function (e) { gsap.set(box, { x: e.clientX + 28, y: e.clientY - box.offsetHeight / 2 }); gsap.to(box, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "power3.out" }); });
          list.addEventListener("pointerleave", function () { gsap.to(box, { autoAlpha: 0, scale: 0.85, duration: 0.35, ease: "power2.in" }); });
          gsap.set(box, { scale: 0.85 });
        });
      }

      // magnetic buttons (desktop mouse only)
      if (finePointer) {
        $$("[data-magnetic]").forEach(function (b) {
          var xTo = gsap.quickTo(b, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" }), yTo = gsap.quickTo(b, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
          b.addEventListener("pointermove", function (e) { var r = b.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * 0.3); yTo((e.clientY - r.top - r.height / 2) * 0.4); });
          b.addEventListener("pointerleave", function () { xTo(0); yTo(0); });
        });
      }
    })();

    // page-leave fade for internal links
    doc.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[href]");
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      var href = a.getAttribute("href");
      if (!href || href.charAt(0) === "#" || a.target === "_blank" || a.hasAttribute("download") || /^(mailto|tel|https?):/i.test(href)) return;
      var url = new URL(a.href, location.href);
      if (url.origin !== location.origin || (url.pathname === location.pathname && url.hash)) return;
      e.preventDefault();
      gsap.to("main, .site-footer", { autoAlpha: 0, y: -12, duration: 0.35, ease: "power2.in", onComplete: function () { location.href = a.href; } });
    });
    window.addEventListener("pageshow", function (e) { if (e.persisted) gsap.set("main, .site-footer", { clearProps: "opacity,visibility,transform" }); });

    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  }

  /* ---------------------------------------------------------------------
     Boot
     --------------------------------------------------------------------- */
  renderProducts();
  renderBasket();
  initForms();
  initFilters();
  initQuotes();
  initYear();
  initSeasons();
  if (CONFIG.preview) {
    var badge = doc.createElement("p"); badge.className = "preview-badge"; badge.textContent = "Design preview · not live yet";
    doc.body.appendChild(badge);
  }
  if (motionOn) {
    // wait for fonts so SplitText measures real line breaks (max 1.2s)
    var started = false;
    var start = function () { if (started) return; started = true; initMotion(); };
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(start);
    setTimeout(start, 1200);
  }
})();
