# -*- coding: utf-8 -*-
"""
Printopack static site builder.
Generates all inner pages (about, categories, news+articles, gallery, contact,
thank-you, privacy, conditions, 404) from the exported site content, sharing
the design system in assets/site.css + assets/site.js.
Re-run any time: python build_pages.py
"""
import json, os, re, html, time
V = str(int(time.time()))
from PIL import Image

ROOT   = os.path.dirname(os.path.abspath(__file__))
EXPORT = r"C:\Users\USER\Desktop\Printopack_Site_Content"
DATA   = os.path.join(EXPORT, "data")
IMGS   = os.path.join(EXPORT, "images")
API    = "https://api.printopack.com.sa"

def j(name):
    return json.load(open(os.path.join(DATA, name), encoding="utf-8-sig"))

def resize_copy(src, dst, mw, quality=82):
    if os.path.exists(dst): return
    im = Image.open(src)
    if dst.lower().endswith(".png"):
        im = im.convert("RGBA")
    else:
        im = im.convert("RGB")
    if im.width > mw:
        im = im.resize((mw, int(im.height * mw / im.width)), Image.LANCZOS)
    im.save(dst, **({"quality": quality, "optimize": True} if dst.lower().endswith((".jpg",".jpeg")) else {"optimize": True}))

def find_export_image(rel):
    """map an API image path like /images/category/category_xxx.png to the export file"""
    base = os.path.basename(rel)
    kind = rel.strip("/").split("/")[1]          # category | blog | gallery | slider | client
    cand = os.path.join(IMGS, f"{kind}_{base}")
    return cand if os.path.exists(cand) else None

# ---------------------------------------------------------------- shared shell
HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@200;300;400;500;600;700&display=swap" rel="stylesheet">\n<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;600&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js"></script>
<link rel="canonical" href="https://www.printopack.com.sa/{fname}">
<meta name="theme-color" content="#0e2042">
<link rel="icon" type="image/png" sizes="32x32" href="assets/favicon-32.png">
<link rel="apple-touch-icon" href="assets/apple-touch-icon.png">
<link rel="manifest" href="manifest.webmanifest">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Printopack">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="https://www.printopack.com.sa/assets/hero.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="assets/site.css?v={V}">
<link rel="stylesheet" href="assets/pages.css?v={V}">
</head>
<body>
<a class="skip-link" href="#top">Skip to content</a>
<div class="grain"></div>
<div class="scroll-progress" id="scrollProgress"></div>
<div class="cursor-dot" id="cursorDot"></div>
<div class="cursor-ring" id="cursorRing"></div>
"""

NAV_ITEMS = [("index.html","Home","home"),("categories.html","Products","products"),
             ("news.html","News","news"),("about.html","About","about"),
             ("gallery.html","Gallery","gallery"),("contact.html","Contact","contact")]

def header(active):
    links = "".join(
        f'<a href="{href}"{" class=\"on\"" if key==active else ""}>{label}</a>'
        for href,label,key in NAV_ITEMS)
    return f"""<header>
  <div class="nav">
    <div class="nav-cluster">
      <div class="nav-account">
        <a href="https://printopack.azurewebsites.net/" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"/></svg>Customer Login</a>
        <a href="#" class="admin-login"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"/></svg>Admin</a>
      </div>
      <a href="index.html" class="brand"><img src="assets/logo_nav.png" alt="Printopack" class="brand-logo"></a>
    </div>
    <nav class="nav-links">{links}</nav>
    <a href="contact.html" class="btn brand">Request a Quote</a>
  </div>
</header>
"""

FOOTER = """
<footer id="contact" data-reveal>
  <div class="footer-in">
    <div class="footer-top">
      <h2 data-split>Set the standard for packaging in your industry.</h2>
      <a href="contact.html" class="btn brand" data-rise>Request a Quote</a>
    </div>
    <div class="footer-cards">
      <a href="tel:+966126081074" class="footer-card" data-rise><h3>Call us</h3><span>+966 12 608 1074 &nbsp;&middot;&nbsp; Fax +966 12 608 1082</span></a>
      <a href="mailto:info@printopack.com.sa" class="footer-card" data-rise><h3>Email us</h3><span>info@printopack.com.sa &nbsp;&middot;&nbsp; 9:00 AM &ndash; 5:00 PM</span></a>
      <a href="contact.html" class="footer-card" data-rise><h3>Visit us</h3><span>Industrial Area 5, Unit 10, 8508, Jeddah 22428, Saudi Arabia</span></a>
    </div>
    <div class="footer-links" data-rise>
      <a href="index.html">Home</a><a href="categories.html">Products</a><a href="news.html">News</a>
      <a href="about.html">About</a><a href="gallery.html">Gallery</a><a href="contact.html">Contact</a>
      <a href="privacy.html">Privacy</a><a href="conditions.html">Conditions</a>
      <a href="https://www.linkedin.com/company/80331793/jobs/" target="_blank" rel="noopener">Careers</a>
      <a href="https://facebook.com/www.printopack.com.sa" target="_blank" rel="noopener">Facebook</a>
      <a href="https://www.linkedin.com/company/80331793/" target="_blank" rel="noopener">LinkedIn</a>
    </div>
    <div class="footer-mark"><div>Printopack</div></div>
    <div class="footer-legal">
      <span>Printopack — Saudi Modern Packaging Factory Co. Ltd. 2026. All rights reserved.</span>
      <span>Jeddah, KSA — <span id="jClock">--:--:--</span> GMT+3</span>
    </div>
  </div>
</footer>
<script src="assets/site.js?v={V}"></script>
{extra}
</body>
</html>"""

def page_hero(kicker, title, sub=""):
    subhtml = f'<p class="ph-sub" data-rise>{sub}</p>' if sub else ""
    return f"""<main id="top">
<section class="section page-hero" data-reveal>
  <div class="wrap">
    <span class="ph-kicker" data-rise>{kicker}</span>
    <h1 data-split>{title}</h1>
    {subhtml}
  </div>
</section>
"""

def write_page(fname, title, desc, active, body, extra_js=""):
    doc = (HEAD.format(title=html.escape(title), desc=html.escape(desc), fname=fname, V=V)
           + header(active) + body + FOOTER.replace("{extra}", extra_js).replace("{V}", V))
    open(os.path.join(ROOT, fname), "w", encoding="utf-8").write(doc)
    print("wrote", fname)

# ---------------------------------------------------------------- pages css
PAGES_CSS = """
/* ===== Inner pages ===== */
.nav-links a.on{color:var(--blue);}
.nav-links a.ext{opacity:.7;font-size:13.5px;}
.page-hero{padding:150px 0 44px;}
.ph-kicker{display:block;font-size:12px;font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:var(--amber-deep);margin-bottom:18px;}
.page-hero h1{font-size:clamp(40px,5vw,84px);line-height:1.05;font-weight:200;letter-spacing:-.015em;max-width:18ch;}
.ph-sub{margin-top:22px;font-size:17px;line-height:1.65;font-weight:400;color:rgba(29,29,27,.65);max-width:56ch;}
.page-body{padding:0 0 120px;}
/* grids */
.cat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;}
@media(max-width:1100px){.cat-grid{grid-template-columns:repeat(3,1fr);}}
@media(max-width:760px){.cat-grid{grid-template-columns:repeat(2,1fr);}}
.cat-card{background:#fff;border:1px solid rgba(29,29,27,.08);border-radius:16px;padding:22px;display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center;transition:transform .7s var(--ease),box-shadow .4s var(--ease),border-color .5s var(--ease),opacity .5s var(--ease);}
.cat-card:hover{transform:translateY(-6px);box-shadow:0 18px 44px rgba(29,29,27,.12);border-color:rgba(255,174,42,.5);}
.cat-grid:hover .cat-card:not(:hover){opacity:.45;}
.cat-card .ci{height:195px;width:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(180deg,rgba(247,244,233,.7),rgba(255,255,255,0));border-radius:12px;}
.cat-card img{max-height:172px;width:auto;max-width:90%;object-fit:contain;transition:transform .7s var(--ease);}
.cat-card:hover img{transform:scale(1.06);}
.cat-card h3{font-size:16.5px;font-weight:600;}
.cat-card span{font-size:13px;font-weight:600;color:var(--amber-deep);}
/* news */
.news-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;}
@media(max-width:1000px){.news-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:640px){.news-grid{grid-template-columns:1fr;}}
.news-card{display:flex;flex-direction:column;border-radius:16px;overflow:hidden;background:#fff;border:1px solid rgba(29,29,27,.08);transition:transform .7s var(--ease),box-shadow .4s var(--ease),opacity .5s var(--ease);}
.news-card:hover{transform:translateY(-6px);box-shadow:0 18px 44px rgba(29,29,27,.12);}
.news-grid:hover .news-card:not(:hover){opacity:.5;}
.news-card .nc-img{height:200px;overflow:hidden;}
.news-card .nc-img img{width:100%;height:100%;object-fit:cover;transition:transform .8s var(--ease);}
.news-card:hover .nc-img img{transform:scale(1.05);}
.news-card .nc-body{padding:20px;display:flex;flex-direction:column;gap:8px;flex:1;}
.news-card .nc-cat{font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--amber-deep);}
.news-card h3{font-size:18px;font-weight:500;line-height:1.35;}
.news-card time{font-size:12.5px;color:rgba(29,29,27,.5);margin-top:auto;}
/* article */
.article{max-width:820px;}
.article .a-hero-img{border-radius:18px;overflow:hidden;margin:0 0 36px;}
.article .a-hero-img img{width:100%;display:block;}
.article-body{font-size:17px;line-height:1.75;font-weight:400;color:rgba(29,29,27,.82);}
.article-body h1,.article-body h2,.article-body h3{font-weight:500;letter-spacing:-.01em;margin:1.6em 0 .5em;line-height:1.25;}
.article-body p{margin:0 0 1.1em;}
.article-body img{max-width:100%;border-radius:14px;margin:18px 0;}
.article-body ul,.article-body ol{padding-left:1.3em;margin:0 0 1.2em;}
.a-back{display:inline-block;margin-bottom:28px;font-size:14px;font-weight:600;}
/* gallery */
.gal-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
@media(max-width:900px){.gal-grid{grid-template-columns:repeat(2,1fr);}}
.gal-item{position:relative;border-radius:16px;overflow:hidden;cursor:pointer;}
.gal-item img{width:100%;height:280px;object-fit:cover;display:block;transition:transform .8s var(--ease),filter .6s var(--ease);filter:saturate(.85);}
.gal-item:hover img{transform:scale(1.05);filter:saturate(1.05);}
.gal-item figcaption{position:absolute;left:14px;bottom:14px;background:rgba(20,24,21,.7);color:#fff;font-size:12px;font-weight:600;letter-spacing:.08em;padding:8px 14px;border-radius:999px;backdrop-filter:blur(6px);}
.lightbox{position:fixed;inset:0;z-index:400;background:rgba(20,24,21,.9);display:none;align-items:center;justify-content:center;padding:5vh 5vw;cursor:zoom-out;}
.lightbox.on{display:flex;}
.lightbox img{max-width:100%;max-height:100%;border-radius:12px;}
/* contact */
.contact-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:56px;align-items:start;}
@media(max-width:960px){.contact-grid{grid-template-columns:1fr;}}
.cform{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.cform .full{grid-column:1/-1;}
.cform label{display:block;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(29,29,27,.55);margin:0 0 8px;}
.cform input,.cform textarea{width:100%;background:#fff;border:1px solid rgba(29,29,27,.14);border-radius:12px;padding:14px 16px;font:inherit;font-size:15px;color:var(--ink);transition:border-color .4s var(--ease),box-shadow .4s var(--ease);}
.cform input:focus,.cform textarea:focus{outline:none;border-color:var(--blue);box-shadow:0 0 0 3px rgba(30,82,160,.12);}
.cform textarea{min-height:140px;resize:vertical;}
.form-msg{grid-column:1/-1;font-size:14px;font-weight:600;display:none;}
.form-msg.err{display:block;color:#b3261e;}
.hp{position:absolute;left:-9999px;opacity:0;height:0;overflow:hidden;}
.offices{display:flex;flex-direction:column;}
.office{display:flex;justify-content:space-between;gap:14px;padding:16px 4px;border-top:1px solid rgba(29,29,27,.14);font-size:15px;}
.office a{font-weight:600;color:var(--blue);}
.map-wrap{border-radius:16px;overflow:hidden;margin-top:28px;border:1px solid rgba(29,29,27,.1);}
.map-wrap iframe{display:block;width:100%;height:320px;border:0;}
/* misc */
.legal-body{max-width:820px;font-size:16px;line-height:1.75;color:rgba(29,29,27,.8);}
.legal-body h2,.legal-body h3{font-weight:500;margin:1.6em 0 .5em;}
.center-card{max-width:640px;margin:0 auto;text-align:center;padding:60px 0 20px;}
.center-card .big-check{width:84px;height:84px;border-radius:50%;background:var(--amber);color:var(--ink);font-size:40px;display:flex;align-items:center;justify-content:center;margin:0 auto 28px;}
"""

open(os.path.join(ROOT, "assets", "pages.css"), "w", encoding="utf-8").write(PAGES_CSS)
print("wrote assets/pages.css")

# ---------------------------------------------------------------- categories
os.makedirs(os.path.join(ROOT, "assets", "categories"), exist_ok=True)
cats = j("categories.json")["data"]["data"]
cats = [c for c in cats if c.get("is_active")]
cats.sort(key=lambda c: c.get("category_sort", 99))
cat_cards = []
for i, c in enumerate(cats):
    name = c["category_name"].replace(" = السكر", "")          # clean the mixed-language label
    name = re.sub(r"Bags\)Pet Foods\)", "Pet Food Bags", name)
    src = find_export_image(c["category_image"])
    img = ""
    if src:
        dst = os.path.join(ROOT, "assets", "categories", f"cat{i:02d}.png")
        resize_copy(src, dst, 400)
        img = f'<span class="ci"><img src="assets/categories/cat{i:02d}.png" alt="{html.escape(name)}" loading="lazy"></span>'
    cat_cards.append(
        f'<a class="cat-card" href="contact.html" data-rise>{img}<h3>{html.escape(name)}</h3>'
        f'<span>Enquire &rarr;</span></a>')
body = page_hero("Products", "Packaging for every category.",
                 "Twenty product categories, one standard of print. Tell us what you make — we will package it.") + f"""
<section class="section page-body" data-reveal>
  <div class="wrap"><div class="cat-grid">{''.join(cat_cards)}</div></div>
</section>
</main>"""
write_page("categories.html", "Products — Printopack", "All Printopack packaging categories.", "products", body)

# ---------------------------------------------------------------- news list + articles
os.makedirs(os.path.join(ROOT, "assets", "news"), exist_ok=True)
blogs = j("blogs.json")["data"]["blogs"]["data"]
news_cards = []
for b in blogs:
    bid = b["id"]
    title = b["blog_title"]
    catname = b.get("blog_category_name") or "News"
    date = (b.get("created_at") or "")[:10]
    src = find_export_image(b["blog_image"]) if b.get("blog_image") else None
    imgtag = ""
    if src:
        ext = ".jpg"
        dst = os.path.join(ROOT, "assets", "news", f"blog{bid}{ext}")
        resize_copy(src, dst, 900)
        imgtag = f'<div class="nc-img"><img src="assets/news/blog{bid}{ext}" alt="" loading="lazy"></div>'
    news_cards.append(
        f'<a class="news-card" href="news-{bid}.html" data-rise>{imgtag}'
        f'<div class="nc-body"><span class="nc-cat">{html.escape(catname)}</span>'
        f'<h3>{html.escape(title)}</h3><time>{date}</time></div></a>')

    # ---- article page ----
    single_path = os.path.join(DATA, f"blog_{bid}.json")
    if os.path.exists(single_path):
        one = json.load(open(single_path, encoding="utf-8-sig"))["data"]["blog"]
        text = one.get("blog_text") or ""
        text = text.replace('src="/images/', f'src="{API}/images/')
        heroimg = f'<div class="a-hero-img"><img src="assets/news/blog{bid}.jpg" alt=""></div>' if src else ""
        abody = page_hero(f"{html.escape(catname)} · {date}", html.escape(title)) + f"""
<section class="section page-body" data-reveal>
  <div class="wrap"><div class="article" data-rise>
    <a class="a-back uwipe" href="news.html">&larr; Back to news</a>
    {heroimg}
    <div class="article-body">{text}</div>
  </div></div>
</section>
</main>"""
        write_page(f"news-{bid}.html", f"{title} — Printopack News", title, "news", abody)

body = page_hero("News", "Stories from the press floor.",
                 "Industry insight, product know-how, and updates from Printopack.") + f"""
<section class="section page-body" data-reveal>
  <div class="wrap"><div class="news-grid">{''.join(news_cards)}</div></div>
</section>
</main>"""
write_page("news.html", "News — Printopack", "Printopack news and articles.", "news", body)

# ---------------------------------------------------------------- about
body = page_hero("Company", "Packaging pioneers since 1997.",
                 "From our Jeddah facility, Printopack prints and converts flexible packaging for food, beverage and consumer brands across a diverse global marketplace.") + """
<section class="section page-body" data-reveal>
  <div class="wrap">
    <div class="info-grid">
      <div>
        <h2 data-split>Committed to excellence, always innovating</h2>
        <p class="info-lead" data-rise>Remarkable packaging is our promise. Every structure, laminate and print run is refined until it meets the Printopack standard — then delivered on time, every time.</p>
        <a href="contact.html" class="btn" data-rise>Talk to us</a>
      </div>
      <div>
        <div class="info-item draw-line" data-rise>
          <h4>OUR MISSION</h4>
          <p>To provide creative, compliant flexible packaging with industry-leading customer service to food, beverage, pharmaceutical, and consumer brands across a diverse global marketplace.</p>
        </div>
        <div class="info-item draw-line" data-rise>
          <h4>OUR VISION</h4>
          <p>To be the region's trusted, industry-leading packaging partner — known for ethical practice, reliable supply, and award-winning innovation.</p>
        </div>
      </div>
    </div>
  </div>
</section>
<section class="section stats" data-reveal>
  <div class="wrap">
    <div class="stats-grid">
      <div class="stat" data-rise><div class="stat-num"><span class="num" data-count="6">0</span></div><span class="stat-label">Regional offices</span></div>
      <div class="stat" data-rise><div class="stat-num"><span class="num" data-count="26">0</span><span class="suffix">+</span></div><span class="stat-label">Countries served</span></div>
      <div class="stat" data-rise><div class="stat-num"><span class="num" data-count="25">0</span><span class="suffix">+</span></div><span class="stat-label">Years of printing</span></div>
      <div class="stat" data-rise><div class="stat-num"><span class="num" data-count="400">0</span><span class="suffix">+</span></div><span class="stat-label">Team members</span></div>
    </div>
  </div>
</section>
<section class="section standards" data-reveal>
  <div class="wrap">
    <div class="head">
      <h2 data-split>Factory &amp; product standards</h2>
      <p data-rise>Every product is held to the highest standards of safety, hygiene, and responsible manufacturing.</p>
    </div>
    <div class="cert-row">
      <span class="cert" data-rise>ISO 9001</span><span class="cert" data-rise>ISO 22000</span>
      <span class="cert" data-rise>FSSC 22000</span><span class="cert" data-rise>BRCGS</span>
      <span class="cert" data-rise>SFDA</span><span class="cert" data-rise>HALAL</span>
      <span class="cert" data-rise>GMP</span><span class="cert" data-rise>SEDEX</span>
    </div>
  </div>
</section>
</main>"""
write_page("about.html", "About — Printopack", "About Printopack, Saudi Modern Packaging Factory.", "about", body)

# ---------------------------------------------------------------- gallery
gal = j("gallery_items.json")["data"]["data"]
uuid_map = {"7cf9dca0":"engraving.jpg","59bc0d73":"rotogravure.jpg","55d01997":"bagging.jpg",
            "b157267e":"punching.jpg","831bafa1":"solvent.jpg"}
items = []
for g in gal:
    if not g.get("is_active"): continue
    key = os.path.basename(g["gallery_item_image"]).split("_")[1].split("-")[0]
    f = uuid_map.get(key)
    if not f: continue
    items.append(f'<figure class="gal-item" data-rise data-full="assets/{f}">'
                 f'<img src="assets/{f}" alt="{html.escape(g["gallery_item_name"])}" loading="lazy">'
                 f'<figcaption>{html.escape(g["gallery_item_name"])}</figcaption></figure>')
body = page_hero("Gallery", "Inside the facility.",
                 "Machinery and process — where your packaging is engraved, printed, converted and finished.") + f"""
<section class="section page-body" data-reveal>
  <div class="wrap"><div class="gal-grid">{''.join(items)}</div></div>
</section>
</main>
<div class="lightbox" id="lightbox"><img id="lightboxImg" alt=""></div>"""
gal_js = """<script>
(function(){
  var lb=document.getElementById('lightbox'), im=document.getElementById('lightboxImg');
  document.querySelectorAll('.gal-item').forEach(function(g){
    g.addEventListener('click', function(){ im.src=g.getAttribute('data-full'); lb.classList.add('on'); });
  });
  lb.addEventListener('click', function(){ lb.classList.remove('on'); });
})();
</script>"""
write_page("gallery.html", "Gallery — Printopack", "Printopack facility gallery.", "gallery", body, gal_js)

# ---------------------------------------------------------------- contact
offices = ["Kuwait","Jordan","Algeria","Egypt","Tunisia","Sudan"]
office_rows = "".join(
    f'<div class="office" data-rise><span>{o} office</span>'
    f'<a href="mailto:{o.lower()}@printopack.com.sa">{o.lower()}@printopack.com.sa</a></div>' for o in offices)
body = page_hero("Contact", "Let's make something remarkable.",
                 "Tell us about your product and volumes — our packaging engineers reply within one business day.") + f"""
<section class="section page-body" data-reveal>
  <div class="wrap contact-grid">
    <div>
      <form class="cform" id="cform" novalidate>
        <div><label for="cf-name">Full name</label><input id="cf-name" name="name" required autocomplete="name"></div>
        <div><label for="cf-phone">Phone</label><input id="cf-phone" name="phone" required autocomplete="tel"></div>
        <div><label for="cf-email">Email</label><input id="cf-email" name="email" type="email" required autocomplete="email"></div>
        <div><label for="cf-country">Country</label><input id="cf-country" name="country" required></div>
        <div class="full"><label for="cf-city">City</label><input id="cf-city" name="city" required></div>
        <div class="full"><label for="cf-msg">Message</label><textarea id="cf-msg" name="message" required></textarea></div>
        <div class="hp"><label>Company site</label><input name="website" tabindex="-1" autocomplete="off"></div>
        <div class="form-msg" id="formMsg"></div>
        <div class="full"><button type="submit" class="btn brand" id="cfSend">Send message</button></div>
      </form>
    </div>
    <div>
      <div class="offices">
        <div class="office" data-rise><span>Head office — Jeddah</span><a href="mailto:info@printopack.com.sa">info@printopack.com.sa</a></div>
        {office_rows}
      </div>
      <div class="map-wrap" data-rise>
        <iframe title="Printopack Jeddah" loading="lazy"
          src="https://www.openstreetmap.org/export/embed.html?bbox=39.15%2C21.35%2C39.40%2C21.55&amp;layer=mapnik&amp;marker=21.45%2C39.27"></iframe>
      </div>
    </div>
  </div>
</section>
</main>"""
contact_js = """<script>
(function(){
  var form=document.getElementById('cform'), msg=document.getElementById('formMsg'), btn=document.getElementById('cfSend');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    msg.className='form-msg';
    if(form.website && form.website.value){ return; }                     /* honeypot */
    if(!form.checkValidity()){ form.reportValidity(); return; }
    var payload={ name:form.name.value.trim(), phone:form.phone.value.trim(),
                  email:form.email.value.trim(), country:form.country.value.trim(),
                  city:form.city.value.trim(), message:form.message.value.trim() };
    btn.style.pointerEvents='none'; btn.style.opacity='.6';
    fetch('https://api.printopack.com.sa/api/contact', {
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json','Accept-Language':'en'},
      body:JSON.stringify(payload)
    }).then(function(r){ return r.json().catch(function(){ return {}; }).then(function(j){ return {ok:r.ok, j:j}; }); })
      .then(function(res){
        if(res.ok && res.j.success !== false){ window.location.href='thank-you.html'; }
        else { throw new Error((res.j && res.j.message) || 'send failed'); }
      })
      .catch(function(){
        msg.textContent='Could not send right now — please email info@printopack.com.sa directly.';
        msg.className='form-msg err';
        btn.style.pointerEvents=''; btn.style.opacity='';
      });
  });
})();
</script>"""
write_page("contact.html", "Contact — Printopack", "Contact Printopack for quotations and enquiries.", "contact", body, contact_js)

# ---------------------------------------------------------------- thank you
body = page_hero("Thank you", "Message received.") + """
<section class="section page-body" data-reveal>
  <div class="wrap"><div class="center-card" data-rise>
    <div class="big-check">&#10003;</div>
    <p class="ph-sub" style="margin:0 auto 30px;">Our packaging engineers will get back to you within one business day.</p>
    <a href="index.html" class="btn brand">Back to home</a>
  </div></div>
</section>
</main>"""
write_page("thank-you.html", "Thank you — Printopack", "Your enquiry was sent.", "", body)

# ---------------------------------------------------------------- legal pages
def legal_html(fname):
    d = j(fname)["data"]
    def hunt(o):
        best = ""
        if isinstance(o, dict):
            for v in o.values():
                r = hunt(v)
                if len(r) > len(best): best = r
        elif isinstance(o, list):
            for v in o:
                r = hunt(v)
                if len(r) > len(best): best = r
        elif isinstance(o, str) and len(o) > len(best):
            best = o
        return best
    text = hunt(d)
    if "<" not in text:  # plain text -> paragraphs
        text = "".join(f"<p>{html.escape(p.strip())}</p>" for p in text.split("\n") if p.strip())
    return text

for fname, route, title, kicker in [("privacy.json","privacy.html","Privacy Policy","Legal"),
                                    ("conditions.json","conditions.html","Terms & Conditions","Legal")]:
    content = legal_html(fname)
    body = page_hero(kicker, title) + f"""
<section class="section page-body" data-reveal>
  <div class="wrap"><div class="legal-body" data-rise>{content}</div></div>
</section>
</main>"""
    write_page(route, f"{title} — Printopack", title, "", body)

# ---------------------------------------------------------------- 404
body = page_hero("404", "This page went missing.") + """
<section class="section page-body" data-reveal>
  <div class="wrap"><div class="center-card" data-rise>
    <p class="ph-sub" style="margin:0 auto 30px;">The address may have changed. Head back home and try again.</p>
    <a href="index.html" class="btn brand">Back to home</a>
  </div></div>
</section>
</main>"""
write_page("404.html", "Not found — Printopack", "Page not found.", "", body)

print("BUILD COMPLETE")
