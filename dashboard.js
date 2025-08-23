(function(){
  const KEY = 'evalux_dashboard';
  const H12 = 12 * 60 * 60 * 1000;

  const defaults = {
    updatedAt: new Date().toISOString(),
    metrics: [
      {label:'Active funded accounts', value:128,  delta:'+6.4% ↑'},
      {label:'Payouts last 7d (USD)', value:48250, delta:'+12.3% ↑'},
      {label:'Avg. win rate',         value:58,    delta:'+2.1% ↑', unit:'%'},
      {label:'Avg. profit factor',    value:1.72,  delta:'+0.08 ↑'}
    ],
    // Trading-focused series
    dailyProfit: [820, -240, 1340, 980, -120, 760, 2210],   // last 7 sessions, USD
    weeklyPayouts: [6.2, 8.4, 10.1, 7.8, 9.6, 11.4, 12.8],  // last 7 weeks, in $k
    assets: [
      {label:'XAUUSD', value:36.5},
      {label:'US30',   value:28.0},
      {label:'NAS100', value:18.5},
      {label:'EURUSD', value:17.0}
    ]
  };

  function read(){
    try { return JSON.parse(localStorage.getItem(KEY)) || defaults; } catch { return defaults; }
  }
  function fmt(n){
    if (typeof n === 'number'){
      if (n >= 1_000_000) return (n/1_000_000).toFixed(1)+'M';
      if (n >= 1_000) return (n/1_000).toFixed(1)+'K';
      return String(n);
    }
    return String(n);
  }
  function putKPIs(d){
    const kpis = document.getElementById('kpis');
    kpis.innerHTML = '';
    d.metrics.forEach(m=>{
      const card = document.createElement('div');
      card.className = 'card kpi';
      card.innerHTML = `<h4>${m.label}</h4><div class="num">${m.label.includes('Payouts')?'$':''}${fmt(m.unit==='%'? (m.value)+'%': m.value)}${m.unit==='%'?'%':''}</div><div class="delta">${m.delta}</div>`;
      kpis.appendChild(card);
    });
  }

  function barChart(canvas, vals, labels){
    const ctx = canvas.getContext('2d');
    const W = canvas.width = canvas.clientWidth * devicePixelRatio;
    const H = canvas.height = canvas.clientHeight * devicePixelRatio;
    const pad = 28 * devicePixelRatio;
    const max = Math.max(...vals) * 1.1;
    const n = vals.length;
    const bw = (W - pad*2) / n * 0.6;
    ctx.clearRect(0,0,W,H);
    // axes (subtle)
    ctx.strokeStyle = 'rgba(200,200,200,0.08)';
    ctx.lineWidth = 1;
    for(let i=0;i<=4;i++){
      const y = pad + (H-pad*2) * (i/4);
      ctx.beginPath(); ctx.moveTo(pad,y); ctx.lineTo(W-pad,y); ctx.stroke();
    }
    // bars
    vals.forEach((v,i)=>{
      const x = pad + (W - pad*2) * (i/n) + (bw*0.3);
      const h = (H - pad*2) * (v/max);
      const y = H - pad - h;
      // base bar
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.fillRect(x, H-pad-(H-pad*2)*0.9, bw, (H-pad*2)*0.9);
      // value bar (accent)
      ctx.fillStyle = 'rgba(239,68,68,0.9)';
      ctx.fillRect(x, y, bw, h);
    });
  }

  function donutChart(canvas, items){
    const ctx = canvas.getContext('2d');
    const W = canvas.width = canvas.clientWidth * devicePixelRatio;
    const H = canvas.height = canvas.clientHeight * devicePixelRatio;
    const R = Math.min(W,H)/2 - 10*devicePixelRatio;
    const cx = W/2, cy = H/2;
    const total = items.reduce((s,x)=>s+x.value,0);
    const palette = ['#ef4444','#f59e0b','#10b981','#6366f1'];
    let a = -Math.PI/2;
    ctx.clearRect(0,0,W,H);
    items.forEach((it,idx)=>{
      const ang = (it.value/total)*Math.PI*2;
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,R,a,a+ang); ctx.closePath();
      ctx.fillStyle = palette[idx%palette.length] + 'cc'; ctx.fill();
      a += ang;
    });
    // hole
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath(); ctx.arc(cx,cy,R*0.6,0,Math.PI*2); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }

  function updateFreshness(tIso){
    const upd = document.getElementById('updatedAt');
    const next = document.getElementById('nextDue');
    const badge = document.getElementById('freshBadge');
    const t = new Date(tIso).getTime();
    const now = Date.now();
    const due = t + H12;
    upd.textContent = new Date(t).toLocaleString();
    next.textContent = new Date(due).toLocaleString();
    const fresh = now < due;
    badge.textContent = fresh ? 'Fresh' : 'Stale';
    badge.classList.toggle('fresh', fresh);
    badge.classList.toggle('stale', !fresh);
  }

  function render(){
    const d = read();
    putKPIs(d);
    barChart(document.getElementById('mortgage'), d.dailyProfit, []);
    donutChart(document.getElementById('donut'), d.assets);
    barChart(document.getElementById('weekly'), d.weeklyPayouts.map(x=>x*1000), []);
    updateFreshness(d.updatedAt);
  }

  window.addEventListener('storage', (e)=>{ if(e.key===KEY){ render(); } });
  render();
})();