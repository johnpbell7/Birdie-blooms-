/* Shared, gentle motion for the four direction concepts. Content shows without it. */
(function () {
  var r = document.documentElement;
  if (!window.gsap || matchMedia("(prefers-reduced-motion: reduce)").matches) { r.classList.remove("m"); return; }
  gsap.registerPlugin(ScrollTrigger);
  gsap.fromTo("[data-hero]", { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 1.2, ease: "power3.out", stagger: 0.12, delay: 0.15 });
  gsap.utils.toArray("[data-wipe]").forEach(function (el, i) {
    gsap.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut", delay: 0.2 + i * 0.15 });
  });
  gsap.utils.toArray("[data-grow]").forEach(function (el) {
    gsap.fromTo(el, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.8, ease: "power2.inOut", delay: 0.6 });
  });
  ScrollTrigger.batch("[data-rise]", {
    start: "top 90%", once: true,
    onEnter: function (els) { gsap.fromTo(els, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 1.1, ease: "power3.out", stagger: 0.1 }); }
  });
  gsap.utils.toArray("[data-drift]").forEach(function (el) {
    gsap.to(el, { yPercent: -10, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
  });
})();
