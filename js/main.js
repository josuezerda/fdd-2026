// ── PARTÍCULAS ──
const pc = document.getElementById('particles');
// Respetar prefers-reduced-motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (pc && !prefersReducedMotion) {
  for (let i = 0; i < 60; i++) {
    const el = document.createElement('div');
    const sz = Math.random() * 3.5 + 1;
    const r = Math.random() > 0.5;
    el.style.cssText = `position:absolute;border-radius:50%;width:${sz}px;height:${sz}px;background:rgba(${r ? '255,20,66' : '79,195,247'},.28);left:${Math.random() * 100}%;top:${Math.random() * 100}%;animation:sp ${14 + Math.random() * 22}s ${Math.random() * 14}s linear infinite`;
    pc.appendChild(el);
  }
  
  const ks = document.createElement('style');
  ks.textContent = '@keyframes sp{0%{transform:translateY(0) scale(1);opacity:.28}50%{opacity:.6}100%{transform:translateY(-120vh) scale(0);opacity:0}}';
  document.head.appendChild(ks);
}

// ── RAYOS ──
function makeBolt() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const h = 400 + Math.random() * 400, w = 80;
  svg.setAttribute('width', w); 
  svg.setAttribute('height', h);
  svg.style.cssText = 'position:absolute;top:0;overflow:visible;pointer-events:none';
  // Agregar aria-hidden a elementos decorativos
  svg.setAttribute('aria-hidden', 'true');
  
  let d = `M${w / 2} 0`, y = 0;
  while (y < h) { 
    const s = 30 + Math.random() * 50; 
    y += s; 
    d += ` L${10 + Math.random() * (w - 20)} ${y}`; 
  }
  
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const f = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
  f.setAttribute('id', 'bg'); f.setAttribute('x', '-200%'); f.setAttribute('y', '-20%'); f.setAttribute('width', '500%'); f.setAttribute('height', '140%');
  
  const bl = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
  bl.setAttribute('stdDeviation', '10'); bl.setAttribute('result', 'cb');
  
  const mg = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
  ['cb', 'cb', 'SourceGraphic'].forEach(n => { 
    const mn = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode'); 
    mn.setAttribute('in', n); 
    mg.appendChild(mn); 
  });
  
  f.appendChild(bl); f.appendChild(mg); defs.appendChild(f);
  
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  p.setAttribute('d', d); p.setAttribute('stroke', '#ff1442'); p.setAttribute('stroke-width', 3 + Math.random() * 4);
  p.setAttribute('fill', 'none'); p.setAttribute('filter', 'url(#bg)'); p.setAttribute('stroke-linecap', 'round');
  
  const c = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  c.setAttribute('d', d); c.setAttribute('stroke', 'rgba(255,210,210,.85)'); c.setAttribute('stroke-width', '1.5');
  c.setAttribute('fill', 'none'); c.setAttribute('stroke-linecap', 'round');
  
  svg.appendChild(defs); svg.appendChild(p); svg.appendChild(c);
  return svg;
}

function spawnBolt() {
  if (prefersReducedMotion) return; // No rayos si el usuario prefiere movimiento reducido
  
  const lc = document.getElementById('lightning'), glow = document.getElementById('lglow');
  if (!lc) return;

  const bolt = makeBolt();
  bolt.style.left = (3 + Math.random() * 88) + '%'; 
  bolt.style.top = '0'; 
  bolt.style.opacity = '0';
  lc.appendChild(bolt);
  
  setTimeout(() => { bolt.style.transition = 'opacity .12s ease-in'; bolt.style.opacity = '1'; if (glow) { glow.style.transition = 'opacity .12s'; glow.style.opacity = '1'; } }, 10);
  setTimeout(() => { bolt.style.transition = 'opacity .08s'; bolt.style.opacity = '.2'; if (glow) glow.style.opacity = '.2'; }, 180);
  setTimeout(() => { bolt.style.transition = 'opacity .10s'; bolt.style.opacity = '.95'; if (glow) { glow.style.transition = 'opacity .10s'; glow.style.opacity = '.9'; } }, 280);
  setTimeout(() => { bolt.style.transition = 'opacity .4s ease-out'; bolt.style.opacity = '0'; if (glow) { glow.style.transition = 'opacity .4s'; glow.style.opacity = '0'; } }, 460);
  setTimeout(() => bolt.remove(), 950);
  
  setTimeout(spawnBolt, 5000 + Math.random() * 9000);
}

if (!prefersReducedMotion) {
  setTimeout(spawnBolt, 2500);
}

// ── NAVEGACIÓN STICKY ──
const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
  if(!navbar) return;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  if (scrollTop > lastScrollTop && scrollTop > 100) {
    // Scroll down - esconder
    navbar.style.transform = 'translateY(-100%)';
  } else {
    // Scroll up - mostrar
    navbar.style.transform = 'translateY(0)';
  }
  lastScrollTop = scrollTop;
});

// ── FAQ ACORDEÓN ──
document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    
    // Cerrar otros
    document.querySelectorAll('.faq-item').forEach(otherItem => {
      if(otherItem !== item) {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        otherItem.querySelector('.faq-answer').setAttribute('aria-hidden', 'true');
      }
    });

    // Toggle actual
    item.classList.toggle('active');
    button.setAttribute('aria-expanded', !isExpanded);
    const answer = item.querySelector('.faq-answer');
    if(answer) {
      answer.setAttribute('aria-hidden', isExpanded);
    }
  });
});
