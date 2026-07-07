# Yucca Packaging — FULL Animation & Design Spec (v2, complete)

> Reverse-engineered live from **https://yucca.co.za/** by inspecting the running DOM,
> computed styles, keyframes, and scrolling through every section.
> Stack: **WordPress + WooCommerce + Lenis smooth-scroll + custom jQuery/IntersectionObserver + CSS**.
> No GSAP / AOS / Framer. All motion is hand-built. Everything below is copy-paste ready.

---

## ⚠️ THE 3 THINGS MOST REBUILDS MISS

1. **Lenis smooth scrolling.** The whole site scrolls with inertia/smoothing via the **Lenis** library
   (`<html class="lenis">`). This is 50% of why it "feels expensive." Without it, every scroll animation
   feels cheap. **You MUST add Lenis** (see §2).
2. **Frosted-glass panels.** Real spec: `background: rgba(220,218,215,0.25)` + `backdrop-filter: blur(33px)`
   + `border-radius: 18px`. Not white, not fully transparent — a *tinted* translucent grey with heavy blur (see §4).
3. **Sections change background color as you scroll** — cream → tan → dark charcoal → khaki → tan.
   The dark sections are the drama. Missing this makes it look flat (see §3).

---

## 1. Global tokens (exact values from live site)

```css
:root {
  /* THE easing — used on literally everything */
  --ease: cubic-bezier(0.22, 1, 0.36, 1);   /* easeOutQuint: fast in, soft glide out */

  /* Section background colors (site shifts between these) */
  --cream:    rgb(255, 238, 172);  /* #FFEEAC  hero, standards, page base */
  --tan:      rgb(204, 196, 164);  /* #CCC4A4  marquee band, footer */
  --khaki:    rgb(229, 219, 183);  /* #E5DBB7  FAQ */
  --dark:     rgb(44, 48, 50);     /* #2C3032  solutions accordion, custom-CTA */
  --ink:      rgb(44, 47, 49);     /* #2C2F31  all body text (on light bg) */
  --on-dark:  rgb(230, 230, 228);  /* text on dark sections */

  /* Glass panel */
  --glass-bg:   rgba(220, 218, 215, 0.25);
  --glass-blur: blur(33px);

  --font: "Magnetik", sans-serif;  /* thin geometric sans. Fallbacks: Manrope / Poppins / Helvetica Now */
}

body { background: var(--cream); color: var(--ink); font-family: var(--font); }
```

**Typography:** headings are HUGE and THIN — H1 ≈ 98px at `font-weight: 200`. Generous line-height,
lots of whitespace. Color is minimal; product photography carries all the color.

---

## 2. Lenis smooth scroll (DO THIS FIRST) ⭐

```html
<script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js"></script>
```
```js
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out, matches their feel
  smoothWheel: true,
});
function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);
```
This single addition transforms the whole page. Do it before anything else.

---

## 3. Section-by-section teardown (top → bottom, 8467px total)

| # | Section | Background | What's in it | Motion |
|---|---------|-----------|--------------|--------|
| 1 | **Hero** | cream | Big thin headline + 3 frosted glass cards over an iced-coffee photo | Preloader → split-line headline reveal; cards fade/rise; photo parallax |
| 2 | **Marquee band** | tan | Infinite scrolling row of product names | Continuous horizontal loop |
| 3 | **Shop CTA** | cream | Short call-to-action strip | Fade-in on scroll |
| 4 | **Solutions accordion** | **dark** | 3 expanding cards (Food Service / Processing / Agriculture) | Active card expands + turns yellow, others collapse grey |
| 5 | **Info** | cream | "Committed to Excellence" + animated bullet list w/ divider lines | List rows reveal one-by-one on scroll |
| 6 | **Products grid** | cream | 4 product cards w/ vertical "NEW" badge, name, price | Cards scale/fade in staggered; image hover-zoom |
| 7 | **Custom-solutions CTA** | **dark** | Big thin headline + floating translucent product render + arrow marquee | Headline reveal; **2nd marquee** ("Get in touch to find out ↗") |
| 8 | **Standards** | cream | "Factory & Product Standards" + partner/cert logos | Logos fade/reveal |
| 9 | **FAQ** | khaki | Accordion of questions with +/× toggles | Rows expand/collapse on click |
| 10 | **Footer** | tan | Giant Yucca "Y" logo mark + category link cards | Cards hover-lift |

---

## 4. Frosted-glass panels (hero cards) ⭐

The translucent panels floating over the hero photo. THE detail people miss.

```css
.glass-card {
  background: rgba(220, 218, 215, 0.25);
  backdrop-filter: blur(33px);
  -webkit-backdrop-filter: blur(33px);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.18);   /* very subtle */
  transition:
    background 0.6s var(--ease),
    backdrop-filter 0.6s var(--ease),
    transform 0.8s var(--ease);
}
.glass-card:hover {
  transform: translateY(-6px);
  background: rgba(220, 218, 215, 0.40);
}
```

---

## 5. Solutions accordion (dark section) ⭐ — big feature, easy to miss

Three cards on a near-black background. One is **active**: expanded, filled solid **yellow/cream**,
showing a description + "Tell me more →". The other two are **collapsed**, narrow, dark grey.
Clicking (or hovering) a collapsed card makes it the active one — width + color animate.

```html
<div class="solutions">
  <button class="sol-card is-active">
    <h3>Food Service</h3>
    <p>Deliver meals that look good, travel well and impress customers…</p>
    <span class="sol-more">Tell me more <svg>→</svg></span>
  </button>
  <button class="sol-card"><h3>Food Processing</h3>…</button>
  <button class="sol-card"><h3>Agriculture</h3>…</button>
</div>
```
```css
.solutions { display: flex; gap: 1.5rem; background: var(--dark); padding: 6rem 4rem; }
.sol-card {
  flex: 1;                       /* collapsed cards share space */
  background: #3a3d3f;           /* dark grey */
  color: #cfcfcf;
  border-radius: 20px;
  padding: 2.5rem;
  overflow: hidden;
  transition: flex 0.8s var(--ease), background 0.6s var(--ease), color 0.6s var(--ease);
}
.sol-card.is-active {
  flex: 2.2;                     /* active card grows wider */
  background: var(--cream);      /* fills yellow */
  color: var(--ink);
}
.sol-card p, .sol-card .sol-more {   /* body hidden until active */
  opacity: 0; transform: translateY(10px);
  transition: opacity 0.5s var(--ease) 0.15s, transform 0.5s var(--ease) 0.15s;
}
.sol-card.is-active p, .sol-card.is-active .sol-more { opacity: 1; transform: none; }
```
```js
document.querySelectorAll('.sol-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    document.querySelectorAll('.sol-card').forEach(c => c.classList.remove('is-active'));
    card.classList.add('is-active');
  });
});
```

---

## 6. The TWO marquees

**A) Product-name band (section 2, tan bg):** big text sliding sideways forever.
**B) CTA arrow marquee (section 7, dark bg):** "Get in touch to find out ↗ Not sure what's possible? …"
repeating, bordered top + bottom.

```css
.marquee { overflow: hidden; white-space: nowrap;
  border-top: 1px solid rgba(255,255,255,.15); border-bottom: 1px solid rgba(255,255,255,.15); }
.marquee-loop { display: inline-flex; gap: 3rem; animation: marquee 28s linear infinite; }
@keyframes marquee { to { transform: translateX(-50%); } }  /* content duplicated once */
```
Duplicate the item set once inside `.marquee-loop` so the wrap is seamless. Use `linear` (constant speed),
NOT the quint curve. Add `.marquee:hover .marquee-loop { animation-play-state: paused; }` if you want.

---

## 7. Split-line headline reveal (hero + CTA headlines) ⭐

Each headline is split into lines that sit hidden below a mask, then slide up staggered on load/scroll.

```html
<h1 class="split">
  <span class="line"><span>Packaging that</span></span>
  <span class="line"><span>Performs. Innovated</span></span>
  <span class="line"><span>for Industry Leaders.</span></span>
</h1>
```
```css
.line { display: block; overflow: hidden; }
.line > span { display: block; transform: translateY(110%); transition: transform 1s var(--ease); }
.split.is-in .line > span { transform: translateY(0); }
.split.is-in .line:nth-child(2) > span { transition-delay: 0.08s; }
.split.is-in .line:nth-child(3) > span { transition-delay: 0.16s; }
```
> Library that generates this: **SplitType**. Or hand-write the spans and skip it.

---

## 8. Scroll reveals + animated list (sections 3, 5, 6, 8)

Generic reveal — elements fade + rise when entering viewport. The Info section (5) staggers each
list row + draws divider lines. Products (6) stagger the cards.

```css
.reveal { opacity: 0; transform: translateY(30px);
  transition: opacity .8s var(--ease), transform .8s var(--ease); }
.reveal.is-visible { opacity: 1; transform: none; }
.reveal:nth-child(2){ transition-delay:.08s } .reveal:nth-child(3){ transition-delay:.16s }
.reveal:nth-child(4){ transition-delay:.24s }
```
```js
const io = new IntersectionObserver((es)=>es.forEach(e=>{
  if(e.isIntersecting){ e.target.classList.add('is-visible','is-in'); io.unobserve(e.target); }
}), { threshold:.15, rootMargin:'0px 0px -10% 0px' });
document.querySelectorAll('.reveal, .split').forEach(el=>io.observe(el));
```

---

## 9. Product cards (section 6)

```css
.product-card .img { overflow: hidden; border-radius: 14px; background:#f6f3ec; }
.product-card .img img { transition: transform 0.8s var(--ease); }
.product-card:hover .img img { transform: scale(1.05); }
.product-card .badge {           /* vertical "NEW" tag, top-right */
  writing-mode: vertical-rl; background:#3a3d3f; color:#fff;
  padding:.4rem; border-radius:4px; font-size:.7rem; letter-spacing:.1em;
}
```

---

## 10. FAQ accordion (section 9)

```css
.faq-item { border-top: 1px solid rgba(44,47,49,.2); }
.faq-q { display:flex; justify-content:space-between; padding:1.5rem 0; cursor:pointer; }
.faq-a { max-height:0; overflow:hidden; transition:max-height .6s var(--ease), opacity .4s var(--ease); opacity:0; }
.faq-item.open .faq-a { max-height:400px; opacity:1; }
.faq-item .icon { transition: transform .4s var(--ease); }     /* + rotates to × */
.faq-item.open .icon { transform: rotate(45deg); }
```

---

## 11. Preloader (exact keyframe)

```css
@keyframes pulse {                     /* real values from site */
  0%   { transform: scale(1);   opacity: 1;   }
  50%  { transform: scale(1.3); opacity: 0.6; }
  100% { transform: scale(1);   opacity: 1;   }
}
.preloader__icon { animation: pulse 1.2s ease-in-out infinite; }   /* only place NOT using quint */
.preloader { transition: opacity .6s var(--ease); }
.preloader.done { opacity: 0; pointer-events: none; }
```

---

## 12. Rebuild checklist (in order)

1. ☐ Add **Lenis** smooth scroll (§2) — do this first, it's the biggest thing.
2. ☐ Set `--ease: cubic-bezier(0.22,1,0.36,1)` and use it on EVERYTHING.
3. ☐ Cream base bg; make sections **change color** (cream/tan/khaki/dark) as you go (§3).
4. ☐ Thin huge headings (weight 200), split into masked lines that slide up (§7).
5. ☐ Frosted glass hero cards: `rgba(220,218,215,.25)` + `blur(33px)` + radius 18 (§4).
6. ☐ Dark **solutions accordion** — active card expands + turns yellow (§5). ← most-missed feature.
7. ☐ TWO marquees: product band (tan) + arrow CTA band (dark) (§6).
8. ☐ IntersectionObserver reveals on every section, staggered lists (§8).
9. ☐ Product cards with vertical NEW badge + hover image zoom (§9).
10. ☐ FAQ accordion with rotating +/× (§10).
11. ☐ Footer: giant Y logo + hover-lift category cards.

---

*Generated 2026-07-07 by inspecting the live site's DOM, computed styles, keyframes, and every section.*
