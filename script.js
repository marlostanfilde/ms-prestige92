// MENU DRAWER
const menuToggle = document.getElementById('menuToggle');
const menuClose = document.getElementById('menuClose');
const drawer = document.getElementById('mobileMenu');
const overlay = document.getElementById('menuOverlay');

function openDrawer() {
  drawer.classList.add('open');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  drawer.classList.remove('open');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}
if (menuToggle) menuToggle.addEventListener('click', openDrawer);
if (menuClose) menuClose.addEventListener('click', closeDrawer);
if (overlay) overlay.addEventListener('click', closeDrawer);

// ── LOGO 3D CANVAS ──
const canvas = document.getElementById('logoCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H, t = 0;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Particules dorées
  const particles = Array.from({length: 120}, () => ({
    x: Math.random(),
    y: Math.random(),
    size: Math.random() * 1.8 + .3,
    speed: Math.random() * .0003 + .0001,
    opacity: Math.random() * .5 + .1,
    drift: (Math.random() - .5) * .0002
  }));

  function drawLogo3D(t) {
    const cx = W / 2;
    const cy = H / 2;
    const scale = Math.min(W, H) * 0.55;
    const depth = Math.sin(t * .6) * 0.12;
    const tiltX = Math.sin(t * .4) * 0.08;

    ctx.save();
    ctx.translate(cx, cy);

    // Ombre 3D portée
    for (let i = 6; i >= 0; i--) {
      const offset = i * 2.5;
      const alpha = 0.04 + i * 0.01;
      ctx.save();
      ctx.translate(offset * tiltX * 10, offset * 0.5 + depth * 20);
      ctx.globalAlpha = alpha;
      drawText(ctx, scale, '#8B6914');
      ctx.restore();
    }

    // Texte principal avec gradient or 3D
    ctx.globalAlpha = 1;
    const grad = ctx.createLinearGradient(-scale*.5, -scale*.15, scale*.5, scale*.15);
    grad.addColorStop(0, '#8B6914');
    grad.addColorStop(0.2, '#C9A84C');
    grad.addColorStop(0.45, '#F5E6B8');
    grad.addColorStop(0.55, '#D4AF37');
    grad.addColorStop(0.8, '#C9A84C');
    grad.addColorStop(1, '#7a5c0a');

    drawText(ctx, scale, grad);

    // Reflet lumineux qui balaie
    const sweepX = Math.sin(t * .7) * scale * .8;
    const sweepGrad = ctx.createLinearGradient(sweepX - 60, -scale*.15, sweepX + 60, scale*.15);
    sweepGrad.addColorStop(0, 'rgba(255,240,180,0)');
    sweepGrad.addColorStop(.5, 'rgba(255,240,180,0.18)');
    sweepGrad.addColorStop(1, 'rgba(255,240,180,0)');
    ctx.globalCompositeOperation = 'lighter';
    drawText(ctx, scale, sweepGrad);
    ctx.globalCompositeOperation = 'source-over';

    // Sous-titre
    ctx.globalAlpha = .55;
    ctx.font = `300 ${scale * .045}px Montserrat, sans-serif`;
    ctx.letterSpacing = `${scale * .018}px`;
    ctx.fillStyle = '#C9A84C';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('MAISON DE LUXE', 0, scale * .22);

    // Ligne déco
    ctx.globalAlpha = .3;
    ctx.strokeStyle = '#C9A84C';
    ctx.lineWidth = .5;
    const lw = scale * .35;
    ctx.beginPath();
    ctx.moveTo(-lw, scale * .14);
    ctx.lineTo(lw, scale * .14);
    ctx.stroke();

    ctx.restore();
  }

  function drawText(ctx, scale, fill) {
    ctx.font = `300 ${scale * .16}px 'Cormorant Garamond', Georgia, serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = fill;
    ctx.fillText('MS PRESTIGE 92', 0, 0);
  }

  function frame() {
    t += 0.012;
    ctx.clearRect(0, 0, W, H);

    // Fond dégradé profond
    const bg = ctx.createRadialGradient(W*.5, H*.45, 0, W*.5, H*.5, W*.7);
    bg.addColorStop(0, '#1a1408');
    bg.addColorStop(.5, '#0d0d08');
    bg.addColorStop(1, '#000000');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Halo central
    const halo = ctx.createRadialGradient(W*.5, H*.45, 0, W*.5, H*.45, W*.4);
    halo.addColorStop(0, `rgba(201,168,76,${.06 + Math.sin(t*.5)*.02})`);
    halo.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, W, H);

    // Particules
    particles.forEach(p => {
      p.y -= p.speed;
      p.x += p.drift;
      if (p.y < 0) { p.y = 1; p.x = Math.random(); }
      if (p.x < 0 || p.x > 1) p.drift *= -1;
      ctx.globalAlpha = p.opacity * (.5 + Math.sin(t * 2 + p.x * 10) * .3);
      ctx.fillStyle = '#C9A84C';
      ctx.beginPath();
      ctx.arc(p.x * W, p.y * H, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    drawLogo3D(t);
    requestAnimationFrame(frame);
  }
  frame();
}
