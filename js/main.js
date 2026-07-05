const SUPABASE_URL = 'https://rhdstfwxovfvuaggjduo.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_-wvcuqUEVKiy2aGJ1Bri8Q_6M6KUAu-';
let supabase = null;
if (window.supabase) {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.warn('Supabase JS client not found (network block?)');
}

// ======= CHECK BLOCKER =======
async function checkBlocker() {
  if (!supabase) return;
  try {
    const { data, error } = await supabase.from('site_settings').select('is_active').eq('id', 1).single();
    if (data && !data.is_active) {
      document.getElementById('site-blocker').style.display = 'flex';
      document.body.style.overflow = 'hidden';
      // Esconder el contenido principal para mayor seguridad
      document.getElementById('splash').style.display = 'none';
      document.querySelector('nav').style.display = 'none';
      document.getElementById('hero').style.display = 'none';
    }
  } catch(e) {
    console.error(e);
  }
}
checkBlocker();

// ======= AUDIO — Running Up That Hill · Kate Bush (Stranger Things) =======
let _musicStarted = false;
function startMusic(){
  if(_musicStarted) return;
  _musicStarted = true;
  // Crear iframe oculto — se activa automáticamente con el click de INGRESAR
  const yt = document.createElement('iframe');
  yt.id = 'yt-music';
  yt.src = 'https://www.youtube.com/embed/-RcPZdihrp4?autoplay=1&loop=1&playlist=-RcPZdihrp4,NSXA-prVotU&controls=0&disablekb=1&fs=0&modestbranding=1&rel=0&start=0';
  yt.allow = 'autoplay; encrypted-media';
  yt.setAttribute('allowfullscreen', '');
  yt.style.cssText = 'position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;bottom:-1px;left:-1px;border:none';
  document.body.appendChild(yt);
  // Sin botón de música — se activa solo con INGRESAR
}

// ======= SPLASH =======
function enterSite(){
  startMusic();
  document.getElementById('splash').classList.add('hidden');
  document.body.style.overflow='auto';
}
document.body.style.overflow='hidden';

// ======= TYPEWRITER STORY =======
const storyFull = `Bajo las calles más antiguas de Argentina, en Santiago del Estero — la Madre de Ciudades — existe una red de túneles que nadie termina de mapear. Los colonizadores los construyeron en 1553. Dicen que van más allá de la Plaza Libertad, que serpentean bajo el Río Dulce, que sus paredes respiran.

En octubre de 2025, los sismógrafos de la universidad detectaron vibraciones a 18 metros de profundidad. No eran temblores. Era algo que pulsaba. Como un corazón.

La grieta se abrió el 31 de octubre. El Upside Down encontró su portal en el subsuelo santiagueño. Ahora tú tienes la oportunidad de cruzar.`;

let storyIndex = 0;
const storyEl = document.getElementById('story-text');
const storyContainer = document.getElementById('splash-story');

function typeStory(){
  if(!storyEl || !storyContainer) return;
  if(storyIndex < storyFull.length){
    storyEl.textContent += storyFull[storyIndex];
    storyIndex++;
    setTimeout(typeStory, storyIndex < 80 ? 28 : 18);
  } else {
    // Cursor parpadeante al final
    storyEl.innerHTML += '<span style="animation:flicker 1s infinite;color:var(--neon-red)">_</span>';
  }
}
// Empieza a escribir 1.5s después de cargar la página
setTimeout(typeStory, 1500);

// ======= SPLASH SPORE PARTICLES =======
const sp=document.getElementById('splash-particles');
for(let i=0;i<40;i++){
  const el=document.createElement('div');
  const size=Math.random()*5+2;
  el.style.cssText=`position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:rgba(${Math.random()>.5?'196,30,58':'79,195,247'},.5);left:${Math.random()*100}%;animation:float-spore ${Math.random()*15+10}s ${Math.random()*12}s linear infinite;pointer-events:none`;
  sp.appendChild(el);
}

// ======= HERO PARTICLES =======
const hp=document.getElementById('hero-particles');
for(let i=0;i<35;i++){
  const el=document.createElement('div');
  const size=Math.random()*4+1.5;
  const isRed=Math.random()>.6;
  el.style.cssText=`position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:rgba(${isRed?'196,30,58':'79,195,247'},.4);left:${Math.random()*100}%;animation:float-spore ${Math.random()*18+12}s ${Math.random()*15}s linear infinite;pointer-events:none`;
  hp.appendChild(el);
}

// ======= LIGHTNING BOLTS + THUNDER =======
function makeLightningPath(){
  const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  // Más alto y ancho que antes
  const h = 450 + Math.random()*350;
  const w = 80;
  svg.setAttribute('width', w);
  svg.setAttribute('height', h);
  svg.style.cssText = 'position:absolute;top:0;overflow:visible;pointer-events:none';

  // Rayo principal (grueso)
  let d = `M${w/2} 0`;
  let y = 0;
  while(y < h){
    const step = 30 + Math.random()*50;
    y += step;
    const x = 10 + Math.random()*(w-20);
    d += ` L${x} ${y}`;
  }
  // Rayo secundario (bifurcación)
  let d2 = `M${w/2} ${h*0.3}`;
  let y2 = h*0.3;
  while(y2 < h*0.7){
    y2 += 25 + Math.random()*35;
    d2 += ` L${10+Math.random()*(w-20)} ${y2}`;
  }

  const defs = document.createElementNS('http://www.w3.org/2000/svg','defs');
  // Filtro de glow fuerte
  const filter = document.createElementNS('http://www.w3.org/2000/svg','filter');
  filter.setAttribute('id','lglow'); filter.setAttribute('x','-200%'); filter.setAttribute('y','-20%');
  filter.setAttribute('width','500%'); filter.setAttribute('height','140%');
  const blur = document.createElementNS('http://www.w3.org/2000/svg','feGaussianBlur');
  blur.setAttribute('stdDeviation','10'); blur.setAttribute('result','coloredBlur');
  const merge = document.createElementNS('http://www.w3.org/2000/svg','feMerge');
  ['coloredBlur','coloredBlur','SourceGraphic'].forEach(n=>{
    const mn=document.createElementNS('http://www.w3.org/2000/svg','feMergeNode');
    mn.setAttribute('in',n); merge.appendChild(mn);
  });
  filter.appendChild(blur); filter.appendChild(merge); defs.appendChild(filter);

  // Rayo principal
  const path = document.createElementNS('http://www.w3.org/2000/svg','path');
  path.setAttribute('d', d);
  path.setAttribute('stroke', '#ff1442');
  path.setAttribute('stroke-width', 3 + Math.random()*4);
  path.setAttribute('fill','none');
  path.setAttribute('filter','url(#lglow)');
  path.setAttribute('stroke-linecap','round');

  // Núcleo blanco (hace parecer más real y brillante)
  const core = document.createElementNS('http://www.w3.org/2000/svg','path');
  core.setAttribute('d', d);
  core.setAttribute('stroke', 'rgba(255,200,200,0.9)');
  core.setAttribute('stroke-width', 1.5);
  core.setAttribute('fill','none');
  core.setAttribute('stroke-linecap','round');

  // Bifurcación
  const branch = document.createElementNS('http://www.w3.org/2000/svg','path');
  branch.setAttribute('d', d2);
  branch.setAttribute('stroke', '#ff3366');
  branch.setAttribute('stroke-width', 1.5);
  branch.setAttribute('fill','none');
  branch.setAttribute('filter','url(#lglow)');
  branch.setAttribute('stroke-linecap','round');

  svg.appendChild(defs);
  svg.appendChild(path);
  svg.appendChild(core);
  svg.appendChild(branch);
  return svg;
}

function spawnLightning(){
  const lc = document.getElementById('lightning-container');
  const glow = document.getElementById('lightning-glow');
  const bolt = makeLightningPath();
  bolt.style.left = (3 + Math.random()*88) + '%';
  bolt.style.top = '0';
  bolt.style.opacity = '0';
  lc.appendChild(bolt);

  // FASE 1: aparece suave (más lento que antes)
  setTimeout(()=>{
    bolt.style.transition = 'opacity .12s ease-in';
    bolt.style.opacity = '1';
    if(glow){ glow.style.transition='opacity .12s'; glow.style.opacity='1'; }
  }, 10);
  // FASE 2: primer parpadeo
  setTimeout(()=>{
    bolt.style.transition='opacity .08s';
    bolt.style.opacity='.2';
    if(glow){ glow.style.opacity='.2'; }
  }, 180);
  // FASE 3: vuelve fuerte
  setTimeout(()=>{
    bolt.style.transition='opacity .10s';
    bolt.style.opacity='.95';
    if(glow){ glow.style.transition='opacity .10s'; glow.style.opacity='.9'; }
  }, 280);
  // FASE 4: desvanece lentamente
  setTimeout(()=>{
    bolt.style.transition='opacity .4s ease-out';
    bolt.style.opacity='0';
    if(glow){ glow.style.transition='opacity .4s'; glow.style.opacity='0'; }
  }, 450);
  setTimeout(()=>bolt.remove(), 900);

  // Próximo rayo: cada 5-14 segundos (más espaciados)
  setTimeout(spawnLightning, 5000 + Math.random()*9000);
}
// Primer rayo después de 3 segundos de estar en la home
setTimeout(spawnLightning, 3000);


// ======= HAMBURGER =======
function toggleMenu(){
  document.getElementById('mobile-menu').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('open');
}
function closeMenu(){
  document.getElementById('mobile-menu').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}
document.addEventListener('click',e=>{
  const m=document.getElementById('mobile-menu'),b=document.getElementById('hamburger');
  if(m.classList.contains('open')&&!m.contains(e.target)&&!b.contains(e.target)) closeMenu();
});

// ======= COUNTDOWN — 31 Oct 2026 22:00 =======
const target=new Date('2026-10-31T22:00:00'); // Mantenemos la fecha para lógica futura
function updateCD(){
  const diff=target-new Date();
  if(diff<=0){document.querySelectorAll('.cd-num').forEach(e=>e.textContent='00');return;}
  const d=Math.floor(diff/864e5),h=Math.floor((diff%864e5)/36e5),m=Math.floor((diff%36e5)/6e4),s=Math.floor((diff%6e4)/1e3);
  document.getElementById('cd-days').textContent='PR';
  document.getElementById('cd-hours').textContent='OX';
  document.getElementById('cd-mins').textContent='IM';
  document.getElementById('cd-secs').textContent='A!';
}
updateCD(); setInterval(updateCD,1000);

// ======= SCROLL REVEAL =======
const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.08});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

// ======= MODAL =======
function openModal(){document.getElementById('modal').classList.add('open')}
function closeModal(){document.getElementById('modal').classList.remove('open')}
function closeModalOutside(e){if(e.target===document.getElementById('modal'))closeModal()}

// ======= LIGHTBOX =======
const lbImgs=['fotos/26102019-0L4A3971.jpg','fotos/26102019-IMG_3886.jpg','fotos/26102019-IMG_3959.jpg','fotos/26102019-IMG_3965.jpg','fotos/26102019-IMG_3968.jpg','fotos/26102019-IMG_3971.jpg','fotos/26102019-IMG_4000.jpg','fotos/26102019-IMG_4022.jpg','fotos/26102019-IMG_4034.jpg','fotos/26102019-IMG_4095.jpg','fotos/26102019-IMG_4122.jpg','fotos/26102019-IMG_4144.jpg','fotos/26102019-IMG_4171.jpg'];
let lbCur=0;
function openLightbox(i){lbCur=i;document.getElementById('lb-img').src=lbImgs[i];document.getElementById('lightbox').classList.add('open');document.body.style.overflow='hidden'}
function closeLightbox(){document.getElementById('lightbox').classList.remove('open');document.body.style.overflow='auto'}
function closeLightboxOutside(e){if(e.target===document.getElementById('lightbox'))closeLightbox()}
function lightboxNav(d){lbCur=(lbCur+d+lbImgs.length)%lbImgs.length;document.getElementById('lb-img').src=lbImgs[lbCur]}

// ======= KEYBOARD =======
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){closeModal();closeLightbox();}
  if(document.getElementById('lightbox').classList.contains('open')){
    if(e.key==='ArrowRight')lightboxNav(1);
    if(e.key==='ArrowLeft')lightboxNav(-1);
  }
});

// ======= FORM =======
document.getElementById('fdd-form').addEventListener('submit', async function(e){
  e.preventDefault();
  
  if (!supabase) {
    alert('Sistema fuera de línea por favor intenta de nuevo.');
    return;
  }
  
  const form = this;
  const inputs = form.querySelectorAll('input, select, textarea');
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  
  submitBtn.innerHTML = '⚡ TRANSMITIENDO...';
  submitBtn.disabled = true;

  const data = {
    name: inputs[0].value,
    email: inputs[1].value,
    phone: inputs[2].value,
    category: inputs[3].value,
    concept: inputs[4].value
  };

  try {
    const { error } = await supabase.from('users_leads').insert([data]);
    if (error) throw error;
    
    form.style.display='none';
    document.getElementById('success-msg').style.display='block';
  } catch (err) {
    console.error(err);
    alert('Falla en la transmisión dimensional. Intenta nuevamente.');
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
});