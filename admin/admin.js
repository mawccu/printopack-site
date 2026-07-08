/* Printopack System — Admin dashboard.
   Self-service CMS: news (LinkedIn-assisted import), careers, team, events,
   products and site content. Data persists in the browser for this build;
   in production the same read/write layer points at api.printopack.com.sa. */
(function(){
"use strict";

/* ---------------- helpers ---------------- */
var $  = function(s,c){ return (c||document).querySelector(s); };
var root = document.getElementById('root');
function esc(s){ var d=document.createElement('div'); d.textContent=s==null?'':String(s); return d.innerHTML; }
function uid(){ return 'x'+Date.now().toString(36)+Math.random().toString(36).slice(2,6); }
function today(){ return new Date().toISOString().slice(0,10); }
function fmtDate(d){ if(!d) return ''; var p=new Date(d); if(isNaN(p)) return d; return p.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}); }
function toast(msg,type){ var t=$('#toast'); $('#toastText').textContent=msg; t.className='toast show '+(type||''); clearTimeout(toast._t); toast._t=setTimeout(function(){t.className='toast';},2600); }

var ICON = {
  dash:'<path d="M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z"/>',
  news:'<path d="M4 4h16v16H4z"/><path d="M8 9h8M8 13h8M8 17h5"/>',
  careers:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  team:'<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><circle cx="17.5" cy="8.5" r="2.6"/><path d="M15.5 14.4c2.6.3 4.5 2.2 4.5 5"/>',
  events:'<rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v3M16 3v3"/>',
  products:'<path d="M3 8l9-5 9 5-9 5-9-5z"/><path d="M3 8v8l9 5 9-5V8"/>',
  pages:'<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5"/>',
  settings:'<circle cx="12" cy="12" r="3.2"/><path d="M19 12a7 7 0 0 0-.1-1.3l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2.2-1.3L14 2h-4l-.4 2.1a7 7 0 0 0-2.2 1.3l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .9.1 1.3l-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 2.2 1.3L10 22h4l.4-2.1a7 7 0 0 0 2.2-1.3l2.3.9 2-3.4-2-1.5c.1-.4.1-.9.1-1.3z"/>',
  edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  trash:'<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/>',
  eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
  image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.8"/><path d="M21 15l-5-5L5 21"/>',
  link:'<path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>'
};
function svg(name){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+ICON[name]+'</svg>'; }

/* ---------------- data layer ---------------- */
var KEY='pp_admin_db_v1';
var SEED = {
  news:[
    {id:uid(),title:"Printopack renews ISO 22000 food-safety certification",titleAr:"برينتوباك تجدّد شهادة الأيزو 22000 لسلامة الغذاء",category:"Certifications",date:"2026-05-30",image:"",body:"Following a full external audit, Printopack has renewed its ISO 22000 certification for food-contact packaging.",bodyAr:"عقب تدقيق خارجي شامل، جدّدت برينتوباك شهادة الأيزو 22000 للتغليف الملامس للأغذية.",status:"published"},
    {id:uid(),title:"New recyclable mono-material film range",titleAr:"تشكيلة جديدة من الأفلام أحادية المادة القابلة للتدوير",category:"Sustainability",date:"2026-06-18",image:"",body:"A new generation of fully recyclable mono-material laminates, keeping the same barrier performance.",bodyAr:"جيل جديد من الرقائق أحادية المادة القابلة للتدوير مع الحفاظ على أداء الحاجز نفسه.",status:"published"},
    {id:uid(),title:"Meet Printopack at Gulfood Manufacturing 2026",titleAr:"لقاؤنا بكم في معرض جلفود للتصنيع 2026",category:"Events",date:"2026-07-02",image:"",body:"Our team will be exhibiting our latest printed pouches and high-barrier structures.",bodyAr:"سيستعرض فريقنا أحدث الأكياس المطبوعة والهياكل عالية الحاجز.",status:"draft"}
  ],
  careers:[
    {id:uid(),title:"Production Engineer",dept:"Production",type:"Full-time",location:"Jeddah, KSA",summary:"Oversee rotogravure production lines and drive continuous improvement across shifts.",status:"published"},
    {id:uid(),title:"Quality Control Specialist",dept:"Quality",type:"Full-time",location:"Jeddah, KSA",summary:"Ensure every run meets ISO, FSSC and SFDA standards through in-line and lab testing.",status:"published"},
    {id:uid(),title:"Sales Account Manager",dept:"Sales",type:"Full-time",location:"Jeddah, KSA",summary:"Grow relationships with food and beverage brands across the region.",status:"draft"}
  ],
  team:[
    {id:uid(),name:"Khalid Al-Amoudi",role:"General Manager",email:"k.amoudi@printopack.com.sa",photo:"",bio:"Leading Printopack's operations across the region for over a decade."},
    {id:uid(),name:"Rana Saleh",role:"Head of Quality",email:"r.saleh@printopack.com.sa",photo:"",bio:"Owns our certification programme and lab standards."},
    {id:uid(),name:"Omar Haddad",role:"Production Director",email:"o.haddad@printopack.com.sa",photo:"",bio:"Runs the Jeddah plant floor and the engraving studio."}
  ],
  events:[
    {id:uid(),title:"Gulfood Manufacturing 2026",date:"2026-07-14",location:"Dubai World Trade Centre",description:"Visit our stand for printed pouches, high-barrier films and custom packaging."},
    {id:uid(),title:"Saudi Plastics & Petrochem",date:"2026-07-22",location:"Riyadh Front Expo",description:"Meet the Printopack engineering team and see live samples."},
    {id:uid(),title:"Sustainability Open Day",date:"2026-07-30",location:"Printopack HQ, Jeddah",description:"A morning on recyclable structures and down-gauged films for our partners."}
  ],
  products:[
    {id:uid(),name:"Chocolates",image:"../assets/categories/cat01.png",active:true,sort:1},
    {id:uid(),name:"Chips & Snacks",image:"../assets/categories/cat00.png",active:true,sort:2},
    {id:uid(),name:"Bakery Products",image:"../assets/categories/cat02.png",active:true,sort:3},
    {id:uid(),name:"Coffee & Tea",image:"../assets/categories/cat15.png",active:true,sort:4},
    {id:uid(),name:"Ice Cream",image:"../assets/categories/cat07.png",active:false,sort:5}
  ],
  pages:{
    heroTitle:"Packaging that performs.",
    heroSub:"Flexible packaging, printed and finished in Jeddah for brands across 26+ countries.",
    aboutTitle:"Pioneers in flexible packaging since 1997",
    aboutBody:"Printopack is a Saudi modern packaging factory delivering high-barrier films, printed pouches and labels to the region's leading food and beverage brands.",
    ctaTitle:"Set the standard for packaging in your industry.",
    statYears:"27",statCountries:"26",statCategories:"20"
  },
  settings:{
    companyName:"Printopack — Saudi Modern Packaging Factory Co. Ltd.",
    phone:"+966 12 608 1074", fax:"+966 12 608 1082", email:"info@printopack.com.sa",
    hours:"9:00 AM to 5:00 PM", address:"Industrial Area 5, Unit 10, 8508, Jeddah 22428, Saudi Arabia"
  }
};
function db(){ try{ return JSON.parse(localStorage.getItem(KEY)) || null; }catch(e){ return null; } }
function saveDB(d){ localStorage.setItem(KEY, JSON.stringify(d)); }
function ensure(){ if(!db()) saveDB(SEED); }
function coll(k){ return (db()||{})[k] || []; }
function setColl(k,arr){ var d=db()||{}; d[k]=arr; saveDB(d); }
function obj(k){ return (db()||{})[k] || {}; }
function setObj(k,o){ var d=db()||{}; d[k]=o; saveDB(d); }

/* ---------------- models (schema-driven CRUD) ---------------- */
var MODELS = {
  news:{ label:"News", singular:"Post", icon:"news", hasImport:true,
    columns:[
      {type:"thumb",field:"image"},
      {type:"title",field:"title",sub:"category"},
      {type:"pill",field:"status"},
      {type:"date",field:"date"}
    ],
    fields:[
      {name:"image",type:"image",label:"Cover image"},
      {name:"category",type:"select",label:"Category",half:true,options:["Company News","Sustainability","Certifications","Events","Products"]},
      {name:"date",type:"date",label:"Date",half:true},
      {name:"status",type:"select",label:"Status",half:true,options:["draft","published"]},
      {name:"title",type:"text",label:"Title (English)"},
      {name:"body",type:"textarea",label:"Body (English)"},
      {name:"titleAr",type:"text",label:"Title","ar":"Arabic",rtl:true},
      {name:"bodyAr",type:"textarea",label:"Body","ar":"Arabic — review before publishing",rtl:true}
    ]},
  careers:{ label:"Careers", singular:"Job", icon:"careers",
    columns:[
      {type:"title",field:"title",sub:"dept"},
      {type:"text",field:"type"},
      {type:"text",field:"location"},
      {type:"pill",field:"status"}
    ],
    fields:[
      {name:"title",type:"text",label:"Job title"},
      {name:"dept",type:"select",label:"Department",half:true,options:["Production","Quality","Sales","Engineering","Admin","Logistics"]},
      {name:"type",type:"select",label:"Type",half:true,options:["Full-time","Part-time","Contract","Internship"]},
      {name:"location",type:"text",label:"Location",half:true},
      {name:"status",type:"select",label:"Status",half:true,options:["draft","published"]},
      {name:"summary",type:"textarea",label:"Description"}
    ]},
  team:{ label:"Team", singular:"Member", icon:"team",
    columns:[
      {type:"thumb",field:"photo",round:true},
      {type:"title",field:"name",sub:"role"},
      {type:"text",field:"email"}
    ],
    fields:[
      {name:"photo",type:"image",label:"Photo"},
      {name:"name",type:"text",label:"Full name",half:true},
      {name:"role",type:"text",label:"Role / title",half:true},
      {name:"email",type:"text",label:"Email"},
      {name:"bio",type:"textarea",label:"Short bio"}
    ]},
  events:{ label:"Events", singular:"Event", icon:"events", hasCalendar:true,
    columns:[
      {type:"title",field:"title",sub:"location"},
      {type:"date",field:"date"}
    ],
    fields:[
      {name:"title",type:"text",label:"Event name"},
      {name:"date",type:"date",label:"Date",half:true},
      {name:"location",type:"text",label:"Location",half:true},
      {name:"description",type:"textarea",label:"Description"}
    ]},
  products:{ label:"Products", singular:"Category", icon:"products",
    columns:[
      {type:"thumb",field:"image"},
      {type:"title",field:"name"},
      {type:"active",field:"active"},
      {type:"text",field:"sort",prefix:"#"}
    ],
    fields:[
      {name:"image",type:"image",label:"Category image"},
      {name:"name",type:"text",label:"Category name",half:true},
      {name:"sort",type:"text",label:"Sort order",half:true},
      {name:"active",type:"select",label:"Visible on site",options:["true","false"]}
    ]}
};

/* ---------------- auth ---------------- */
var SKEY='pp_admin_session';
function loggedIn(){ return localStorage.getItem(SKEY)==='1'; }
function login(){ localStorage.setItem(SKEY,'1'); }
function logout(){ localStorage.removeItem(SKEY); render(); }

function renderLogin(){
  root.innerHTML =
  '<div class="login"><form class="login-card" id="loginForm">'+
    '<div class="login-brand"><span class="dot"></span><b>Printopack</b><span style="color:#6b6a63">System</span></div>'+
    '<p class="login-sub">Content management portal</p>'+
    '<h1>Sign in</h1>'+
    '<div class="field"><label>Email</label><input type="email" value="creative@printopack.com.sa" required></div>'+
    '<div class="field"><label>Password</label><input type="password" value="demo" required></div>'+
    '<button class="btn btn-primary" style="width:100%;justify-content:center;padding:13px" type="submit">Sign in</button>'+
    '<p class="login-note">You are signing in to the Printopack content dashboard.</p>'+
  '</form></div>';
  $('#loginForm').addEventListener('submit',function(e){ e.preventDefault(); login(); render(); });
}

/* ---------------- app shell ---------------- */
var view='dashboard';
var NAV=[
  {k:'dashboard',label:'Dashboard',icon:'dash'},
  {grp:'Content'},
  {k:'news',label:'News',icon:'news'},
  {k:'careers',label:'Careers',icon:'careers'},
  {k:'team',label:'Our Team',icon:'team'},
  {k:'events',label:'Events',icon:'events'},
  {k:'products',label:'Products',icon:'products'},
  {grp:'Site'},
  {k:'pages',label:'Page Content',icon:'pages'},
  {k:'settings',label:'Settings',icon:'settings'}
];
function sidebar(){
  var items=NAV.map(function(n){
    if(n.grp) return '<div class="sb-group">'+n.grp+'</div>';
    var badge = MODELS[n.k] ? '<span class="badge">'+coll(n.k).length+'</span>' : '';
    return '<div class="sb-item'+(view===n.k?' on':'')+'" data-nav="'+n.k+'">'+svg(n.icon)+'<span>'+n.label+'</span>'+badge+'</div>';
  }).join('');
  return '<aside class="sidebar">'+
    '<div class="sb-brand"><span class="dot"></span><div><b>Printopack</b><span>System · Admin</span></div></div>'+
    '<nav class="sb-nav">'+items+'</nav>'+
    '<div class="sb-foot"><div class="sb-user"><div class="av">CM</div><div><div class="nm">Creative Manager</div><div class="rl">creative@printopack.com.sa</div></div></div>'+
    '<button class="sb-logout" data-logout>'+svg('logout')+'Sign out</button></div>'+
  '</aside>';
}
function topbar(title,crumb,actions){
  return '<div class="topbar"><div><div class="crumb">'+esc(crumb||'Printopack System')+'</div><h1>'+esc(title)+'</h1></div><div class="topbar-actions">'+(actions||'')+'</div></div>';
}
function render(){
  ensure();
  if(!loggedIn()){ renderLogin(); return; }
  root.innerHTML='<div class="app" id="app">'+sidebar()+'<main class="main" id="main"></main></div>';
  renderView();
  root.querySelectorAll('[data-nav]').forEach(function(el){ el.addEventListener('click',function(){ view=el.getAttribute('data-nav'); render(); }); });
  var lo=root.querySelector('[data-logout]'); if(lo) lo.addEventListener('click',logout);
}
function renderView(){
  var m=$('#main');
  if(view==='dashboard') return dashboardView(m);
  if(view==='pages') return pagesView(m);
  if(view==='settings') return settingsView(m);
  if(MODELS[view]) return listView(m,view);
}

/* ---------------- dashboard ---------------- */
function dashboardView(m){
  var cards=[
    {k:'news',l:'News posts',n:coll('news').length,icon:'news'},
    {k:'careers',l:'Open roles',n:coll('careers').filter(function(x){return x.status==='published';}).length,icon:'careers'},
    {k:'team',l:'Team members',n:coll('team').length,icon:'team'},
    {k:'events',l:'Upcoming events',n:coll('events').length,icon:'events'}
  ].map(function(c){
    return '<div class="stat-card" data-nav="'+c.k+'" style="cursor:pointer"><div class="ic">'+svg(c.icon)+'</div><div class="n">'+c.n+'</div><div class="l">'+c.l+'</div></div>';
  }).join('');
  var recent=coll('news').slice(0,4).map(function(p){
    return '<tr class="row" data-open="news:'+p.id+'"><td><span class="t-title">'+esc(p.title)+'</span></td><td><span class="pill cat">'+esc(p.category)+'</span></td><td>'+statusPill(p.status)+'</td><td>'+fmtDate(p.date)+'</td></tr>';
  }).join('');
  m.innerHTML=topbar('Welcome back','Dashboard',
      '<button class="btn btn-amber" data-open="news:new">'+svg('plus')+'New post</button>')+
    '<div class="view">'+
    '<div class="stat-grid">'+cards+'</div>'+
    '<div class="panel"><div class="panel-head"><div><h2>Recent news</h2></div><button class="btn btn-ghost btn-sm" data-nav="news">View all</button></div>'+
    '<table class="tbl"><thead><tr><th>Title</th><th>Category</th><th>Status</th><th>Date</th></tr></thead><tbody>'+(recent||'')+'</tbody></table></div>'+
    '<div class="panel"><div class="panel-head"><div><h2>Quick actions</h2><p>Jump straight into the things you update most.</p></div></div><div class="panel-body" style="display:flex;gap:10px;flex-wrap:wrap">'+
      '<button class="btn btn-ghost" data-open="careers:new">'+svg('plus')+'Post a job</button>'+
      '<button class="btn btn-ghost" data-open="team:new">'+svg('plus')+'Add team member</button>'+
      '<button class="btn btn-ghost" data-open="events:new">'+svg('plus')+'Add event</button>'+
      '<button class="btn btn-ghost" data-nav="pages">'+svg('edit')+'Edit home page</button>'+
    '</div></div></div>';
  bindCommon(m);
}

/* ---------------- generic list view ---------------- */
function statusPill(s){ return s==='published' ? '<span class="pill pub">Published</span>' : '<span class="pill draft">Draft</span>'; }
function cellFor(col,row){
  var v=row[col.field];
  if(col.type==='thumb'){ var st=col.round?'border-radius:50%':''; return v?'<img class="thumb" style="'+st+'" src="'+esc(v)+'">':'<div class="thumb" style="'+st+'"></div>'; }
  if(col.type==='title'){ var sub=col.sub&&row[col.sub]?'<div class="t-sub">'+esc(row[col.sub])+'</div>':''; return '<div class="t-title">'+esc(v||'Untitled')+'</div>'+sub; }
  if(col.type==='pill') return statusPill(v);
  if(col.type==='active') return v ? '<span class="pill pub">Visible</span>' : '<span class="pill off">Hidden</span>';
  if(col.type==='date') return fmtDate(v);
  if(col.type==='text') return esc((col.prefix||'')+(v==null?'':v));
  return esc(v);
}
function listView(m,key){
  var mdl=MODELS[key], rows=coll(key);
  var heads=mdl.columns.map(function(c){ return '<th>'+ (c.type==='thumb'?'':esc(c.field.charAt(0).toUpperCase()+c.field.slice(1))) +'</th>'; }).join('')+'<th></th>';
  var actions='<button class="btn btn-amber" data-open="'+key+':new">'+svg('plus')+'New '+mdl.singular.toLowerCase()+'</button>';
  var toggle = mdl.hasCalendar ? '<div class="seg" id="evtToggle"><button class="on" data-mode="list">List</button><button data-mode="cal">Calendar</button></div>' : '';
  m.innerHTML=topbar(mdl.label, 'Content · '+mdl.label, actions)+
    '<div class="view">'+
    '<div class="toolbar"><div class="search">'+svg('search')+'<input id="q" placeholder="Search '+mdl.label.toLowerCase()+'…"></div>'+toggle+'</div>'+
    '<div id="listHost"></div></div>';
  function paint(filter){
    var list=rows.filter(function(r){ if(!filter) return true; return JSON.stringify(r).toLowerCase().indexOf(filter.toLowerCase())>-1; });
    if(!list.length){ $('#listHost').innerHTML='<div class="panel"><div class="empty">'+svg(mdl.icon)+'<h3>Nothing here yet</h3><p>Create your first '+mdl.singular.toLowerCase()+' with the button above.</p></div></div>'; return; }
    var body=list.map(function(r){
      var tds=mdl.columns.map(function(c){ return '<td>'+cellFor(c,r)+'</td>'; }).join('');
      return '<tr class="row" data-open="'+key+':'+r.id+'">'+tds+'<td><div class="cell-actions">'+
        '<button class="icon-btn" data-open="'+key+':'+r.id+'" title="Edit">'+svg('edit')+'</button>'+
        '<button class="icon-btn del" data-del="'+key+':'+r.id+'" title="Delete">'+svg('trash')+'</button></div></td></tr>';
    }).join('');
    $('#listHost').innerHTML='<div class="panel"><table class="tbl"><thead><tr>'+heads+'</tr></thead><tbody>'+body+'</tbody></table></div>';
    bindCommon($('#listHost'));
  }
  paint('');
  $('#q').addEventListener('input',function(){ paint(this.value); });
  if(mdl.hasCalendar){
    var seg=$('#evtToggle');
    seg.querySelectorAll('button').forEach(function(b){ b.addEventListener('click',function(){
      seg.querySelectorAll('button').forEach(function(x){x.classList.remove('on');}); b.classList.add('on');
      if(b.dataset.mode==='cal'){ renderCalendar($('#listHost')); } else { paint($('#q').value); }
    }); });
  }
}

/* ---------------- form drawer ---------------- */
var draft={};
function fieldHTML(f,val){
  var lab='<label>'+esc(f.label)+(f.ar?' <span class="ar">· '+esc(f.ar)+'</span>':'')+'</label>';
  var rtl=f.rtl?' dir="rtl"':'';
  if(f.type==='image'){
    var has=val?' has':'';
    return '<div class="field full"><label>'+esc(f.label)+'</label><div class="imgpick'+has+'" data-imgpick="'+f.name+'"><img src="'+esc(val||'')+'"><div class="ph">'+svg('image')+'Click to upload an image</div></div><input type="file" accept="image/*" data-imgfile="'+f.name+'" hidden></div>';
  }
  if(f.type==='textarea') return '<div class="field full">'+lab+'<textarea data-f="'+f.name+'"'+rtl+'>'+esc(val||'')+'</textarea></div>';
  if(f.type==='select'){
    var opts=f.options.map(function(o){ return '<option'+(String(val)===String(o)?' selected':'')+'>'+esc(o)+'</option>'; }).join('');
    return '<div class="field'+(f.half?'':' full')+'">'+lab+'<select data-f="'+f.name+'">'+opts+'</select></div>';
  }
  var t=f.type==='date'?'date':'text';
  return '<div class="field'+(f.half?'':' full')+'">'+lab+'<input type="'+t+'" data-f="'+f.name+'"'+rtl+' value="'+esc(val||'')+'"></div>';
}
function openForm(key,id){
  var mdl=MODELS[key];
  var rec = id==='new' ? {} : coll(key).find(function(x){return x.id===id;}) || {};
  draft=JSON.parse(JSON.stringify(rec));
  if(id==='new' && mdl.fields.some(function(f){return f.name==='date';}) && !draft.date) draft.date=today();
  if(id==='new' && mdl.fields.some(function(f){return f.name==='status';}) && !draft.status) draft.status='draft';

  var imp = mdl.hasImport ? '<div class="li-import"><label style="font-size:12px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:#6b6a63;display:block;margin-bottom:8px">'+svg('link')+' Import from a LinkedIn post</label><div class="li-row"><input id="liUrl" placeholder="Paste a LinkedIn post link…"><button class="btn btn-primary" id="liBtn" type="button">Import</button></div><div class="li-status" id="liStatus"><span class="spin"></span><span class="check">✓</span><span id="liText"></span></div></div>' : '';

  var body='<div class="form-grid">'+mdl.fields.map(function(f){ return fieldHTML(f,draft[f.name]); }).join('')+'</div>';
  var host=document.createElement('div');
  host.innerHTML='<div class="overlay" id="ov"></div><div class="drawer" id="dw"><div class="drawer-head"><h2>'+(id==='new'?'New ':'Edit ')+esc(mdl.singular)+'</h2><button class="x" id="dwClose">✕</button></div><div class="drawer-body">'+imp+body+'</div><div class="drawer-foot"><button class="btn btn-ghost" id="dwCancel">Cancel</button><button class="btn btn-ok" id="dwSave">Save '+esc(mdl.singular.toLowerCase())+'</button></div></div>';
  document.body.appendChild(host);
  requestAnimationFrame(function(){ $('#ov',host).classList.add('show'); $('#dw',host).classList.add('show'); });

  function close(){ $('#ov',host).classList.remove('show'); $('#dw',host).classList.remove('show'); setTimeout(function(){ host.remove(); },350); }
  $('#dwClose',host).addEventListener('click',close);
  $('#dwCancel',host).addEventListener('click',close);
  $('#ov',host).addEventListener('click',close);

  host.querySelectorAll('[data-f]').forEach(function(el){ el.addEventListener('input',function(){ draft[el.getAttribute('data-f')]=el.value; }); });
  host.querySelectorAll('[data-imgpick]').forEach(function(p){
    var name=p.getAttribute('data-imgpick');
    var file=host.querySelector('[data-imgfile="'+name+'"]');
    p.addEventListener('click',function(){ file.click(); });
    file.addEventListener('change',function(e){ var f=e.target.files[0]; if(!f) return; var rd=new FileReader(); rd.onload=function(){ draft[name]=rd.result; p.classList.add('has'); $('img',p).src=rd.result; }; rd.readAsDataURL(f); });
  });

  if(mdl.hasImport){
    $('#liBtn',host).addEventListener('click',function(){ importLinkedIn(host); });
    $('#liUrl',host).addEventListener('keydown',function(e){ if(e.key==='Enter') importLinkedIn(host); });
  }

  $('#dwSave',host).addEventListener('click',function(){
    if(key==='products') draft.active = String(draft.active)!=='false';
    var arr=coll(key);
    if(!draft.title && !draft.name){ toast('Add a title first','err'); return; }
    if(id==='new'){ draft.id=uid(); arr.unshift(draft); toast(mdl.singular+' created','ok'); }
    else { var i=arr.findIndex(function(x){return x.id===id;}); if(i>-1) arr[i]=draft; toast(mdl.singular+' updated','ok'); }
    setColl(key,arr); close(); render();
  });
}

function importLinkedIn(host){
  var url=$('#liUrl',host).value.trim(); if(!url){ toast('Paste a link first','err'); return; }
  if(!/^https?:\/\//.test(url)) url='https://'+url;
  var st=$('#liStatus',host), tx=$('#liText',host);
  st.className='li-status show'; tx.textContent='Fetching the post…'; $('#liBtn',host).disabled=true;
  var ctrl=new AbortController(); var to=setTimeout(function(){ctrl.abort();},28000);
  fetch('https://r.jina.ai/'+url,{headers:{'Accept':'application/json'},signal:ctrl.signal})
  .then(function(r){return r.json();}).then(function(res){
    var d=(res&&res.data)||{}, meta=d.metadata||{};
    var title=meta['og:title']||d.title||'';
    var desc=meta['og:description']||d.description||''; if(!desc&&d.content){ desc=String(d.content).replace(/\s+/g,' ').slice(0,320).trim()+'…'; }
    var img=meta['og:image']||meta['twitter:image']||'';
    if(!title&&!desc) throw new Error('empty');
    // fill draft + inputs
    setVal(host,'title',String(title).trim()); setVal(host,'body',String(desc).trim());
    if(img){ draft.image=img; var p=host.querySelector('[data-imgpick="image"]'); if(p){ p.classList.add('has'); $('img',p).src=img; } }
    st.className='li-status show done'; tx.textContent='Imported. Review the text and Arabic, then save.';
  }).catch(function(){
    st.className='li-status show err'; tx.textContent='Could not read that link (login wall or blocked). Type the details in below.';
  }).finally(function(){ $('#liBtn',host).disabled=false; clearTimeout(to); });
}
function setVal(host,name,val){ draft[name]=val; var el=host.querySelector('[data-f="'+name+'"]'); if(el) el.value=val; }

/* ---------------- events calendar ---------------- */
function renderCalendar(hostEl){
  var now=new Date(); var y=now.getFullYear(), mth=now.getMonth();
  var first=new Date(y,mth,1), start=first.getDay(), days=new Date(y,mth+1,0).getDate();
  var evs=coll('events');
  var dow=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(function(d){return '<div class="cal-dow">'+d+'</div>';}).join('');
  var cells='';
  for(var i=0;i<start;i++) cells+='<div class="cal-cell out"></div>';
  for(var d=1;d<=days;d++){
    var ds=y+'-'+String(mth+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
    var todayCls=(d===now.getDate())?' today':'';
    var dayEvs=evs.filter(function(e){return e.date===ds;}).map(function(e){return '<div class="cal-ev" data-open="events:'+e.id+'">'+esc(e.title)+'</div>';}).join('');
    cells+='<div class="cal-cell'+todayCls+'"><div class="dn">'+d+'</div>'+dayEvs+'</div>';
  }
  var mn=first.toLocaleDateString('en-GB',{month:'long',year:'numeric'});
  hostEl.innerHTML='<div class="cal"><div class="cal-head"><h2>'+mn+'</h2><span style="font-size:13px;color:#6b6a63">'+evs.length+' events</span></div><div class="cal-grid">'+dow+cells+'</div></div>';
  bindCommon(hostEl);
}

/* ---------------- pages & settings ---------------- */
function pagesView(m){
  var p=obj('pages');
  m.innerHTML=topbar('Page Content','Site','<button class="btn btn-ok" id="savePages">Save changes</button>')+
    '<div class="view"><div class="panel"><div class="panel-head"><div><h2>Home page</h2><p>The headline text your visitors see first.</p></div></div><div class="panel-body">'+
    '<div class="form-grid">'+
    fieldHTML({name:'heroTitle',type:'text',label:'Hero headline'},p.heroTitle)+
    fieldHTML({name:'ctaTitle',type:'text',label:'Call-to-action line'},p.ctaTitle)+
    fieldHTML({name:'heroSub',type:'textarea',label:'Hero subtext'},p.heroSub)+
    '</div></div></div>'+
    '<div class="panel"><div class="panel-head"><div><h2>About section</h2></div></div><div class="panel-body"><div class="form-grid">'+
    fieldHTML({name:'aboutTitle',type:'text',label:'About title'},p.aboutTitle)+
    fieldHTML({name:'aboutBody',type:'textarea',label:'About text'},p.aboutBody)+
    '</div></div></div>'+
    '<div class="panel"><div class="panel-head"><div><h2>Headline stats</h2></div></div><div class="panel-body"><div class="form-grid">'+
    fieldHTML({name:'statYears',type:'text',label:'Years',half:true},p.statYears)+
    fieldHTML({name:'statCountries',type:'text',label:'Countries served',half:true},p.statCountries)+
    fieldHTML({name:'statCategories',type:'text',label:'Product categories',half:true},p.statCategories)+
    '</div></div></div></div>';
  var d={};
  m.querySelectorAll('[data-f]').forEach(function(el){ el.addEventListener('input',function(){ d[el.getAttribute('data-f')]=el.value; }); });
  $('#savePages').addEventListener('click',function(){ var cur=obj('pages'); Object.keys(d).forEach(function(k){cur[k]=d[k];}); setObj('pages',cur); toast('Page content saved','ok'); });
}
function settingsView(m){
  var s=obj('settings');
  m.innerHTML=topbar('Settings','Site','<button class="btn btn-ok" id="saveSet">Save changes</button>')+
    '<div class="view"><div class="panel"><div class="panel-head"><div><h2>Company details</h2><p>Shown in the site footer and contact page.</p></div></div><div class="panel-body"><div class="form-grid">'+
    fieldHTML({name:'companyName',type:'text',label:'Company name'},s.companyName)+
    fieldHTML({name:'phone',type:'text',label:'Phone',half:true},s.phone)+
    fieldHTML({name:'fax',type:'text',label:'Fax',half:true},s.fax)+
    fieldHTML({name:'email',type:'text',label:'Email',half:true},s.email)+
    fieldHTML({name:'hours',type:'text',label:'Office hours',half:true},s.hours)+
    fieldHTML({name:'address',type:'textarea',label:'Address'},s.address)+
    '</div></div></div></div>';
  var d={};
  m.querySelectorAll('[data-f]').forEach(function(el){ el.addEventListener('input',function(){ d[el.getAttribute('data-f')]=el.value; }); });
  $('#saveSet').addEventListener('click',function(){ var cur=obj('settings'); Object.keys(d).forEach(function(k){cur[k]=d[k];}); setObj('settings',cur); toast('Settings saved','ok'); });
}

/* ---------------- shared bindings ---------------- */
function bindCommon(scope){
  scope.querySelectorAll('[data-open]').forEach(function(el){
    el.addEventListener('click',function(e){ e.stopPropagation(); var p=el.getAttribute('data-open').split(':'); openForm(p[0],p[1]); });
  });
  scope.querySelectorAll('[data-del]').forEach(function(el){
    el.addEventListener('click',function(e){ e.stopPropagation(); var p=el.getAttribute('data-del').split(':'); var key=p[0],id=p[1];
      if(!confirm('Delete this '+MODELS[key].singular.toLowerCase()+'? This cannot be undone.')) return;
      setColl(key, coll(key).filter(function(x){return x.id!==id;})); toast(MODELS[key].singular+' deleted'); render();
    });
  });
  scope.querySelectorAll('[data-nav]').forEach(function(el){
    el.addEventListener('click',function(){ view=el.getAttribute('data-nav'); render(); });
  });
}

render();
})();
