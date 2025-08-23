
/*! price-override.js v17 — only updates prices; no other changes */
(function(){
  const ONE = {5000:65,10000:111,25000:220,50000:314,100000:654,200000:1099};
  const TWO = {5000:58,10000:98,25000:178,50000:289,100000:545,200000:1020};
  const fmt = n => '$' + Number(n).toLocaleString('en-US');
  const parseK = txt => { const m = String(txt||'').match(/(\d+)\s*K/i); return m ? parseInt(m[1],10)*1000 : null; };

  function updateTables(){
    const sections = document.querySelectorAll('section, .section, .card, .box');
    sections.forEach(sec=>{
      const title = (sec.querySelector('h2,h3,h4')||{}).textContent||'';
      const isOne = /One[-\s]?Step|خطوة واحدة/i.test(title);
      const isTwo = /Two[-\s]?Step|خطوتين/i.test(title);
      if(!isOne && !isTwo) return;
      const MAP = isOne ? ONE : TWO;
      const rows = sec.querySelectorAll('tr');
      rows.forEach(row=>{
        const cols = row.querySelectorAll('td,th');
        if(cols.length<2) return;
        if (row.querySelector('th')) return;
        let sizeCol=1, priceCol=0; // [price,size]
        const sizeTxt = (cols[sizeCol]||{}).textContent||'';
        const size = parseK(sizeTxt);
        if(!size || !MAP[size]) return;
        if (cols[priceCol]) cols[priceCol].textContent = fmt(MAP[size]);
      });
    });
  }

  function updateCardsAndButtons(){
    const upd = (el, size, step)=>{
      const MAP = step==='two' ? TWO : ONE;
      if(MAP[size]) el.textContent = el.textContent.replace(/\$\s*\d[\d,]*/g, fmt(MAP[size]));
    };
    document.querySelectorAll('[data-size][data-step], .package-card, .pack').forEach(card=>{
      const size = parseInt(card.getAttribute('data-size')||'0',10) || parseK(card.textContent);
      const step = (card.getAttribute('data-step')||'').toLowerCase().includes('two') ? 'two' : 'one';
      if(!size) return;
      card.querySelectorAll('button, .price, .btn, .cta').forEach(el=> upd(el, size, step));
    });
  }

  function updateHiddenJSMaps(){
    window.pricesOne = Object.assign({}, window.pricesOne||{}, {5000:65,10000:111,25000:220,50000:314,100000:654,200000:1099});
    window.pricesTwo = Object.assign({}, window.pricesTwo||{}, {5000:58,10000:98,25000:178,50000:289,100000:545,200000:1020});
  }

  function run(){ try{ updateTables(); updateCardsAndButtons(); updateHiddenJSMaps(); }catch(e){} }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', run); } else { run(); }
})();
