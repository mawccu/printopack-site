# Yucca Packaging — Animation & Design Spec

> Reverse-engineered live from **https://yucca.co.za/** (WordPress + WooCommerce).
> Use this to recreate the site's look and motion. No animation library is used — it is
> custom **jQuery + IntersectionObserver + CSS transitions**. Everything below is copy-paste ready.

---

## 0. The single most important thing

Every meaningful motion on this site uses ONE easing curve:

```
cubic-bezier(0.22, 1, 0.36, 1)   /* "easeOutQuint" — fast in, soft glide to stop */
```

This one curve is what makes the whole site feel premium. **If you copy nothing else, copy this.**
Use it for every reveal, hover, and scroll animation. Never use the default `ease`.

---

## 1. Brand tokens (exact values pulled from the live site)

```css
:root {
  /* Colors */
  --bg:          rgb(255, 238, 172);  /* warm cream / pale yellow page background */
  --ink:         rgb(44, 47, 49);     /* near-black charcoal — all text */
  --ease:        cubic-bezier(0.22, 1, 0.36, 1);

  /* Type */
  --font: "Magnetik", sans-serif;     /* custom thin geometric sans (fallback: Manrope / Poppins / Helvetica Now) */
}

body {
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font);
}
```

**Typography feel:**
- Headings are **very large and very thin** — H1 is ~98px at `font-weight: 200`.
- Big, light, confident. Lots of whitespace. Minimal color — cream background, charcoal text, product photography does the talking.

---

## 2. Page preloader

On first load, a full-screen loader shows a "Packaging" label + tray icon that pulses, then fades away to reveal the page.

```css
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.55; transform: scale(0.97); }
}
.preloader__icon { animation: pulse 1.2s ease-in-out infinite; }

.preloader { transition: opacity 0.6s var(--ease); }
.preloader.is-done { opacity: 0; pointer-events: none; }
```

Note: the preloader pulse is the ONE place that uses `ease-in-out` instead of the quint curve (because it loops).

---

## 3. Headline reveal — split-line animation ⭐ (the signature effect)

The big hero headline ("Packaging that Performs. Innovated for Industry Leaders.") is split into
individual lines. Each line starts pushed down + hidden behind a mask, then slides up into place,
one after another, on page load.

Live values captured: each line animates a `translateY(~35px) → 0` with the quint easing.

```html
<h1 class="split">
  <span class="split-line"><span>Packaging that</span></span>
  <span class="split-line"><span>Performs. Innovated</span></span>
  <span class="split-line"><span>for Industry Leaders.</span></span>
</h1>
```

```css
.split-line { display: block; overflow: hidden; }      /* mask */
.split-line > span {
  display: block;
  transform: translateY(110%);                          /* start below the mask */
  transition: transform 1s var(--ease);
}
.split.is-in .split-line > span { transform: translateY(0); }

/* stagger each line */
.split.is-in .split-line:nth-child(1) > span { transition-delay: 0.00s; }
.split.is-in .split-line:nth-child(2) > span { transition-delay: 0.08s; }
.split.is-in .split-line:nth-child(3) > span { transition-delay: 0.16s; }
```

> Tip for a Claude/Design rebuild: the JS library that produces this is **SplitType** (or GSAP SplitText).
> But you can hand-write the `<span>` lines as above and skip the library entirely.

---

## 4. Scroll fade-in (`s-fade-anim`)

General-purpose "reveal on scroll." Elements start invisible + nudged down ~21px, then fade + rise
when they enter the viewport.

```css
.s-fade-anim {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s var(--ease), transform 0.8s var(--ease);
  will-change: opacity, transform;
}
.s-fade-anim.is-visible {
  opacity: 1;
  transform: none;
}
```

Trigger with IntersectionObserver (see §8).

---

## 5. Scrolling marquee band (`s-marquee`)

A horizontal, infinitely-looping row of product names / text that slides sideways forever.

```html
<div class="s-marquee">
  <div class="s-marquee-loop">
    <span class="s-marquee-item">Provento</span>
    <span class="s-marquee-item">Blister (POP)</span>
    <span class="s-marquee-item">Camillo</span>
    <!-- duplicate the whole set once more so the loop is seamless -->
    <span class="s-marquee-item">Provento</span>
    <span class="s-marquee-item">Blister (POP)</span>
    <span class="s-marquee-item">Camillo</span>
  </div>
</div>
```

```css
.s-marquee { overflow: hidden; white-space: nowrap; }
.s-marquee-loop {
  display: inline-flex;
  gap: 3rem;
  animation: marquee 30s linear infinite;   /* linear, NOT the quint curve — constant speed */
}
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }     /* -50% because content is duplicated once */
}
.s-marquee:hover .s-marquee-loop { animation-play-state: paused; }  /* optional */
```

---

## 6. Parallax (`.parallax`)

Images drift at a slightly different speed than the scroll, giving depth. Driven by JS setting
`transform: translateY()` based on scroll position.

```css
.parallax { will-change: transform; }
```
```js
// simple parallax: element moves at 0.85x scroll speed
const speed = 0.15;
window.addEventListener('scroll', () => {
  document.querySelectorAll('.parallax').forEach(el => {
    const rect = el.getBoundingClientRect();
    const offset = (window.innerHeight - rect.top) * speed;
    el.style.transform = `translateY(${-offset}px)`;
  });
}, { passive: true });
```

---

## 7. Card hover (hero category cards: Food Service / Food Processing / Agriculture)

Frosted-glass cards over the hero image. On hover they lift and shift border/background.

```css
.category-card {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  transition:
    border-color 0.6s var(--ease),
    background   0.6s var(--ease),
    transform    0.8s var(--ease);
}
.category-card:hover {
  transform: translateY(-6px);
  background: rgba(255, 255, 255, 0.4);
  border-color: rgba(255, 255, 255, 0.7);
}
```

---

## 8. The JS that ties reveals together (drop-in, no dependencies)

```js
// Reveal-on-scroll for .s-fade-anim, .split, etc.
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible', 'is-in');
      io.unobserve(entry.target);           // play once
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

document.querySelectorAll('.s-fade-anim, .split').forEach(el => io.observe(el));
```

---

## 9. Motion inventory (quick reference table)

| Element | Effect | Duration | Easing | Loops? |
|---|---|---|---|---|
| Preloader icon | pulse (scale + opacity) | 1.2s | ease-in-out | ∞ |
| Preloader screen | fade out | 0.6s | easeOutQuint | once |
| Hero headline | split lines slide up, staggered | 1.0s | easeOutQuint | once |
| Sections / text | fade + rise on scroll | 0.8s | easeOutQuint | once |
| Marquee band | infinite horizontal scroll | 30s | linear | ∞ |
| Product images | scale/translate in on scroll | 0.6–1.0s | easeOutQuint | once |
| Parallax images | drift on scroll | (scroll-linked) | — | — |
| Category cards | lift + border/bg on hover | 0.6–0.8s | easeOutQuint | on hover |

---

## 10. Rebuild checklist (80% of the feel, fast)

1. Cream background `rgb(255,238,172)`, charcoal text `rgb(44,47,49)`, thin geometric sans (weight 200).
2. Set `--ease: cubic-bezier(0.22, 1, 0.36, 1)` and use it EVERYWHERE.
3. Split the main headline into masked lines that slide up on load (§3).
4. Give every section `.s-fade-anim` + the IntersectionObserver (§4, §8).
5. Add one looping marquee band of product/keywords (§5).
6. Frosted-glass hover cards over a large hero photo (§7).
7. Keep it minimal — lots of whitespace, let product photography carry the color.

---

*Spec generated by inspecting the live DOM, computed styles, and running animations on 2026-07-07.*
