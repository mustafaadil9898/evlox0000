// ===== App JS (no external deps) =====
(function(){
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

  // Mobile nav
  const burger = $('.burger');
  const mobileNav = $('#mobileNav');
  if (burger && mobileNav){
    burger.addEventListener('click', ()=>{
      const open = mobileNav.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });
    $$('#mobileNav a').forEach(a=>a.addEventListener('click', ()=>{
      mobileNav.classList.remove('open');
      burger.setAttribute('aria-expanded','false');
    }));
  }

  // Year
  const y = $('#year');
  if (y) y.textContent = new Date().getFullYear();

  // Packages
  const packages = {
    one: [
      {size: 5000, price: 65, badge: "Starter"},
      {size: 10000, price: 111, badge: "Popular"},
      {size: 25000, price: 220},
      {size: 50000, price: 314},
      {size: 100000, price: 654},
      {size: 200000, price: 1099}
    ],
    two: [
      {size: 5000, price: 58, badge: "Value"},
      {size: 10000, price: 98},
      {size: 25000, price: 178, badge: "Popular"},
      {size: 50000, price: 289},
      {size: 100000, price: 545},
      {size: 200000, price: 1020}
    ]
  };

  const grid = $('#packageGrid');
  const buybar = $('#buybar');
  const toTop = $('#toTop');

  function fmtSize(n){
    if (n>=1000) return (n/1000)+'K';
    return String(n);
  }

  function render(mode='one'){
    if (!grid) return;
    grid.innerHTML = '';
    (packages[mode]||[]).forEach((p,i)=>{
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
        <div class="meta"><div class="price">$${p.price}</div><div class="size">${fmtSize(p.size)} Challenge</div></div>
        <ul>
          <li>${mode==='one' ? 'Target 10%' : 'Target 5% + 8%'}</li>
          <li>Daily DD 5% • Max DD 10%</li>
          <li>Payout up to 80%</li>
        </ul>
        <a class="btn btn--primary sheen" href="pay-crypto.html?step=${mode}&size=${p.size}">Buy ${fmtSize(p.size)}</a>
      `;

      const url = `pay-crypto.html?step=${mode}&size=${p.size}`;
      card.setAttribute('role','button');
      card.setAttribute('tabindex','0');
      card.style.cursor = 'pointer';
      card.addEventListener('click', ()=>{ location.href = url });
      card.addEventListener('keypress', (e)=>{ if(e.key==='Enter'){ location.href = url } });
      grid.appendChild(card);
    });

    // Update quick buy
    const quick = $('#quickBuyBtn');
    if (quick) quick.href = `pay-crypto.html?step=${mode}&size=10000`;
  }

  // Mode toggle
  $$('.mode-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      $$('.mode-btn').forEach(b=>b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const mode = btn.dataset.mode;
      render(mode);
      // Sync buybar toggle
      $$('#buybar .toggle button').forEach(b=>{
        const pressed = (b.dataset.mode===mode);
        b.classList.toggle('is-active', pressed);
        b.setAttribute('aria-pressed', String(pressed));
      });
    });
  });

  $$('#buybar .toggle button').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      $$('#buybar .toggle button').forEach(b=>b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const mode = btn.dataset.mode;
      render(mode);
    });
  });

  // Initial render
  render('one');

  // Show buybar & back-to-top after some scroll
  const onScroll = ()=>{
    const sc = window.scrollY || document.documentElement.scrollTop;
    if (buybar) buybar.classList.toggle('show', sc > 480);
    if (toTop) toTop.classList.toggle('show', sc > 480);
  };
  window.addEventListener('scroll', onScroll);
  onScroll();
  if (toTop) toTop.addEventListener('click', ()=>window.scrollTo({top:0, behavior:'smooth'}));

  // FAQ accordion
  $$('.faq-item').forEach(it=>{
    const btn = it.querySelector('button');
    const ans = it.querySelector('.a');
    btn.addEventListener('click', ()=>{
      it.classList.toggle('open');
      ans.classList.toggle('open');
      const expanded = it.classList.contains('open');
      btn.setAttribute('aria-expanded', String(expanded));
    });
  });

  // Simulator
  const size = $('#accountSize');
  const sizeOut = $('#sizeOut');
  const profit = $('#profitInput');
  const res = $('.calc-result');

  function updateSim(){
    const sz = parseInt(size.value, 10);
    const pf = parseFloat(profit.value || 0);
    if (sizeOut) sizeOut.textContent = (sz/1000)+'K';
    const share = Math.max(0, Math.round(pf * 0.8));
    if (res) res.innerHTML = `You receive <strong>$${share}</strong> (80%)`;
  }
  if (size && profit){
    size.addEventListener('input', updateSim);
    profit.addEventListener('input', updateSim);
    updateSim();
  }
})();
/* CURSOR FOLLOWER */
(function(){
  try{
    const root = document.body;
    const dot = document.createElement('div');
    const glow = document.createElement('div');
    dot.className = 'cursor-follower';
    glow.className = 'cursor-glow';
    root.appendChild(glow);
    root.appendChild(dot);

    let tx = -9999, ty = -9999; // target (mouse)
    let x = tx, y = ty;         // current (lerped)
    let hideTimer = null;

    const lerp = (a,b,t)=>a+(b-a)*t;
    const move = ()=>{
      x = lerp(x, tx, 0.18);
      y = lerp(y, ty, 0.18);
      dot.style.transform = `translate(${x-6}px, ${y-6}px)`;
      glow.style.transform = `translate(${x-22}px, ${y-22}px)`;
      requestAnimationFrame(move);
    };
    move();

    const show = ()=>{ dot.classList.remove('cursor-hide'); glow.classList.remove('cursor-hide'); };
    const scheduleHide = ()=>{
      clearTimeout(hideTimer);
      hideTimer = setTimeout(()=>{ dot.classList.add('cursor-hide'); glow.classList.add('cursor-hide'); }, 1200);
    };

    const onMove = (clientX, clientY)=>{
      tx = clientX; ty = clientY; show(); scheduleHide();
    };

    window.addEventListener('mousemove', (e)=> onMove(e.clientX, e.clientY), {passive:true});
    window.addEventListener('touchmove', (e)=>{
      if (e.touches && e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY);
    }, {passive:true});
    window.addEventListener('scroll', scheduleHide, {passive:true});
  }catch(err){ /* ignore */ }
})();
