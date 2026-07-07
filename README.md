# Printopack — Corporate Website

Modern, animation-rich website for **Printopack (Saudi Modern Packaging Factory Co. Ltd.)** — flexible-packaging manufacturer, Jeddah, KSA. Built completely by hand: **no frameworks, no build step**.

## Highlights

- **Cinematic opener** — blueprint-grid stage, tilted 3D pouch center-stage, scroll-consumed release that glides it home while the page wakes
- **Real 3D product** (`model.glb`) — branded pouch modeled/textured in Blender (baked label print, crinkled-film normal + roughness maps), driven by a lerped cinematic camera: scroll spin + crane + dolly, cursor gaze, scroll inertia, idle bob, reactive water backdrop
- **Motion system** — GSAP + ScrollTrigger + Lenis: per-word split reveals, clip-path media wipes, velocity-reactive marquees, choreographed hover cards, magnetic fill-swap buttons, press squish, custom cursor, stats count-ups, letter-mask footer wordmark, film grain
- **Global reach map** — public-domain world map (Wikimedia) cropped to MENA, the 7 office countries highlighted in brand blue, orange connectors computed from live geometry (transform-proof)
- **Mega menu**, smart hide/reveal header with login cluster, sibling-dim group hovers, editorial numbered kickers, serif-italic display accents
- **Bilingual EN/AR** — persisted toggle, RTL layout, Arabic type (IBM Plex Sans Arabic), ~120-string dictionary
- **Production layer** — PWA manifest + icons, JSON-LD, OG/Twitter meta, canonical URLs, sitemap/robots, security headers, `prefers-reduced-motion` support, skip-link a11y, cross-document View Transitions

## Stack

| Layer | Tech |
|---|---|
| Markup | Static HTML (25 pages) |
| Styling | Single hand-written design system (`assets/site.css` + `assets/pages.css`) |
| Motion | GSAP 3 + ScrollTrigger + Lenis (CDN) |
| 3D | `<model-viewer>` + Blender-authored GLB |
| Data | Live API (`api.printopack.com.sa`) for the contact form; all other content baked at build time |
| Build | `python build_pages.py` regenerates the inner pages from the content export |

## Run locally

```bash
python -m http.server 8000     # or double-click run.bat on Windows
# open http://localhost:8000
```

> The 3D model and module scripts require http — opening `index.html` via `file://` won't load them.

## Structure

```
index.html            # home (the showpiece)
about / categories / news(+16 articles) / gallery / contact / thank-you / privacy / conditions / 404
assets/               # design system, images, icons, model.glb, worldmap.svg
build_pages.py        # inner-page generator
manifest.webmanifest  # PWA
sitemap.xml, robots.txt, _headers, _redirects, .htaccess
```

## Deploy

Static hosting — drop the folder on Netlify / Vercel / GitHub Pages / any web server. `_headers`/`_redirects` cover Netlify; `.htaccess` covers Apache.

---

© Printopack — Saudi Modern Packaging Factory Co. Ltd. All rights reserved.
