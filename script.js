// ── MENU DRAWER ──
const menuToggle = document.getElementById('menuToggle');
const menuClose  = document.getElementById('menuClose');
const drawer     = document.getElementById('mobileMenu');
const overlay    = document.getElementById('menuOverlay');

function openDrawer()  { drawer.classList.add('open'); overlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeDrawer() { drawer.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow = ''; }
if (menuToggle) menuToggle.addEventListener('click', openDrawer);
if (menuClose)  menuClose.addEventListener('click', closeDrawer);
if (overlay)    overlay.addEventListener('click', closeDrawer);

// ── PANIER (global) ──
function addToCart(name, price) {
  let cart = JSON.parse(localStorage.getItem('msCart') || '[]');
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price: parseInt(price), qty: 1 });
  }
  localStorage.setItem('msCart', JSON.stringify(cart));

  const total = cart.reduce((sum, i) => sum + i.qty, 0);
  localStorage.setItem('cartCount', total);
  const countEl = document.getElementById('cartCount');
  if (countEl) countEl.textContent = total;

  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = 'Ajouté au panier';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
  }
}

// Init cart count au chargement
(function() {
  const count = localStorage.getItem('cartCount') || '0';
  const countEl = document.getElementById('cartCount');
  if (countEl) countEl.textContent = count;
})();

// ── MODAL FICHE PRODUIT ──
let _modalCurrent = {};

function openModal(mono, icon, name, material, price, origPrice, badge, brand, imgSrc) {
  const overlay = document.getElementById('modalOverlay');
  const sheet   = document.getElementById('modalSheet');
  if (!overlay || !sheet) return;

  _modalCurrent = { mono, icon, name, material, price, origPrice, badge, brand, imgSrc };

  const savings = Math.round((1 - parseInt(price) / parseInt(origPrice)) * 100);

  document.getElementById('mName').textContent    = name;
  document.getElementById('mMat').textContent     = material;
  document.getElementById('mBrand').textContent   = brand || mono;
  document.getElementById('mPriceNow').textContent = price + ' €';
  document.getElementById('mPriceWas').textContent = origPrice + ' €';
  document.getElementById('mSavings').textContent  = '✦ Économisez ' + savings + '% par rapport au prix boutique';

  // Hero image ou emoji
  const heroEl = document.getElementById('mHeroImg');
  const monoEl = document.getElementById('mMono');
  const iconEl = document.getElementById('mIcon');
  const heroDiv = sheet.querySelector('.modal-hero');
  if (heroEl) {
    if (imgSrc) {
      heroEl.src = imgSrc;
      heroEl.style.cssText = 'display:block;width:100%;max-height:420px;object-fit:contain;background:#f5f4f0;';
      if (heroDiv) { heroDiv.style.padding = '0'; heroDiv.style.background = 'none'; }
      if (monoEl) monoEl.style.display = 'none';
      if (iconEl) iconEl.style.display = 'none';
    } else {
      heroEl.style.display = 'none';
      if (heroDiv) { heroDiv.style.padding = '32px 24px 24px'; heroDiv.style.background = '#f5f4f0'; }
      if (monoEl) { monoEl.textContent = mono; monoEl.style.display = ''; }
      if (iconEl) { iconEl.textContent = icon; iconEl.style.display = ''; }
    }
  } else {
    if (monoEl) monoEl.textContent = mono;
    if (iconEl) iconEl.textContent = icon;
  }

  const badgeEl = document.getElementById('mBadge');
  if (badge) { badgeEl.textContent = badge; badgeEl.style.display = 'inline-block'; }
  else { badgeEl.style.display = 'none'; }

  // Reset tailles
  const sizeBtns = document.querySelectorAll('#mSizes .size-btn');
  sizeBtns.forEach(b => b.classList.remove('selected'));

  document.getElementById('mBtnCart').onclick = function() {
    // Champ texte libre (claquettes / chaussures)
    const sizeInput = document.getElementById('mSizeInput');
    if (sizeInput) {
      const val = sizeInput.value.trim();
      if (!val) {
        sizeInput.style.borderColor = '#B8962E';
        setTimeout(() => { sizeInput.style.borderColor = '#e8e4e4'; }, 1200);
        const toast = document.getElementById('toast');
        if (toast) { toast.textContent = 'Veuillez indiquer votre pointure'; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2000); }
        return;
      }
      addToCart(name + ' — ' + val, price);
      sizeInput.value = '';
      closeModal();
      return;
    }
    // Boutons de taille (autres pages)
    const selectedSize = document.querySelector('#mSizes .size-btn.selected');
    if (sizeBtns.length > 0 && !selectedSize) {
      const sizesEl = document.getElementById('mSizes');
      if (sizesEl) {
        sizesEl.style.outline = '1px solid #B8962E';
        setTimeout(() => { sizesEl.style.outline = ''; }, 1200);
      }
      const toast = document.getElementById('toast');
      if (toast) { toast.textContent = 'Veuillez choisir une taille'; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2000); }
      return;
    }
    const sizeLabel = selectedSize ? ' — ' + selectedSize.textContent : '';
    addToCart(name + sizeLabel, price);
    closeModal();
  };

  // Cœur — état wishlist
  const favBtn = document.getElementById('mBtnFav');
  if (favBtn) {
    const wl = JSON.parse(localStorage.getItem('msWishlist') || '[]');
    const inWl = wl.some(i => i.name === name);
    favBtn.textContent = inWl ? '❤️' : '♡';
    favBtn.title = inWl ? 'Retirer des coups de cœur' : 'Ajouter aux coups de cœur';
  }

  overlay.classList.add('open');
  sheet.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  const sheet   = document.getElementById('modalSheet');
  if (!overlay || !sheet) return;
  overlay.classList.remove('open');
  sheet.classList.remove('open');
  document.body.style.overflow = '';
}

// ── TAILLES ──
function selectSize(btn) {
  const container = btn.closest('#mSizes');
  if (!container) return;
  container.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  container.style.outline = '';
}

// ── WISHLIST (Coups de Cœur) ──
function toggleWishlistModal() {
  const { name, price, material, mono, icon, badge, brand, origPrice } = _modalCurrent;
  if (!name) return;
  let wl = JSON.parse(localStorage.getItem('msWishlist') || '[]');
  const idx = wl.findIndex(i => i.name === name);
  const favBtn = document.getElementById('mBtnFav');
  if (idx >= 0) {
    wl.splice(idx, 1);
    if (favBtn) { favBtn.textContent = '♡'; favBtn.title = 'Ajouter aux coups de cœur'; }
  } else {
    wl.push({ name, price, material, mono, icon, badge, brand, origPrice });
    if (favBtn) { favBtn.textContent = '❤️'; favBtn.title = 'Retirer des coups de cœur'; }
    const toast = document.getElementById('toast');
    if (toast) { toast.textContent = 'Ajouté aux coups de cœur'; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2200); }
  }
  localStorage.setItem('msWishlist', JSON.stringify(wl));
}

// ── LOGO 3D CANVAS (page d'accueil uniquement) ──
const canvas = document.getElementById('logoCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H, t = 0;

  function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({length: 120}, () => ({
    x: Math.random(), y: Math.random(),
    size: Math.random() * 1.8 + .3,
    speed: Math.random() * .0003 + .0001,
    opacity: Math.random() * .5 + .1,
    drift: (Math.random() - .5) * .0002
  }));

  function drawLogo3D(t) {
    const cx = W / 2, cy = H / 2;
    const scale = Math.min(W, H) * 0.55;
    const depth = Math.sin(t * .6) * 0.12;
    const tiltX = Math.sin(t * .4) * 0.08;
    ctx.save();
    ctx.translate(cx, cy);
    for (let i = 6; i >= 0; i--) {
      const offset = i * 2.5, alpha = 0.04 + i * 0.01;
      ctx.save();
      ctx.translate(offset * tiltX * 10, offset * 0.5 + depth * 20);
      ctx.globalAlpha = alpha;
      drawText(ctx, scale, '#8B6914');
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    const grad = ctx.createLinearGradient(-scale*.5, -scale*.15, scale*.5, scale*.15);
    grad.addColorStop(0, '#8B6914'); grad.addColorStop(0.2, '#C9A84C');
    grad.addColorStop(0.45, '#F5E6B8'); grad.addColorStop(0.55, '#D4AF37');
    grad.addColorStop(0.8, '#C9A84C'); grad.addColorStop(1, '#7a5c0a');
    drawText(ctx, scale, grad);
    const sweepX = Math.sin(t * .7) * scale * .8;
    const sweepGrad = ctx.createLinearGradient(sweepX - 60, -scale*.15, sweepX + 60, scale*.15);
    sweepGrad.addColorStop(0, 'rgba(255,240,180,0)');
    sweepGrad.addColorStop(.5, 'rgba(255,240,180,0.18)');
    sweepGrad.addColorStop(1, 'rgba(255,240,180,0)');
    ctx.globalCompositeOperation = 'lighter';
    drawText(ctx, scale, sweepGrad);
    ctx.globalCompositeOperation = 'source-over';
    // Sous-titre
    ctx.globalAlpha = 1;
    ctx.font = `600 ${scale * .072}px 'Cormorant Garamond', Georgia, serif`;
    ctx.letterSpacing = `${scale * .001}px`;
    ctx.fillStyle = '#C9A84C';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText("c'est la meme qualiter c'est juste le prix qui baisse", 0, scale * .12);
    ctx.globalAlpha = .3;
    ctx.strokeStyle = '#C9A84C'; ctx.lineWidth = .5;
    const lw = scale * .35;
    ctx.beginPath(); ctx.moveTo(-lw, scale * .19); ctx.lineTo(lw, scale * .19); ctx.stroke();
    ctx.restore();
  }

  function drawText(ctx, scale, fill) {
    ctx.font = `700 ${scale * .18}px 'Cormorant Garamond', Georgia, serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = fill;
    ctx.fillText('AM PRESTIGE', 0, 0);
  }

  function frame() {
    t += 0.012;
    ctx.clearRect(0, 0, W, H);
    const bg = ctx.createRadialGradient(W*.5, H*.45, 0, W*.5, H*.5, W*.32);
    bg.addColorStop(0, '#1a1408'); bg.addColorStop(.5, '#0d0d08'); bg.addColorStop(1, '#000000');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    const halo = ctx.createRadialGradient(W*.5, H*.45, 0, W*.5, H*.45, W*.18);
    halo.addColorStop(0, `rgba(201,168,76,${.08 + Math.sin(t*.5)*.03})`);
    halo.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = halo; ctx.fillRect(0, 0, W, H);
    particles.forEach(p => {
      p.y -= p.speed; p.x += p.drift;
      if (p.y < 0) { p.y = 1; p.x = Math.random(); }
      if (p.x < 0 || p.x > 1) p.drift *= -1;
      ctx.globalAlpha = p.opacity * (.5 + Math.sin(t * 2 + p.x * 10) * .3);
      ctx.fillStyle = '#C9A84C';
      ctx.beginPath(); ctx.arc(p.x * W, p.y * H, p.size, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    drawLogo3D(t);
    requestAnimationFrame(frame);
  }
  frame();
}
