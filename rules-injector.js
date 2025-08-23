
/*! rules-injector.js — adds Rules & FAQ accordion without editing HTML structure */
(function(){
  const css = `
    .acc{display:grid;gap:10px}
    .acc-hd{
      width:100%; text-align:left; padding:14px 16px; border-radius:14px; font-weight:600; cursor:pointer;
      background:linear-gradient(180deg,rgba(14,19,25,.72),rgba(6,9,13,.78));
      border:1px solid var(--border,#1c232b); color:#e5e7eb;
    }
    .acc-hd::after{content:"▾"; float:right; opacity:.7; transition:transform .2s}
    .acc-hd.active::after{transform:rotate(180deg)}
    .acc-bd{
      display:none; padding:14px 16px; border-radius:12px; line-height:1.6;
      background:rgba(10,14,20,.6); border:1px dashed rgba(201,58,58,.25);
    }
    .acc-bd.show{display:block}
  `;
  const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  const html = `
    <section id="rules" class="section-pad">
      <div class="container">
        <header class="section-head">
          <h2 class="display-sm">Rules &amp; FAQ</h2>
          <div class="neon-line" aria-hidden="true"></div>
        </header>
        <div class="acc">
          <button class="acc-hd">What exactly is Evalux?</button>
          <div class="acc-bd"><p>Evalux provides a trader evaluation service (prop challenge). We are not a broker and we don’t execute real market orders.</p></div>
          <button class="acc-hd">How fast are payouts?</button>
          <div class="acc-bd"><p>Once the conditions are met and your account passes review, typical processing is within <strong>24–72 business hours</strong>.</p></div>
          <button class="acc-hd">Are EAs/algos allowed?</button>
          <div class="acc-bd"><p>Yes, as long as strategies are legal, non‑abusive, and respect our risk/news policies.</p></div>
          <button class="acc-hd">Can I trade during high‑impact news?</button>
          <div class="acc-bd"><p>Permitted depending on the challenge type. Some products restrict opening new positions <strong>2–5 minutes</strong> around red‑news events.</p></div>
          <button class="acc-hd">What are the daily and overall drawdown rules?</button>
          <div class="acc-bd"><p>Standard models cap daily loss (e.g., <strong>5%</strong>) and max relative drawdown (e.g., <strong>10%</strong>). See the Rulebook for exact figures.</p></div>
          <button class="acc-hd">Which payment methods are available?</button>
          <div class="acc-bd"><p><strong>USDT — TRC20 only.</strong> After payment, upload a screenshot and paste your TX hash or explorer link for admin review.</p></div>
          <button class="acc-hd">Do you require KYC?</button>
          <div class="acc-bd"><p>Yes — a quick KYC/AML check is required before payouts for compliance and security.</p></div>
        </div>
      </div>
    </section>
  `;
  function inject(){
    if(document.getElementById('rules')) return;
    const container = document.querySelector('main') || document.body;
    const wrap = document.createElement('div');
    wrap.innerHTML = html;
    container.appendChild(wrap.firstElementChild);

    // toggle
    const heads = document.querySelectorAll('.acc-hd');
    heads.forEach(h=>{
      h.addEventListener('click', ()=>{
        const was = h.classList.contains('active');
        document.querySelectorAll('.acc-hd').forEach(x=>x.classList.remove('active'));
        document.querySelectorAll('.acc-bd').forEach(x=>x.classList.remove('show'));
        if(!was){
          h.classList.add('active');
          const bd = h.nextElementSibling;
          if(bd && bd.classList.contains('acc-bd')) bd.classList.add('show');
        }
      });
    });
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', inject); } else { inject(); }
})();
