(function(){
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* theme */
try{var st=localStorage.getItem('vien-theme');if(st)document.documentElement.setAttribute('data-theme',st)}catch(e){}
$('#theme').addEventListener('click',function(){
  var cur=document.documentElement.getAttribute('data-theme');
  var dark=cur?cur==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;
  var n=dark?'light':'dark';document.documentElement.setAttribute('data-theme',n);
  try{localStorage.setItem('vien-theme',n)}catch(e){}
});

/* embers */
var em=$('#embers');
for(var i=0;i<14;i++){var s=document.createElement('span');s.className='ember';
  s.style.left=(6+Math.random()*88)+'%';s.style.animationDuration=(7+Math.random()*7)+'s';s.style.animationDelay=(-Math.random()*10)+'s';
  s.style.setProperty('--dx',((Math.random()-.5)*80)+'px');s.style.width=s.style.height=(3+Math.random()*4)+'px';em.appendChild(s)}

/* phone cycle */
var scr=$$('#screens .scr'),dots=$('#dots'),sl=$('#slabel'),cur=0,timer;
var labels=['01 · Quét QR / NFC tại điểm đến','02 · Nghe câu chuyện từng chương','03 · Trả lời câu hỏi, nhận EXP','04 · Hoàn thành, mở khóa trải nghiệm'];
scr.forEach(function(_,i){var b=document.createElement('button');b.setAttribute('aria-label','Màn hình '+(i+1));b.addEventListener('click',function(){go(i,true)});dots.appendChild(b)});
function go(n,manual){
  var prev=scr[cur];prev.classList.remove('on');prev.classList.add('out');
  setTimeout(function(){prev.classList.remove('out')},520);
  cur=n;scr[cur].classList.add('on');
  $$('button',dots).forEach(function(b,i){b.classList.toggle('on',i===cur)});
  sl.textContent=labels[cur];
  clearInterval(timer);if(!reduce)timer=setInterval(function(){go((cur+1)%scr.length)},3600);
}
go(0);

/* hero count-up + generic counters */
function count(el){
  var t=+el.dataset.count,k=el.dataset.fmt==='k',d=1100,t0=null;
  function f(ts){if(!t0)t0=ts;var p=Math.min(1,(ts-t0)/d),e=1-Math.pow(1-p,4),v=Math.round(t*e);
    el.textContent=k?(v>=1000?(v/1000).toFixed(1)+'K':v):v;if(p<1)requestAnimationFrame(f)}
  if(reduce){el.textContent=k?(t/1000).toFixed(1)+'K':t}else requestAnimationFrame(f);
}
var io=new IntersectionObserver(function(es){es.forEach(function(e){
  if(!e.isIntersecting)return;var el=e.target;
  if(el.classList.contains('rv'))el.classList.add('in');
  $$('[data-count]',el).forEach(function(c){if(!c.dataset.done){c.dataset.done=1;count(c)}});
  $$('[data-w]',el).forEach(function(b){b.style.width=b.dataset.w+'%'});
  io.unobserve(el)})},{threshold:.15});
$$('.rv').forEach(function(el){io.observe(el)});
$$('.stats').forEach(function(el){io.observe(el)});

/* parallax roof */
var roof=$('#roofBg');
window.addEventListener('scroll',function(){var y=Math.min(window.scrollY,700);roof.style.transform='translateX(-50%) translateY('+(y*.12)+'px) scale('+(1+y*.0002)+')'},{passive:true});

/* nav highlight */
var secs=['kham-pha','trai-nghiem','hanh-trinh','ban-do','khung-thiet-ke'].map(function(id){return document.getElementById(id)});
var navio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){$$('nav a').forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-45% 0px -50% 0px'});
secs.forEach(function(s){if(s)navio.observe(s)});

/* destination art */
var G={dinh:['#6b3322','#1E1410'],bridge:['#4a3560','#e0804a'],mountain:['#2c6b58','#0f2a24'],pagoda:['#8a4630','#2B1D17'],house:['#9a6a32','#2B1D17'],museum:['#7a6853','#2B1D17']};
var uid=0;
function art(kind){
  var id='ag'+(uid++),c=G[kind],s='';
  var base='<defs><linearGradient id="'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+c[0]+'"/><stop offset="1" stop-color="'+c[1]+'"/></linearGradient></defs><rect width="320" height="200" fill="url(#'+id+')"/>';
  var sun='<circle cx="240" cy="62" r="26" fill="#E3A83A" opacity=".55"/>';
  if(kind==='dinh')s=sun+'<use href="#roof" transform="translate(10 78) scale(.5)"/><rect x="40" y="188" width="240" height="12" fill="#0d0806"/>';
  if(kind==='bridge')s=sun+'<g fill="#0d0806"><path d="M0 150Q80 100 160 150Q240 100 320 150V200H0Z"/><path d="M110 112H210L200 96H120Z"/><rect x="122" y="112" width="76" height="20"/></g><g fill="#E3A83A"><circle cx="128" cy="140" r="5"/><circle cx="160" cy="132" r="5"/><circle cx="192" cy="140" r="5"/></g><path d="M0 170H320" stroke="#E3A83A" stroke-opacity=".35"/>';
  if(kind==='mountain')s='<circle cx="250" cy="54" r="22" fill="#fff" opacity=".35"/><g><path d="M-10 170L60 80L110 130L150 60L220 140L260 100L330 170V200H-10Z" fill="#0f2a24" opacity=".95"/><path d="M-10 190L80 120L140 160L210 110L330 190V200H-10Z" fill="#071512"/></g><ellipse cx="160" cy="150" rx="180" ry="14" fill="#fff" opacity=".12"/>';
  if(kind==='pagoda')s=sun+'<g fill="#0d0806"><path d="M142 40L160 24L178 40Z"/><path d="M118 70Q160 56 202 70L192 84H128Z"/><path d="M110 104Q160 88 210 104L198 120H122Z"/><path d="M100 142Q160 124 220 142L206 160H114Z"/><rect x="124" y="160" width="72" height="30"/><rect x="60" y="190" width="200" height="10"/></g>';
  if(kind==='house')s=sun+'<g fill="#0d0806"><path d="M60 118Q160 70 260 118L248 126H72Z"/><rect x="84" y="126" width="152" height="56"/><rect x="60" y="182" width="200" height="12"/></g><rect x="146" y="140" width="28" height="42" fill="#E3A83A" opacity=".5"/><rect x="100" y="140" width="22" height="26" fill="#E3A83A" opacity=".35"/><rect x="198" y="140" width="22" height="26" fill="#E3A83A" opacity=".35"/>';
  if(kind==='museum')s=sun+'<g fill="#0d0806"><path d="M56 96L160 54L264 96Z"/><rect x="64" y="100" width="192" height="10"/><rect x="76" y="110" width="14" height="60"/><rect x="114" y="110" width="14" height="60"/><rect x="152" y="110" width="14" height="60"/><rect x="190" y="110" width="14" height="60"/><rect x="228" y="110" width="14" height="60"/><rect x="56" y="170" width="208" height="20"/></g>';
  return '<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">'+base+s+'</svg>';
}
var D=window.VIEN_DATA||[];
var cats=['Tất cả','Di sản','Lịch sử'],active=0,filter='Tất cả';
var cardsEl=$('#cards'),chipsEl=$('#chips'),detEl=$('#detail');
cats.forEach(function(c){var b=document.createElement('button');b.className='chip';b.textContent=c;b.setAttribute('aria-pressed',c===cats[0]);
  b.addEventListener('click',function(){filter=c;$$('.chip').forEach(function(x){x.setAttribute('aria-pressed',x===b)});apply()});chipsEl.appendChild(b)});
D.forEach(function(x,i){var b=document.createElement('button');b.className='card';b.dataset.i=i;
  b.innerHTML='<div class="art">'+art(x.k)+'<span class="tag">'+x.tag+'</span></div><div class="cb"><small>'+x.p+'</small><b>'+x.n+'</b><div class="m"><span>'+x.time+'</span><span>'+x.dist+'</span></div></div>';
  b.addEventListener('click',function(){show(i)});cardsEl.appendChild(b)});
function apply(){var k=0,first=-1;$$('.card').forEach(function(el,i){var ok=filter===cats[0]||D[i].c.indexOf(filter)>-1;el.classList.toggle('hide',!ok);
  if(ok){if(first<0)first=i;el.classList.remove('enter');void el.offsetWidth;el.style.setProperty('--k',k++);el.classList.add('enter')}});
  if(first>-1&&(filter!==cats[0]&&D[active].c.indexOf(filter)<0))show(first)}
function show(i){active=i;$$('.card').forEach(function(el,j){if(j===i)el.setAttribute('aria-current','true');else el.removeAttribute('aria-current')});
  var x=D[i];
  detEl.innerHTML='<div class="art">'+art(x.k)+'</div><div class="dbody swap"><div class="pills"><span class="pill">'+x.tag+'</span><span class="pill g">'+x.lv+'</span></div><h3>'+x.n+'</h3><small style="color:var(--muted)">'+x.p+'</small><div class="pills"><span class="pill y">~'+x.time+'</span><span class="pill y">'+x.stops+' điểm dừng</span></div><p>'+x.d+'</p><ul class="stops">'+x.s.map(function(s){return '<li>'+s+'</li>'}).join('')+'</ul><a class="btn" href="#trai-nghiem">Bắt đầu trải nghiệm <span class="arr">→</span></a></div>'}
apply();show(0);

/* map */
var places=[{n:'Huế',c:'16.46°N 107.59°E',t:'Cố đô với quần thể di tích triều Nguyễn.'},{n:'Đà Nẵng',c:'16.05°N 108.20°E',t:'Điểm khởi đầu: Đình làng Hải Châu, Chùa Linh Ứng, Bảo tàng Chăm.'},{n:'Hội An',c:'15.88°N 108.33°E',t:'Phố cổ với Chùa Cầu và các hành trình Audio.'},{n:'Duy Xuyên',c:'15.80°N 108.28°E',t:'Cửa ngõ đến thánh địa Mỹ Sơn.'}];
var pl=$('#plist'),md=$('#mapdesc');
places.forEach(function(p,i){var li=document.createElement('li'),b=document.createElement('button');b.innerHTML='<span>'+p.n+'</span><small>'+p.c+'</small>';
  b.addEventListener('click',function(){pick(i)});li.appendChild(b);pl.appendChild(li)});
function pick(i){$$('.pin').forEach(function(g,j){g.classList.toggle('on',j===i)});$$('button',pl).forEach(function(b,j){b.classList.toggle('on',j===i)});md.textContent=places[i].t}
$$('.pin').forEach(function(g){g.addEventListener('click',function(){pick(+g.dataset.i)});g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(+g.dataset.i)}})});
pick(1);

})();
