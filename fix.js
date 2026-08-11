const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Logos
html = html.replace(/logo-st\.png/g, 'marcalogo.png');

// 2. Acceso VIP buttons
html = html.replace('>ACCESO CLASIFICADO</button>', '>ACCESO VIP</button>');
html = html.replace('>ACCESO CLASIFICADO</button>', '>ACCESO VIP</button>'); // second instance

// 3. Registrar Agente -> Comprar Entrada
html = html.replace('onclick="document.getElementById(\'registro\').scrollIntoView({behavior:\'smooth\'})">📋 REGISTRAR AGENTE</button>', 'onclick="openModal()">🎟 COMPRAR ENTRADA</button>');

// 4. Modal Update
const modalOld = `<h3 class="modal-title">Portal en Activación</h3>
    <p class="modal-text">La venta de entradas para la Fiesta de Disfraces 2026 se habilitará próximamente.<br><br>El portal está calibrando sus coordenadas. Contactanos por WhatsApp para preventa exclusiva y novedades del evento.</p>
    <button class="modal-wa" onclick="window.open('https://api.whatsapp.com/send?phone=543855789996&text=Hola!%20Quiero%20info%20sobre%20entradas%20para%20la%20FDD%202026','_blank')">
      <svg style="width:22px;height:22px;fill:#fff;flex-shrink:0" viewBox="0 0 32 32"><path d="M16 0C7.163 0 0 7.163 0 16c0 2.833.738 5.494 2.027 7.807L.054 31.946l8.344-1.958A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0z"/></svg>
      CONSULTAR POR WHATSAPP
    </button>`;
const modalNew = `<h3 class="modal-title" style="font-family:'Stranger Back', sans-serif; font-size:3rem; margin-bottom:20px; color:var(--red);">Comprar Entrada</h3>
    <p class="modal-text" style="font-size:1.5rem; text-transform:uppercase; letter-spacing:2px; font-weight:bold;">Próximamente</p>`;
html = html.replace(modalOld, modalNew);

// 5. Hero Typography and Watermark
const heroOld = `<div style="position:relative;z-index:2;text-align:center">
    <p class="hero-badge reveal">CLUB SPORTIVO FERNÁNDEZ · SÁBADO 7 DE NOVIEMBRE</p>
    <div class="hero-year reveal">EDICIÓN 2026 - Una extraña edición</div>
    <h2 class="hero-title reveal glitch-text" data-text="FIESTA DE DISFRACES">FIESTA DE DISFRACES</h2>`;
const heroNew = `<!-- Watermark Logo -->
  <img src="marcalogo.png" alt="Marca de agua" style="position:absolute; top:40%; left:50%; transform:translate(-50%, -50%); width:600px; max-width:90%; opacity:0.15; z-index:1; pointer-events:none; filter: grayscale(100%); mix-blend-mode: overlay;">
  
  <div style="position:relative;z-index:2;text-align:center">
    <p class="hero-badge reveal" style="font-family:'Stranger Back', sans-serif; font-size:1.8rem; color:var(--red); text-shadow: 0 0 10px rgba(196,30,58,0.8); letter-spacing:0.05em; text-transform:uppercase; margin-bottom:15px; border:none; background:none;">CLUB SPORTIVO FERNÁNDEZ · SÁBADO 7 DE NOVIEMBRE</p>
    <div class="hero-year reveal" style="font-family:'Stranger Back', sans-serif; font-size:2.5rem; margin-bottom:10px;">EDICIÓN 2026 - Una extraña edición</div>
    <h2 class="hero-title reveal glitch-text" data-text="FIESTA DE DISFRACES" style="font-family:'Stranger Back', sans-serif; font-size:6rem;">FIESTA DE DISFRACES</h2>`;
html = html.replace(heroOld, heroNew);

// 6. Change section hero to overflow hidden
html = html.replace('<section id="hero">', '<section id="hero" style="position:relative; overflow:hidden;">');

fs.writeFileSync('index.html', html);
console.log('Update complete');
