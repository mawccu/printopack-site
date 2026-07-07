/*! Printopack live-content layer — hydrates CMS-managed content from the live API.
    Baked HTML renders instantly (SEO + speed); this refreshes it with current data,
    so anything edited in the Printopack System dashboard appears without a redeploy. */
(function(){
  var API = 'https://api.printopack.com.sa';
  var LANG = 'en';
  try{ LANG = localStorage.getItem('pp-lang') || 'en'; }catch(e){}

  function j(path){
    return fetch(API + '/api' + path, {
      headers: {'Accept': 'application/json', 'Accept-Language': LANG}
    }).then(function(r){ return r.json(); });
  }
  function abs(p){ return p && p.charAt(0) === '/' ? API + p : p; }
  function esc(s){
    var d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML;
  }
  function cleanName(n){
    return String(n || '')
      .replace(/\s*=\s*السكر\s*/, '')
      .replace('Bags)Pet Foods)', 'Pet Food Bags');
  }

  /* ---- footer contact (every page) ---- */
  j('/footer_information').then(function(d){
    var f = (((d || {}).data || {}).footer || [])[0];
    if(!f) return;
    var map = {phone: f.phone, fax: f.fax, email: f.email, hours: f.office_hours, address: f.address};
    Object.keys(map).forEach(function(k){
      if(!map[k]) return;
      document.querySelectorAll('[data-live="' + k + '"]').forEach(function(el){ el.textContent = map[k]; });
    });
    document.querySelectorAll('a[data-live-href="tel"]').forEach(function(a){
      if(f.phone) a.setAttribute('href', 'tel:' + String(f.phone).replace(/\s/g, ''));
    });
    document.querySelectorAll('a[data-live-href="mailto"]').forEach(function(a){
      if(f.email) a.setAttribute('href', 'mailto:' + f.email);
    });
  }).catch(function(){});

  /* ---- categories grid (products page) ---- */
  var cg = document.querySelector('.cat-grid');
  if(cg){
    j('/categories?per_page=40').then(function(d){
      var items = (((d || {}).data || {}).data || []).filter(function(c){ return c.is_active; });
      if(!items.length) return;
      items.sort(function(a, b){ return (a.category_sort || 99) - (b.category_sort || 99); });
      var enq = LANG === 'ar' ? 'عرض ←' : 'View →';
      cg.innerHTML = items.map(function(c){
        var nm = cleanName(c.category_name);
        var href = 'product.html?cat=' + encodeURIComponent(nm) + '&img=' + encodeURIComponent(abs(c.category_image));
        return '<a class="cat-card" href="' + href + '">' +
          '<span class="ci"><img src="' + abs(c.category_image) + '" alt="' + esc(nm) + '" loading="lazy"></span>' +
          '<h3>' + esc(nm) + '</h3><span>' + enq + '</span></a>';
      }).join('');
    }).catch(function(){});
  }

  /* ---- news grid ---- */
  var ng = document.querySelector('.news-grid');
  if(ng){
    j('/blogs?per_page=30').then(function(d){
      var items = ((((d || {}).data || {}).blogs || {}).data) || [];
      if(!items.length) return;
      var known = window.__staticNews || [];
      ng.innerHTML = items.map(function(b){
        var href = known.indexOf(b.id) > -1 ? ('news-' + b.id + '.html') : ('article.html?id=' + b.id);
        var img = b.blog_image
          ? '<div class="nc-img"><img src="' + abs(b.blog_image) + '" alt="" loading="lazy"></div>' : '';
        return '<a class="news-card" href="' + href + '">' + img + '<div class="nc-body">' +
          '<span class="nc-cat">' + esc(b.blog_category_name || 'News') + '</span>' +
          '<h3>' + esc(b.blog_title) + '</h3><time>' + String(b.created_at || '').slice(0, 10) + '</time></div></a>';
      }).join('');
    }).catch(function(){});
  }

  /* ---- gallery grid (lightbox is event-delegated, so hydration keeps working) ---- */
  var gg = document.querySelector('.gal-grid');
  if(gg){
    j('/gallery_items').then(function(d){
      var items = (((d || {}).data || {}).data || []).filter(function(g){ return g.is_active; });
      if(!items.length) return;
      gg.innerHTML = items.map(function(g){
        var src = abs(g.gallery_item_image);
        return '<figure class="gal-item" data-full="' + src + '">' +
          '<img src="' + src + '" alt="' + esc(g.gallery_item_name) + '" loading="lazy">' +
          '<figcaption>' + esc(g.gallery_item_name) + '</figcaption></figure>';
      }).join('');
    }).catch(function(){});
  }

  /* ---- clients marquee (home) ---- */
  var cm = document.querySelector('.clients .marquee-inner');
  if(cm){
    j('/our_clients?per_page=60').then(function(d){
      var items = (((d || {}).data || {}).data || []).filter(function(c){ return c.is_active; });
      if(items.length < 4) return;
      var html = items.map(function(c){
        return '<span class="client-logo"><img src="' + abs(c.client_image) + '" alt="Client logo"></span>';
      }).join('');
      var apply = function(){
        if(window.__refreshMarquee) window.__refreshMarquee(cm.closest('.marquee'), html);
      };
      window.__refreshMarquee ? apply() : window.addEventListener('load', apply);
    }).catch(function(){});
  }

  /* ---- dynamic article viewer (article.html?id=N) ---- */
  var artBody = document.getElementById('artBody');
  if(artBody){
    var id = new URLSearchParams(location.search).get('id');
    if(!id){ location.href = 'news.html'; return; }
    j('/blog?blog_id=' + encodeURIComponent(id)).then(function(d){
      var b = (((d || {}).data || {}).blog) || null;
      if(!b){ artBody.innerHTML = '<p>Article not found.</p>'; return; }
      document.title = (b.blog_title || 'Article') + ' — Printopack News';
      var t = document.getElementById('artTitle');
      if(t) t.textContent = b.blog_title || '';
      var k = document.getElementById('artKicker');
      if(k) k.textContent = (b.blog_category_name || 'News') + (b.created_at ? ' · ' + String(b.created_at).slice(0, 10) : '');
      if(b.blog_image){
        var wrap = document.getElementById('artImg');
        if(wrap){ wrap.style.display = ''; wrap.querySelector('img').src = abs(b.blog_image); }
      }
      artBody.innerHTML = String(b.blog_text || '').replace(/src="\/images\//g, 'src="' + API + '/images/');
    }).catch(function(){ artBody.innerHTML = '<p>Could not load this article right now.</p>'; });
  }
})();
