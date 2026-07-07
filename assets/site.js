/*! Printopack v2.0 — GSAP + ScrollTrigger + Lenis + model-viewer. No frameworks, no build step. */

/* =========================================================================
   Printopack — motion built to match the real Yucca site:
   GSAP + ScrollTrigger + Lenis, layered per-section reveal timelines,
   per-word split headlines, velocity-reactive marquee, multi-stage preloader.
   ========================================================================= */
(function(){
  var hasGSAP = window.gsap && window.ScrollTrigger;
  var REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(REDUCED && hasGSAP){ gsap.globalTimeline.timeScale(1000); }   // reveals become instant, layout identical

  // console signature — for the ones who look under the hood
  try{
    console.log('%cPRINTOPACK%c  packaging that performs',
      'font-size:22px;font-weight:200;letter-spacing:.35em;color:#1e52a0;',
      'font-size:12px;color:#e8940f;letter-spacing:.15em;');
    console.log('%cdesign system v2.0 — GSAP · Lenis · model-viewer · zero frameworks',
      'font-size:11px;color:#8a8a86;');
  }catch(e){}
  if(hasGSAP){ gsap.registerPlugin(ScrollTrigger); }

  /* ---------- Split headings into per-word masked spans ---------- */
  function splitWords(el){
    var words = el.textContent.split(/(\s+)/);
    el.textContent = '';
    var spans = [];
    words.forEach(function(w){
      if(w.trim() === ''){ el.appendChild(document.createTextNode(w)); return; }
      var outer = document.createElement('span'); outer.className = 'word';
      var inner = document.createElement('span'); inner.textContent = w;
      outer.appendChild(inner); el.appendChild(outer);
      spans.push(inner);
    });
    return spans;
  }
  // ---------- Bilingual EN / AR (site chrome + key copy; choice persists) ----------
  var LANG = 'en';
  try{ LANG = localStorage.getItem('pp-lang') || 'en'; }catch(e){}
  var AR = {
    "Home":"الرئيسية",
    "Solutions":"الحلول",
    "Company":"الشركة",
    "Capabilities":"قدراتنا",
    "Products":"المنتجات",
    "News":"الأخبار",
    "About":"من نحن",
    "Gallery":"المعرض",
    "Contact":"اتصل بنا",
    "FAQs":"الأسئلة",
    "Customer":"دخول العملاء",
    "Admin":"الإدارة",
    "Customer Login":"دخول العملاء",
    "Request a Quote":"اطلب عرض سعر",
    "Scroll":"مرّر",
    "Est. 1997":"تأسست ١٩٩٧",
    "Saudi Modern Packaging Factory Co. Ltd.":"مصنع السعودية الحديثة للتغليف المحدود",
    "Packaging that performs. Printed for brands that lead.":"تغليف يتفوّق. مطبوع لعلامات تجارية تقود.",
    "Where technology meets vision.":"حيث تلتقي التقنية بالرؤية.",
    "Committed to excellence, always innovating":"ملتزمون بالتميّز، نبتكر دائمًا",
    "What we make":"ماذا نصنع",
    "Custom solutions":"حلول مخصصة",
    "Standards":"المعايير",
    "Clients":"العملاء",
    "FAQ":"الأسئلة",
    "Brands that thrive invest in custom-designed packaging. Let's bring your vision to life.":"العلامات الناجحة تستثمر في تغليف مصمّم خصيصًا. لنحوّل رؤيتك إلى واقع.",
    "Factory & product standards":"معايير المصنع والمنتج",
    "Our clients":"عملاؤنا",
    "Frequently asked questions":"الأسئلة الشائعة",
    "Set the standard for packaging in your industry.":"ضع معيار التغليف في مجالك.",
    "Tell me more":"اعرف المزيد",
    "About us":"من نحن",
    "Talk to us":"تحدث معنا",
    "Regional offices":"مكاتب إقليمية",
    "Countries served":"دولة نخدمها",
    "Years of printing":"عامًا من الطباعة",
    "Team members":"موظفًا",
    "Call us":"اتصل بنا",
    "Email us":"راسلنا",
    "Visit us":"زرنا",
    "Trusted by leading food, beverage and consumer brands.":"موثوقون لدى كبرى علامات الأغذية والمشروبات والمستهلك.",
    "Snacks & Confectionery":"الوجبات الخفيفة والحلويات",
    "Beverage & Dairy":"المشروبات والألبان",
    "Home & Everyday":"المنزل واليومي",
    "Home & Everyday Essentials":"المنزل والأساسيات اليومية",
    "OUR MISSION":"رسالتنا",
    "OUR VISION":"رؤيتنا",
    "Packaging pioneers since 1997. From our Jeddah facility, every structure, laminate and print run is refined until it meets the Printopack standard — then delivered on time, every time.":"روّاد التغليف منذ ١٩٩٧. من منشأتنا في جدة، نُتقن كل تركيبة وطبقة وطبعة حتى تبلغ معيار برينتوباك — ثم نسلّمها في موعدها، في كل مرة.",
    "To provide creative, compliant flexible packaging with industry-leading customer service to food, beverage, pharmaceutical, and consumer brands across a diverse global marketplace.":"تقديم تغليف مرن مبتكر ومتوافق مع المعايير، مع خدمة عملاء رائدة لعلامات الأغذية والمشروبات والأدوية والمستهلك حول العالم.",
    "To be the region's trusted, industry-leading packaging partner — known for ethical practice, reliable supply, and award-winning innovation.":"أن نكون شريك التغليف الموثوق والرائد في المنطقة — بممارسات أخلاقية وتوريد موثوق وابتكار متميّز.",
    "Packaging for every category.":"تغليف لكل فئة.",
    "Stories from the press floor.":"قصص من قلب المطبعة.",
    "Inside the facility.":"داخل المنشأة.",
    "Let's make something remarkable.":"لنصنع شيئًا استثنائيًا.",
    "Thank you":"شكرًا لك",
    "Message received.":"وصلتنا رسالتك.",
    "Legal":"قانوني",
    "Privacy Policy":"سياسة الخصوصية",
    "Terms & Conditions":"الشروط والأحكام",
    "Full name":"الاسم الكامل",
    "Phone":"الهاتف",
    "Email":"البريد الإلكتروني",
    "Country":"الدولة",
    "City":"المدينة",
    "Message":"الرسالة",
    "Send message":"أرسل الرسالة",
    "Back to home":"العودة إلى الرئيسية",
    "Head office — Jeddah":"المكتب الرئيسي — جدة",
    "Chips & Snacks":"شيبس ومقرمشات",
    "Chocolates":"شوكولاتة",
    "Bakery Products":"مخبوزات",
    "Candy":"حلوى",
    "Coffee & Tea":"قهوة وشاي",
    "Ice Cream":"آيس كريم",
    "Bottle Labels":"ملصقات العبوات",
    "Lids":"أغطية",
    "Rice & Pasta":"أرز ومعكرونة",
    "Spices":"بهارات",
    "Chips, chocolates, bakery,":"شيبس، شوكولاتة، مخبوزات،",
    "candy & ice cream films.":"وأفلام الحلوى والآيس كريم.",
    "PET & glass bottle labels,":"ملصقات عبوات PET والزجاج،",
    "lids & hot-fill packaging.":"والأغطية وتعبئة السوائل الساخنة.",
    "Tissue wraps, pet-food bags,":"أغلفة المناديل وأكياس أغذية الحيوانات،",
    "rice, pasta & spices.":"والأرز والمعكرونة والبهارات.",
    "Rotogravure Printing":"طباعة روتوغرافيور",
    "Cylinder Engraving":"حفر الأسطوانات",
    "Bag Making":"تصنيع الأكياس",
    "Punching & Finishing":"التخريم والتشطيب",
    "Photographic-quality, multi-colour print with tight registration at production speed.":"طباعة متعددة الألوان بجودة فوتوغرافية ودقة محاذاة عالية وبسرعة إنتاجية.",
    "In-house engraved cylinders for precise, repeatable print — from artwork to press, faster.":"أسطوانات محفورة داخليًا لطباعة دقيقة وقابلة للتكرار — من التصميم إلى المطبعة أسرع.",
    "Converted bags and pouches in every format and measurement your line requires.":"أكياس وعبوات محوّلة بكل المقاسات التي يتطلبها خط إنتاجك.",
    "Precision punching and finishing with solvent recovery for responsible production.":"تخريم وتشطيب دقيقان مع استرجاع المذيبات لإنتاج مسؤول.",
    "High-barrier printed films and bags for chips, chocolates, bakery, candy, nuts and ice cream — keeping every product fresh with print that stands out on the shelf.":"أفلام وأكياس مطبوعة عالية الحماية للشيبس والشوكولاتة والمخبوزات والحلوى والمكسرات والآيس كريم — تحافظ على المنتج طازجًا بطباعة تتألق على الرف.",
    "PET and glass bottle labels, lids, jar and bottle sleeves, and hot-fill liquid packaging — vivid rotogravure print engineered for filling lines.":"ملصقات عبوات PET والزجاج والأغطية وأكمام البرطمانات وتعبئة السوائل الساخنة — طباعة روتوغرافيور زاهية مصممة لخطوط التعبئة.",
    "Soft and wet tissue wraps, pet-food bags, and packaging for rice, pasta, sugar and spices — durable structures for daily-use products.":"أغلفة المناديل الجافة والمبللة وأكياس أغذية الحيوانات وتغليف الأرز والمعكرونة والسكر والبهارات — هياكل متينة لمنتجات الاستخدام اليومي.",
    "Every product is held to the highest standards of safety, hygiene, and responsible manufacturing.":"كل منتج يخضع لأعلى معايير السلامة والنظافة والتصنيع المسؤول.",
    "What types of packaging do you offer?":"ما أنواع التغليف التي تقدمونها؟",
    "Which industries do you serve?":"ما القطاعات التي تخدمونها؟",
    "Do you deliver internationally?":"هل توصلون دوليًا؟",
    "How do I place an order?":"كيف أقدّم طلبًا؟",
    "Do you offer sustainable options?":"هل تتوفر خيارات مستدامة؟",
    "We supply a full range of flexible packaging — printed roll stock, laminates, pouches, and lidding films — from ready formats to fully bespoke branded structures.":"نوفر مجموعة كاملة من التغليف المرن — رولات مطبوعة ورقائق متعددة الطبقات وأكياس وأغطية — من التنسيقات الجاهزة إلى الهياكل المخصصة بالكامل.",
    "Food and beverage, pharmaceutical and healthcare, and personal and home care brands, from regional producers to multinational names.":"الأغذية والمشروبات، والأدوية والرعاية الصحية، والعناية الشخصية والمنزلية — من المنتجين الإقليميين إلى الأسماء العالمية.",
    "Yes. Alongside nationwide delivery across Saudi Arabia, we serve export customers throughout the GCC and a diverse global marketplace.":"نعم. إلى جانب التوصيل داخل السعودية، نخدم عملاء التصدير في دول الخليج وسوق عالمي متنوع.",
    "Contact our team with your specifications for a quotation. For custom structures or printed designs, our packaging engineers will guide you from artwork to delivery.":"تواصل مع فريقنا بمواصفاتك للحصول على عرض سعر. وللهياكل أو التصاميم المخصصة يرافقك مهندسونا من التصميم حتى التسليم.",
    "Yes. We offer recyclable mono-material structures, down-gauged films, and packaging with post-consumer recycled content.":"نعم. نوفر هياكل أحادية المادة قابلة للتدوير وأفلامًا مخففة وتغليفًا بمحتوى معاد تدويره.",
    "Printopack — Saudi Modern Packaging Factory Co. Ltd. 2026. All rights reserved.":"برينتوباك — مصنع السعودية الحديثة للتغليف المحدود ٢٠٢٦. جميع الحقوق محفوظة.",
    "Jeddah, KSA —":"جدة، السعودية —",
    "See what we make →":"شاهد ما نصنع ←",
    "Request full specifications →":"اطلب المواصفات الكاملة ←",
    "Privacy":"الخصوصية",
    "Conditions":"الشروط",
    "Careers":"الوظائف",
    "Enquire →":"استفسر ←",
    "Global reach":"انتشار عالمي",
    "From Jeddah to the world.":"من جدة إلى العالم.",
    "Seven offices. 26+ countries served. One standard of print.":"سبعة مكاتب. أكثر من ٢٦ دولة. معيار طباعة واحد.",
    "+26 countries served":"+٢٦ دولة نخدمها",
    "Jeddah — HQ":"جدة — المقر الرئيسي",
    "Kuwait":"الكويت",
    "Jordan":"الأردن",
    "Egypt":"مصر",
    "Sudan":"السودان",
    "Tunisia":"تونس",
    "Algeria":"الجزائر"
  };
  if(LANG === 'ar'){
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var tn;
    while(tn = walker.nextNode()){
      var t = tn.textContent.trim();
      if(t && AR[t]) tn.textContent = tn.textContent.replace(t, AR[t]);
    }
    document.querySelectorAll('[data-name]').forEach(function(el){
      var n = el.getAttribute('data-name');
      if(AR[n]) el.setAttribute('data-name', AR[n]);
    });
  }
  var langBtn = document.createElement('button');
  langBtn.className = 'lang-toggle';
  langBtn.type = 'button';
  langBtn.textContent = LANG === 'ar' ? 'EN' : 'ع';
  langBtn.setAttribute('aria-label', 'Switch language');
  langBtn.addEventListener('click', function(){
    try{ localStorage.setItem('pp-lang', LANG === 'ar' ? 'en' : 'ar'); }catch(e){}
    location.reload();
  });
  document.body.appendChild(langBtn);

  document.querySelectorAll('[data-split]').forEach(function(el){
    el._words = splitWords(el);
  });
  // serif italic accents on the hero's key words — the editorial signature
  document.querySelectorAll('.hero h1 .word > span').forEach(function(sp){
    if(/^(performs\.|lead\.)$/.test(sp.textContent.trim())) sp.classList.add('serif-accent');
  });

  /* ---------- Set initial hidden states (only when GSAP is present) ---------- */
  if(hasGSAP){
    gsap.set('[data-media]', {clipPath:'inset(0% 0% 100% 0%)'});
    gsap.set('.hero-media .media-inner, .marquee-media .media-inner, .custom-media .media-inner, .sol-bg .media-inner', {scale:1.4});
    document.querySelectorAll('[data-split]').forEach(function(el){ gsap.set(el._words, {yPercent:135}); });
    gsap.set('[data-rise]', {y:40, autoAlpha:0, scale:0.96, transformOrigin:'50% 60%'});
    gsap.set('.sol-divider', {scaleX:0});
  }

  /* ---------- Reusable reveal timeline for a section ---------- */
  function revealSection(section){
    var tl = gsap.timeline();
    var media = section.querySelectorAll('[data-media]');
    media.forEach(function(m,i){
      tl.to(m, {clipPath:'inset(0% 0% 0% 0%)', duration:0.8, ease:'power3.inOut'}, i*0.05);
      var inner = m.querySelector('.media-inner');
      if(inner && gsap.getProperty(inner,'scale') !== 1){
        tl.to(inner, {scale:1, duration:1.6, ease:'power3.out'}, i*0.05 + 0.05);
      }
    });
    section.querySelectorAll('[data-split]').forEach(function(el){
      tl.to(el._words, {yPercent:0, duration:1.0, stagger:0.05, ease:'power3.out'}, 0.1);
    });
    var rises = section.querySelectorAll('[data-rise]');
    if(rises.length){
      // fade + rise + scale-pop with a whisper of overshoot — springy, not slidey
      tl.to(rises, {y:0, autoAlpha:1, scale:1, duration:0.85, stagger:0.045, ease:'back.out(1.2)'}, 0.15);
    }
    var dividers = section.querySelectorAll('.sol-divider');
    if(dividers.length){
      tl.to(dividers, {scaleX:1, duration:0.8, ease:'power3.inOut'}, 0.2);
    }
    // Divider line draw-ins (info rows, FAQ rows) — staggered scaleX via CSS class
    section.querySelectorAll('.draw-line').forEach(function(el, i){
      setTimeout(function(){ el.classList.add('lined'); }, 350 + i*130);
    });
    return tl;
  }

  /* ---------- Marquee (GSAP loop, velocity-reactive) ---------- */
  var marquees = [];
  function buildMarquee(el){
    var inner = el.querySelector('.marquee-inner');
    // duplicate content once for a seamless loop
    inner.innerHTML += inner.innerHTML;
    var speed = parseFloat(el.getAttribute('data-speed')) || 80;
    var loopWidth = inner.scrollWidth / 2;
    var tween = gsap.to(inner, {x:-loopWidth, duration:loopWidth/speed, ease:'none', repeat:-1});
    var m = {tween:tween, base:1, inner:inner};
    el.addEventListener('mouseenter', function(){ gsap.to(tween, {timeScale:0.25, duration:0.4}); });
    el.addEventListener('mouseleave', function(){ gsap.to(tween, {timeScale:m.base, duration:0.4}); });
    marquees.push(m);
    return m;
  }

  /* ---------- Accordion interactions (FAQ + Solutions) ---------- */
  function initInteractions(){
    // FAQ — click to toggle, single-open. CSS animates opacity; JS drives height.
    function setH(a, open){ a.style.maxHeight = open ? a.scrollHeight + 'px' : '0px'; }
    var faqItems = document.querySelectorAll('[data-faq]');
    faqItems.forEach(function(item){
      var q = item.querySelector('.faq-q');
      var a = item.querySelector('.faq-a');
      if(item.classList.contains('open')) setH(a, true);
      q.addEventListener('click', function(){
        var willOpen = !item.classList.contains('open');
        faqItems.forEach(function(i){ i.classList.remove('open'); setH(i.querySelector('.faq-a'), false); });
        if(willOpen){ item.classList.add('open'); setH(a, true); }
      });
    });
    window.addEventListener('resize', function(){
      faqItems.forEach(function(i){ if(i.classList.contains('open')) setH(i.querySelector('.faq-a'), true); });
    });

    // Solutions — hover (desktop) or tap to expand, accordion style, first open.
    var solCards = document.querySelectorAll('[data-sol]');
    solCards.forEach(function(card){
      function openThis(){ solCards.forEach(function(c){ c.classList.remove('open'); }); card.classList.add('open'); }
      card.addEventListener('mouseenter', openThis);
      card.addEventListener('click', openThis);
    });
    // all cards rest closed — fold everything when the cursor leaves the group
    var solList = document.querySelector('.sol-list');
    if(solList){
      solList.addEventListener('mouseleave', function(){
        solCards.forEach(function(c){ c.classList.remove('open'); });
      });
    }

    // Nav links — vertical text-swap hover (two stacked copies slide up)
    document.querySelectorAll('.nav-links a').forEach(function(a){
      var t = a.textContent.trim();
      a.innerHTML = '<span class="swap"><span class="ln">' + t + '</span><span class="lh">' + t + '</span></span>';
    });

    // Buttons — duplicate the label so it can swap vertically while the fill wipes up
    document.querySelectorAll('.btn').forEach(function(btn){
      var html = btn.innerHTML;
      btn.innerHTML = '<span class="btn-swap"><span class="bl">' + html + '</span><span class="bh" aria-hidden="true">' + html + '</span></span>';
    });

    // Mega menu — nav expands downward with a detail panel; page dims behind
    var header = document.querySelector('header');
    var dim = document.getElementById('pageDim');
    function openMega(key){
      document.querySelectorAll('.mega-panel').forEach(function(p){
        p.classList.toggle('on', p.getAttribute('data-panel') === key);
      });
      header.classList.add('mega-open');
      if(dim) dim.classList.add('on');
    }
    function closeMega(){
      header.classList.remove('mega-open');
      if(dim) dim.classList.remove('on');
    }
    document.querySelectorAll('.nav-links a').forEach(function(a){
      a.addEventListener('mouseenter', function(){
        var key = a.getAttribute('data-mega');
        key ? openMega(key) : closeMega();
      });
    });
    header.addEventListener('mouseleave', closeMega);
    document.querySelectorAll('.mega a, .nav-links a').forEach(function(a){
      a.addEventListener('click', closeMega);
    });

    // Live Jeddah clock in the footer
    var clock = document.getElementById('jClock');
    if(clock){
      var fmt = new Intl.DateTimeFormat('en-GB', {timeZone:'Asia/Riyadh', hour:'2-digit', minute:'2-digit', second:'2-digit'});
      var tick = function(){ clock.textContent = fmt.format(new Date()); };
      tick(); setInterval(tick, 1000);
    }
  }

  /* ---------- 3D model fallback ----------
     On file:// pages the browser blocks fetching the local .glb (CORS), and can
     also block the module script — either way the model silently never shows.
     Detect both cases and show an instruction card instead of empty space. */
  function showModelFallback(msg){
    var mv = document.getElementById('heroModel');
    if(!mv) return;
    var fb = document.createElement('div');
    fb.className = 'hero-model model-fallback';
    fb.innerHTML = '<span>' + msg + '</span>';
    mv.replaceWith(fb);
  }
  function initModelFallback(){
    var mv = document.getElementById('heroModel');
    if(!mv) return;
    if(location.protocol === 'file:'){
      showModelFallback('The 3D pack render can\'t load from a double-clicked file.<br><b>Double-click run.bat in this folder</b> — it opens the site properly with the 3D model.');
      return;
    }
    mv.addEventListener('error', function(){
      showModelFallback('3D model failed to load — check that <b>model.glb</b> is in the site folder.');
    });
    setTimeout(function(){
      if(!customElements.get('model-viewer')){
        showModelFallback('3D viewer script could not load (no internet connection to CDN).');
      }
    }, 4000);
  }

  /* ---------- Luxury layer: cursor, magnetic CTAs, header, counters, wordmark ---------- */
  function initLuxury(){
    var fine = window.matchMedia && matchMedia('(pointer:fine)').matches;

    // Custom cursor: dot snaps, ring lerps behind, swells over interactive elements
    var dot = document.getElementById('cursorDot'), ring = document.getElementById('cursorRing');
    if(fine && dot && ring){
      var mx=-100,my=-100,rx=-100,ry=-100;
      document.addEventListener('mousemove', function(e){ mx=e.clientX; my=e.clientY; });
      (function follow(){
        rx += (mx-rx)*0.16; ry += (my-ry)*0.16;
        dot.style.left = mx+'px'; dot.style.top = my+'px';
        ring.style.left = rx+'px'; ring.style.top = ry+'px';
        requestAnimationFrame(follow);
      })();
      document.addEventListener('mouseover', function(e){
        if(e.target.closest && e.target.closest('a,button,.btn,.hero-card,.sol-card,.faq-q,.prod-card,.client-logo')) ring.classList.add('big');
      });
      document.addEventListener('mouseout', function(e){
        if(e.target.closest && e.target.closest('a,button,.btn,.hero-card,.sol-card,.faq-q,.prod-card,.client-logo')) ring.classList.remove('big');
      });
    } else { if(dot) dot.style.display='none'; if(ring) ring.style.display='none'; }

    // Magnetic CTAs: pull toward the cursor, elastic spring back
    if(fine && hasGSAP){
      document.querySelectorAll('.btn').forEach(function(btn){
        btn.addEventListener('mousemove', function(e){
          var r = btn.getBoundingClientRect();
          gsap.to(btn, {x:(e.clientX-r.left-r.width/2)*0.28, y:(e.clientY-r.top-r.height/2)*0.35, duration:0.4, ease:'power3.out'});
        });
        btn.addEventListener('mouseleave', function(){
          gsap.to(btn, {x:0, y:0, duration:0.9, ease:'elastic.out(1,0.35)'});
        });
      });
    }

    // Tactile press: everything clickable squishes down, springs back on release
    if(hasGSAP){
      document.querySelectorAll('.btn,.hero-card,.prod-card,.client-logo,.footer-card,.cert').forEach(function(el){
        el.addEventListener('pointerdown', function(){
          gsap.to(el, {scale:0.95, duration:0.16, ease:'power2.out'});
        });
        function release(){ gsap.to(el, {scale:1, duration:0.55, ease:'back.out(2)'}); }
        el.addEventListener('pointerup', release);
        el.addEventListener('pointerleave', release);
      });
    }

    // Smart header: hide on scroll down, reveal on scroll up
    var header = document.querySelector('header'), lastY = 0;
    window.addEventListener('scroll', function(){
      var y = window.scrollY;
      if(y > 320 && y > lastY + 4) header.classList.add('hidden');
      else if(y < lastY - 4 || y <= 320) header.classList.remove('hidden');
      header.classList.toggle('scrolled', y > 60);
      lastY = y;
    }, {passive:true});

    if(hasGSAP){
      // Scroll progress hairline
      gsap.to('#scrollProgress', {scaleX:1, ease:'none',
        scrollTrigger:{start:0, end:'max', scrub:0.3}});

      // Stat counters: count up on first view
      document.querySelectorAll('.stat .num').forEach(function(el){
        var target = parseInt(el.getAttribute('data-count'), 10);
        ScrollTrigger.create({trigger:el, start:'top 88%', once:true, onEnter:function(){
          gsap.fromTo(el, {textContent:0}, {textContent:target, duration:1.8, ease:'power3.out',
            snap:{textContent:1},
            onUpdate:function(){ el.textContent = Math.round(parseFloat(el.textContent)); }});
        }});
      });

      // Footer wordmark: letters rise from masks, then drift on scroll
      var mark = document.querySelector('.footer-mark div');
      if(mark){
        var text = mark.textContent; mark.textContent = '';
        var inners = [];
        text.split('').forEach(function(chr){
          var outer = document.createElement('span'); outer.className = 'ch';
          var inner = document.createElement('span'); inner.textContent = chr;
          outer.appendChild(inner); mark.appendChild(outer); inners.push(inner);
        });
        gsap.set(inners, {yPercent:140});
        ScrollTrigger.create({trigger:mark, start:'top 92%', once:true, onEnter:function(){
          gsap.to(inners, {yPercent:0, duration:1.1, stagger:0.045, ease:'power3.out'});
        }});
      }

      // 3D model idle float: gentle bob so it feels alive before any scroll
      var mv = document.getElementById('heroModel');
      if(mv && !REDUCED){ gsap.to(mv, {y:14, duration:3.4, yoyo:true, repeat:-1, ease:'sine.inOut'}); }
    }
  }

  /* ---------- Global map: orange connectors from the Jeddah hub ---------- */
  function initMap(){
    var stage = document.getElementById('gmapStage');
    if(!stage || !hasGSAP) return;
    var hub = stage.querySelector('.gnode.hub');
    var nodes = Array.prototype.slice.call(stage.querySelectorAll('.gnode:not(.hub)'));
    var lines = nodes.map(function(){ var l = document.createElement('div'); l.className = 'gline'; stage.appendChild(l); return l; });
    function layout(){
      // offset* coordinates ignore transforms — immune to the stage's scale-in reveal
      function c(el){ return {x: el.offsetLeft + el.offsetWidth / 2, y: el.offsetTop + el.offsetHeight / 2}; }
      var h = c(hub);
      nodes.forEach(function(n, i){
        var p = c(n), dx = p.x - h.x, dy = p.y - h.y;
        var len = Math.sqrt(dx*dx + dy*dy), ang = Math.atan2(dy, dx) * 180 / Math.PI;
        var l = lines[i];
        l.style.left = h.x + 'px'; l.style.top = h.y + 'px';
        l.style.width = len + 'px'; l.style.transform = 'rotate(' + ang + 'deg)';
      });
    }
    layout();
    window.addEventListener('resize', layout);
    window.addEventListener('load', layout);
    gsap.set(lines, {clipPath:'inset(0 100% 0 0)'});
    gsap.set([hub].concat(nodes), {scale:0, transformOrigin:'50% 50%'});
    ScrollTrigger.create({trigger:stage, start:'top 78%', once:true, onEnter:function(){
      layout();
      var tl = gsap.timeline();
      tl.to(hub, {scale:1, duration:0.6, ease:'back.out(2)'}, 0)
        .to(lines, {clipPath:'inset(0 0% 0 0)', duration:0.7, stagger:0.12, ease:'power3.inOut'}, 0.2)
        .to(nodes, {scale:1, duration:0.5, stagger:0.12, ease:'back.out(2)'}, 0.55);
    }});
  }

  /* ---------- Boot ---------- */
  function boot(){
    initMap();
    initInteractions();
    initModelFallback();
    initLuxury();
    if(hasGSAP){
      if(!REDUCED) document.querySelectorAll('[data-marquee]').forEach(buildMarquee);

      // Per-section reveals on scroll (hero plays after preloader)
      document.querySelectorAll('[data-reveal]').forEach(function(section){
        if(section.classList.contains('hero')) return;
        ScrollTrigger.create({
          trigger:section,
          start:'top 80%',
          once:true,
          onEnter:function(){ revealSection(section); }
        });
      });

      // Hero headline drifts up slower than the scroll and softens away
      gsap.to('.hero h1', {y:90, autoAlpha:0.15, ease:'none',
        scrollTrigger:{trigger:'.hero-stage', start:'top 65%', end:'bottom 15%', scrub:true}});

      // Parallax drift
      document.querySelectorAll('[data-parallax]').forEach(function(el){
        var amt = parseFloat(el.getAttribute('data-parallax')) || 0.1;
        gsap.to(el, {
          yPercent: -amt*100,
          ease:'none',
          scrollTrigger:{trigger:el.closest('.media')||el, start:'top bottom', end:'bottom top', scrub:true}
        });
      });

      // ---- Cinematic camera system for the hero 3D model ----
      // One lerped camera state blends four inputs so every move melts together:
      //  1. scroll: yaw spin + a crane arc (pitch) + a dolly-in at mid-scroll
      //  2. cursor: the pouch subtly turns to face the mouse
      //  3. inertia: fast scrolling kicks extra rotation that eases back out
      //  4. entrance: camera starts pulled back + rotated, glides into place on load
      var mv = document.getElementById('heroModel');
      if(mv){
        var cam    = {yaw:-60, pitch:78, r:115};   // current (lerped every frame)
        var prog = 0, mx = 0, my = 0, kick = 0;

        ScrollTrigger.create({
          trigger:'.hero', start:'top top', end:'bottom top', scrub:true,
          onUpdate:function(self){ prog = self.progress; }
        });
        if(window.matchMedia && matchMedia('(pointer:fine)').matches){
          document.addEventListener('mousemove', function(e){
            mx = (e.clientX / innerWidth)  * 2 - 1;
            my = (e.clientY / innerHeight) * 2 - 1;
          });
        }
        // scroll-velocity inertia (fed from the Lenis handler below)
        window.__mvKick = function(v){
          kick += v * 0.12;
          if(kick >  25) kick =  25;
          if(kick < -25) kick = -25;
        };

        var swayT = 0;
        (function camLoop(){
          swayT += 0.016;
          var sway  = Math.sin(swayT * 0.7) * 3.2;      // perpetual gentle sway = motion parallax
          var swayP = Math.cos(swayT * 0.5) * 1.6;
          var arc  = Math.sin(prog * Math.PI);          // 0 -> 1 -> 0 across the hero
          var yaw   = -60 + prog * 100 + mx * 7 + kick + sway;
          var pitch = 78 - 6 * Math.sin(prog * Math.PI * 2) - my * 5 + swayP;  // crane arc
          var r     = 115 - 16 * arc;                   // dolly in at mid-scroll, back out
          kick *= 0.92;                                  // inertia decays to rest
          cam.yaw   += (yaw   - cam.yaw)   * 0.08;      // soft lerp = filmic damping
          cam.pitch += (pitch - cam.pitch) * 0.08;
          cam.r     += (r     - cam.r)     * 0.08;
          mv.setAttribute('camera-orbit',
            cam.yaw.toFixed(2) + 'deg ' + cam.pitch.toFixed(2) + 'deg ' + cam.r.toFixed(2) + '%');
          requestAnimationFrame(camLoop);
        })();

        // ---- Liquid pool behind the pouch ----
        // Layered soft-blurred blobs slosh and morph like a body of water;
        // thick bright ripples expand across it. Scroll velocity agitates
        // everything (bigger swell, choppier edges, faster ripples), then it
        // all settles calm. The pool center rides the model's idle bob.
        var wcvs = document.getElementById('heroWaves');
        if(wcvs && !REDUCED){
          var wctx = wcvs.getContext('2d');
          var energy = 0, rings = [], lastSpawn = 0, wt = 0;
          window.__waveKick = function(v){ energy = Math.min(1.8, energy + Math.abs(v) * 0.06); };
          function sizeWaves(){
            var r = wcvs.getBoundingClientRect(), d = window.devicePixelRatio || 1;
            wcvs.width = r.width * d; wcvs.height = r.height * d;
            wctx.setTransform(d, 0, 0, d, 0, 0);
          }
          sizeWaves(); window.addEventListener('resize', sizeWaves);

          // outer -> inner so the denser inner water sits on top (balanced presence)
          var POOL = [
            {R:0.54, amp:0.10, sp:0.20, blur:30, color:'rgba(30,82,160,0.10)'},
            {R:0.42, amp:0.08, sp:0.27, blur:24, color:'rgba(232,148,18,0.12)'},
            {R:0.30, amp:0.06, sp:0.34, blur:18, color:'rgba(30,82,160,0.19)'}
          ];

          function blobPath(cx, cy, base, amp, sp, phase){
            wctx.beginPath();
            for(var i = 0; i <= 72; i++){
              var th = i / 72 * Math.PI * 2;
              var rr = base * (1
                + amp * Math.sin(th * 3 + wt * sp * 2 + phase)
                + amp * 0.6 * Math.sin(th * 5 - wt * sp * 3 + phase * 2));
              var x = cx + Math.cos(th) * rr;
              var y = cy + Math.sin(th) * rr * 0.85;
              i ? wctx.lineTo(x, y) : wctx.moveTo(x, y);
            }
            wctx.closePath();
          }

          (function waveLoop(ts){
            var w = wcvs.clientWidth, h = wcvs.clientHeight;
            wctx.clearRect(0, 0, w, h);
            wt += 0.011 + energy * 0.007;   /* unhurried but alive */
            energy *= 0.965;
            var cx = w * 0.52;
            var cy = h * 0.55 + Math.sin(wt * (Math.PI * 2 / 3.4)) * 12;

            // the water body: blurred sloshing layers
            for(var li = 0; li < POOL.length; li++){
              var L = POOL[li];
              var base = Math.min(w, h) * L.R * (1 + energy * 0.10);
              wctx.filter = 'blur(' + L.blur + 'px)';
              blobPath(cx, cy, base, L.amp + energy * 0.06, L.sp, li * 1.7);
              wctx.fillStyle = L.color;
              wctx.fill();
            }
            wctx.filter = 'none';

            // surface ripples: present but unhurried
            if(ts - lastSpawn > 1800 - Math.min(1200, energy * 750)){
              rings.push({r: Math.min(w,h) * 0.20, a: 0.32 + energy * 0.12, hue: rings.length % 2});
              lastSpawn = ts;
            }
            for(var k = 0; k < rings.length; k++){
              var g = rings[k];
              g.r += 0.9 + energy * 2.4;
              g.a *= 0.987;
              var A = 3 + energy * 8;
              wctx.beginPath();
              for(var i = 0; i <= 72; i++){
                var th = i / 72 * Math.PI * 2;
                var rr = g.r + Math.sin(th * 5 + wt * 2 + g.r * 0.02) * A;
                var x = cx + Math.cos(th) * rr;
                var y = cy + Math.sin(th) * rr * 0.85;
                i ? wctx.lineTo(x, y) : wctx.moveTo(x, y);
              }
              wctx.closePath();
              wctx.strokeStyle = g.hue === 1
                ? 'rgba(255,255,255,' + (g.a * 0.7).toFixed(3) + ')'
                : 'rgba(30,82,160,' + (g.a * 0.45).toFixed(3) + ')';
              wctx.lineWidth = 2;
              wctx.stroke();
            }
            rings = rings.filter(function(g){ return g.a > 0.02 && g.r < Math.max(w, h) * 0.75; });
            requestAnimationFrame(waveLoop);
          })(0);
        }

        // ---- Cinematic opening: the pouch owns the stage ----
        // Model starts centered on an empty page; the first scroll intent sends
        // it gliding to its place while the whole hero wakes around it.
        var INTRO = !REDUCED && window.innerWidth > 900;
        if(INTRO){
          window.__introPending = true;
          var grid = document.createElement('div');           // blueprint stage behind the pouch
          grid.className = 'intro-grid';
          document.body.appendChild(grid);
          var headerEl = document.querySelector('header');
          var mrect = mv.getBoundingClientRect();
          var dx = (window.innerWidth / 2) - (mrect.left + mrect.width / 2);
          gsap.set(mv, {x: dx, scale: 1.08, rotation: -7, transformOrigin: '50% 50%'});  // jaunty art-directed lean
          gsap.set([headerEl, '.hero-glow', '.hero-waves'], {autoAlpha: 0});
          var released = false;
          // hard scroll lock: swallow EVERY tick of the gesture, not just the first
          function blockScroll(e){
            if(e.type === 'keydown'){
              var k = e.keyCode;
              if(k===32||k===33||k===34||k===35||k===36||k===37||k===38||k===39||k===40) e.preventDefault();
              return;
            }
            if(e.cancelable) e.preventDefault();
          }
          function unlockScroll(){
            ['wheel','touchmove','keydown'].forEach(function(ev){ window.removeEventListener(ev, blockScroll); });
            document.documentElement.style.overflow = '';
            if(window.scrollY !== 0) window.scrollTo({top: 0});
            if(window.__introLenis) window.__introLenis.start();
          }
          ['wheel','touchmove','keydown'].forEach(function(ev){ window.addEventListener(ev, blockScroll, {passive:false}); });
          document.documentElement.style.overflow = 'hidden';   // also stops scrollbar drags
          function onIntent(){ window.__introRelease(false); }
          window.__introRelease = function(instant){
            if(released) return; released = true;
            window.__introPending = false;
            ['wheel','touchmove','keydown','pointerdown'].forEach(function(ev){
              window.removeEventListener(ev, onIntent);
            });
            var hero = document.querySelector('.hero');
            if(instant){
              unlockScroll();
              gsap.set(mv, {x: 0, scale: 1, rotation: 0});
              gsap.set([headerEl, '.hero-glow', '.hero-waves'], {autoAlpha: 1});
              grid.remove();
              return;
            }
            var tl = gsap.timeline();
            tl.to(grid, {autoAlpha: 0, scale: 1.06, duration: 0.9, ease: 'power2.inOut',
                  onComplete: function(){ grid.remove(); }}, 0)
              .to(mv, {x: 0, scale: 1, rotation: 0, duration: 1.4, ease: 'power3.inOut'}, 0)
              .to(headerEl, {autoAlpha: 1, duration: 0.8, ease: 'power2.out'}, 0.25)
              .to(['.hero-glow', '.hero-waves'], {autoAlpha: 1, duration: 1.1, ease: 'power2.out'}, 0.45)
              .add(function(){ if(hero) revealSection(hero); }, 0.35)
              .add(unlockScroll, 1.7);
          };
          ['wheel','touchmove','keydown','pointerdown'].forEach(function(ev){
            window.addEventListener(ev, onIntent, {passive: false});
          });
        }

        // entrance: displace the current state — the lerp glides it home like a dolly move
        mv.addEventListener('load', function(){
          cam.r = 145; cam.yaw = -95; cam.pitch = 70;
          // surface detail now lives in the baked normal + roughness textures
        });
      }
    }

    /* ---- Lenis smooth scroll, synced to GSAP ---- */
    if(window.Lenis){
      var lenis = new Lenis({duration:1.2, easing:function(t){return Math.min(1,1.001-Math.pow(2,-10*t));}, smoothWheel:true});
      if(window.__introPending){ lenis.stop(); window.__introLenis = lenis; }   // scroll is frozen until the intro releases
      lenis.on('scroll', function(e){
        if(hasGSAP) ScrollTrigger.update();
        // velocity-reactive marquee: flip + speed with scroll
        var v = e.velocity || 0;
        if(window.__mvKick) window.__mvKick(v);     // 3D model inertia
        if(window.__waveKick) window.__waveKick(v); // water ripple energy
        marquees.forEach(function(m){
          var ts = (v>=0?1:-1) * Math.min(1 + Math.abs(v)*0.06, 6);
          gsap.to(m.tween, {timeScale:ts, duration:0.1, overwrite:true, onComplete:function(){
            gsap.to(m.tween, {timeScale:m.base, duration:0.5});
          }});
          // velocity skew: tracks lean into fast scrolls, then settle upright
          var sk = Math.max(-8, Math.min(8, v * 0.45));
          gsap.to(m.inner, {skewX:-sk, duration:0.2, overwrite:'auto', onComplete:function(){
            gsap.to(m.inner, {skewX:0, duration:0.6, ease:'power3.out'});
          }});
        });
      });
      function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
      // anchor links through Lenis
      document.querySelectorAll('a[href^="#"]').forEach(function(a){
        a.addEventListener('click', function(e){
          var id = a.getAttribute('href'); if(id.length<2) return;
          var target = document.querySelector(id); if(!target) return;
          e.preventDefault(); lenis.scrollTo(target, {offset:-70});
        });
      });
    }
  }

  /* ---------- Preloader intro (multi-stage GSAP timeline) ---------- */
  function runPreloader(){
    var pre = document.getElementById('preloader');
    var icon = document.getElementById('preIcon');
    var label = document.getElementById('preLabel');
    if(!pre){ playHero(); return; }               // inner pages ship without a preloader
    if(!hasGSAP){ pre.style.display='none'; playHero(); boot(); return; }

    var tl = gsap.timeline({onComplete:function(){ pre.style.display='none'; }});
    gsap.set(icon, {scale:0, transformOrigin:'bottom'});
    gsap.set(label, {y:90, autoAlpha:0});
    // pulse the icon while it holds
    var pulse = gsap.to(icon, {scale:1.12, duration:0.6, ease:'power1.inOut', yoyo:true, repeat:-1, paused:true});
    tl.to(icon, {scale:1, duration:1.0, ease:'power2.inOut'}, 0)
      .to(label, {y:0, autoAlpha:1, duration:1.0, ease:'power2.inOut'}, 0.1)
      .add(function(){ pulse.play(); }, 1.0)
      .to({}, {duration:0.7})                                  // hold
      .add(function(){ pulse.pause(); }, '>')
      .add(playHero, '+=0')                                    // start hero as loader exits
      .to([icon,label], {y:-120, autoAlpha:0, duration:1.0, ease:'power3.inOut', stagger:0.05}, '<')
      .to(pre, {autoAlpha:0, duration:0.6, ease:'power2.inOut'}, '<0.2');

    // Safety net: setTimeout still fires when rAF is throttled (e.g. page opened
    // in a background tab, where requestAnimationFrame is paused). If the intro
    // hasn't finished, the animated timelines can't advance — so force every
    // reveal to its END state synchronously with gsap.set (no rAF needed) so
    // content is never left hidden behind a frozen preloader.
    setTimeout(function(){
      if(pre && getComputedStyle(pre).display !== 'none' && tl.progress() < 1){
        pre.style.display = 'none';
        if(window.__introRelease) window.__introRelease(true);
        forceRevealAll();
      }
    }, 4500);
  }

  /* ---------- Force every reveal to its end-state (rAF-independent) ---------- */
  function forceRevealAll(){
    if(!hasGSAP) return;
    gsap.set('[data-media]', {clipPath:'inset(0% 0% 0% 0%)'});
    gsap.set('.media-inner', {scale:1});
    document.querySelectorAll('[data-split]').forEach(function(el){ if(el._words) gsap.set(el._words, {yPercent:0}); });
    gsap.set('[data-rise]', {y:0, autoAlpha:1, scale:1});
    gsap.set('.sol-divider', {scaleX:1});
  }

  /* ---------- Hero load timeline ---------- */
  function playHero(){
    if(window.__introPending) return;        // cinematic intro owns the hero reveal
    var hero = document.querySelector('.hero');
    if(!hero || !hasGSAP) return;
    revealSection(hero);
  }

  window.addEventListener('load', function(){ boot(); runPreloader(); });
  // Fallback: if 'load' is slow, still boot after a moment
  setTimeout(function(){ if(!window._ppBooted){ window._ppBooted=true; } }, 100);
})();
