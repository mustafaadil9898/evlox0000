
// ===== Local storage mini store =====
const store = {
  seed(){
    const seeded = localStorage.getItem('evalux_seed_bundle');
    if(!seeded){
      const admin = {
        id:'u_admin', name:'Admin',
        email:'admin@evalux.local',
        user:'mkk90mk90', pass:'yoyo200',
        role:'admin'
      };
      localStorage.setItem('evalux_users', JSON.stringify([admin]));
      localStorage.setItem('evalux_payments', JSON.stringify([]));
      localStorage.setItem('evalux_accounts', JSON.stringify([]));
      localStorage.setItem('evalux_seed_bundle','1');
    }
  },
  users(){ return JSON.parse(localStorage.getItem('evalux_users')||'[]') },
  saveUsers(list){ localStorage.setItem('evalux_users', JSON.stringify(list)) },
  payments(){ return JSON.parse(localStorage.getItem('evalux_payments')||'[]') },
  savePayments(list){ localStorage.setItem('evalux_payments', JSON.stringify(list)) },
  accounts(){ return JSON.parse(localStorage.getItem('evalux_accounts')||'[]') },
  saveAccounts(list){ localStorage.setItem('evalux_accounts', JSON.stringify(list)) },
  session(){ return JSON.parse(localStorage.getItem('evalux_session')||'null') },
  setSession(u){ localStorage.setItem('evalux_session', JSON.stringify(u)) },
  clearSession(){ localStorage.removeItem('evalux_session') }
};

// ===== Pricing model =====
const PRICES = {
  one: {5000:116, 10000:196, 25000:365, 50000:578, 100000:1090, 200000:2040},
  two: {5000:96,  10000:176, 25000:335, 50000:528, 100000:980,  200000:1880}
};

// ===== Helpers =====
const $ = (q,root=document)=>root.querySelector(q);
const $$ = (q,root=document)=>Array.from(root.querySelectorAll(q));
const fmtUSD = n => `$${Number(n).toLocaleString()}`;

// ===== Common header builder =====
function buildHeader(active=''){
  const header = document.createElement('header');
  header.innerHTML = `
  <div class="container nav">
    <a href="index.html" class="brand"><span class="brand-badge"><b>E</b></span> Evalux</a>
    <nav class="links">
      <a href="index.html#packages">Packages</a>
      <a href="index.html#rules">Rules</a>
      <a href="index.html#faq">FAQ</a>
    </nav>
    <div class="grow"></div>
    <div class="cta">
      <a class="btn primary" id="btnLogin" href="login.html">Login</a>
      <a class="btn dark" id="btnSignup" href="register.html">Sign Up</a>
      <a class="btn ghost" id="btnAdmin" href="admin-login.html">Admin Login</a>
    </div>
  </div>`;
  document.body.prepend(header);
}

// ===== Footer builder =====
function buildFooter(){
  const f = document.createElement('footer');
  f.innerHTML = `
  <div class="container center">© <span id="year"></span> Evalux Funding • support: <a href="mailto:evaluxfunding@gmail.com">evaluxfunding@gmail.com</a></div>
  <div class="social">
    <a class="icon-btn" href="https://www.instagram.com/evaluxfunding?igsh=c21ieTk4azg5dTJs&utm_source=qr" target="_blank" title="Instagram" aria-label="Instagram">
      <svg class="icon" viewBox="0 0 24 24"><path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10zm-5 3a5 5 0 1 0 .001 10.001A5 5 0 0 0 12 7zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm4.75-2.75a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5z"/></svg>
    </a>
    <a class="icon-btn" href="https://x.com/evaluxfunding?s=21" target="_blank" title="X (Twitter)" aria-label="X">
      <svg class="icon" viewBox="0 0 24 24"><path d="M3 3h3.7l5.1 7 5.6-7H21l-7.2 9.1L21 21h-3.7l-5.4-7.5L6 21H3l7.8-9.9L3 3z"/></svg>
    </a>
    <a class="icon-btn" href="https://t.me/Evaluxfunding" target="_blank" title="Telegram" aria-label="Telegram">
      <svg class="icon" viewBox="0 0 24 24"><path d="M9.04 15.29 8.9 19.1c.4 0 .58-.17.8-.37l1.93-1.85 4.01 2.94c.74.41 1.26.2 1.46-.69l2.65-12.43.01-.01c.24-1.13-.41-1.58-1.12-1.31L3.73 9.5c-1.09.43-1.07 1.03-.19 1.3l4.39 1.37 10.18-6.42c.48-.3.91-.14.55.17"/></svg>
    </a>
    <a class="icon-btn" href="https://t.me/evaluxSupport" target="_blank" title="Support" aria-label="Telegram Support">
      <svg class="icon" viewBox="0 0 24 24"><path d="M9.04 15.29 8.9 19.1c.4 0 .58-.17.8-.37l1.93-1.85 4.01 2.94c.74 .41 1.26 .2 1.46 -.69l2.65 -12.43 .01 -.01c.24 -1.13 -.41 -1.58 -1.12 -1.31L3.73 9.5c-1.09 .43 -1.07 1.03 -.19 1.3l4.39 1.37 10.18 -6.42c.48 -.3 .91 -.14 .55 .17"/></svg>
    </a>
  </div>`;
  document.body.appendChild(f);
  $('#year').textContent = new Date().getFullYear();
}

// ===== Auth helpers =====
function requireUser(){
  const s = store.session();
  if(!s || s.role!=='user'){ location.href='login.html'; }
}
function requireAdmin(){
  const s = store.session();
  if(!s || s.role!=='admin'){ location.href='admin-login.html'; }
}

// ===== Pages =====
function initIndex(){
  store.seed();
  buildHeader('home'); buildFooter();
  // Quick buy
  const qbMode = $('#qbMode'), qbSize=$('#qbSize'), qbPrice=$('#qbPrice');
  function updateQB(){ qbPrice.textContent = fmtUSD(PRICES[qbMode.value][qbSize.value]); }
  qbMode.addEventListener('change', updateQB);
  qbSize.addEventListener('change', updateQB);
  updateQB();
  $('#qbCheckout').addEventListener('click', (e)=>{
    const mode = qbMode.value, size=qbSize.value, price=PRICES[mode][size];
    $('#coPackage').value = `${Number(size).toLocaleString()} ${mode==='one'?'One‑Step':'Two‑Step'}`;
    $('#coAmount').value = price;
  });

  // Build packages
  function build(mode='one'){
    const grid = $('#pkgGrid'); grid.innerHTML='';
    Object.entries(PRICES[mode]).forEach(([size,price])=>{
      const card = document.createElement('div'); card.className='card';
      card.innerHTML = `
        <span class="badge">${mode==='one'?'One‑Step':'Two‑Step'}</span>
        <div class="meta"><div class="price">${fmtUSD(price)}</div><div class="size">${Number(size).toLocaleString()} Account</div></div>
        <ul>
          <li>${mode==='one'?'Target 10%':'Phase 1: 5% • Phase 2: 8%'}</li>
          <li>Daily DD 5% • Max DD 10%</li>
          <li>Profit split up to 80%</li>
        </ul>
        <a href="#checkout" class="btn primary" data-buy data-mode="${mode}" data-size="${size}" data-price="${price}">Buy with Crypto</a>
      `;
      grid.appendChild(card);
    });
  }
  build('one');
  $$('#packages .mode button').forEach(b=>b.addEventListener('click',()=>{
    $$('#packages .mode button').forEach(x=>x.classList.remove('is-active'));
    b.classList.add('is-active'); build(b.dataset.mode);
  }));

  // Submit receipt
  $('#receiptForm').addEventListener('submit',(ev)=>{
    ev.preventDefault();
    const ses = store.session();
    if(!ses || ses.role!=='user'){ alert('Please login first.'); location.href='login.html'; return; }
    const file = $('#rcpt').files[0];
    if(!file){ alert('Upload a receipt screenshot'); return; }
    const reader = new FileReader();
    reader.onload = ()=>{
      const payments = store.payments();
      payments.unshift({
        id: 'p_'+Date.now(),
        user: ses.email,
        pkg: $('#coPackage').value,
        amount: Number($('#coAmount').value),
        coin: $('#coin').value,
        chain: $('#chain').value,
        address: $('#dest').value,
        txid: $('#txid').value.trim(),
        note: $('#note').value.trim(),
        screenshot: reader.result,
        status: 'pending',
        created: new Date().toISOString()
      });
      store.savePayments(payments);
      alert('Submitted. You can track status in Dashboard.');
      location.href='dashboard.html';
    };
    reader.readAsDataURL(file);
  });

  // Copy address
  $('#copyAddr').addEventListener('click', ()=>{ navigator.clipboard.writeText($('#dest').value); const btn=$('#copyAddr'); btn.textContent='Copied'; setTimeout(()=>btn.textContent='Copy',1000); });
}

function initLogin(){
  store.seed(); buildHeader('login'); buildFooter();
  $('#loginForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = $('#lemail').value.trim();
    const pass = $('#lpass').value;
    const u = store.users().find(x=>x.email.toLowerCase()===email.toLowerCase() && x.pass===pass && x.role!=='admin');
    if(!u) return alert('Invalid credentials');
    store.setSession({id:u.id,email:u.email,name:u.name,role:u.role});
    location.href='dashboard.html';
  });
}

function initRegister(){
  store.seed(); buildHeader('register'); buildFooter();
  $('#signupForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const name=$('#rname').value.trim(), email=$('#remail').value.trim(), pass=$('#rpass').value;
    const users=store.users();
    if(users.find(x=>x.email.toLowerCase()===email.toLowerCase())) return alert('Email already registered');
    const u = {id:`u_${Date.now()}`, name, email, pass, role:'user'};
    users.push(u); store.saveUsers(users);
    store.setSession({id:u.id,email:u.email,name:u.name,role:u.role});
    location.href='dashboard.html';
  });
}

function initDashboard(){
  store.seed(); buildHeader(''); buildFooter(); requireUser();
  const ses = store.session();
  $('#welcome').textContent = ses?.email || '';
  renderUserTables();
}

function renderUserTables(){
  const ses = store.session(); if(!ses) return;
  const pays = store.payments().filter(p=>p.user===ses.email);
  const accs = store.accounts().filter(a=>a.user.toLowerCase()===ses.email.toLowerCase());
  const tbodyP = $('#myPayments tbody'); tbodyP.innerHTML='';
  pays.forEach(p=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${new Date(p.created).toLocaleString()}</td><td>${p.pkg}</td><td>${fmtUSD(p.amount)}</td><td>${p.coin}</td><td>${p.chain}</td><td><span class="pill ${p.status}">${p.status}</span></td>`;
    tbodyP.appendChild(tr);
  });
  const tbodyA = $('#myAccounts tbody'); tbodyA.innerHTML='';
  accs.forEach(a=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${a.platform}</td><td>${a.server}</td><td>${a.login}</td><td>${a.investor}</td><td>${a.status}</td><td>${a.note||''}</td>`;
    tbodyA.appendChild(tr);
  });
}

function initAdminLogin(){
  store.seed(); buildHeader(''); buildFooter();
  $('#adminForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const user = $('#auser').value.trim();
    const pass = $('#apass').value;
    const u = store.users().find(x=>x.user===user && x.pass===pass && x.role==='admin');
    if(!u) return alert('Invalid admin credentials');
    store.setSession({id:u.id,email:u.email,name:u.name,role:u.role});
    location.href='admin-dashboard.html';
  });
}

function initAdminDashboard(){
  store.seed(); buildHeader(''); buildFooter(); requireAdmin();
  renderAdmin();
  $('#admin').addEventListener('click', (ev)=>{
    const t = ev.target.closest('button'); if(!t) return;
    const id = t.dataset.approve||t.dataset.reject; if(!id) return;
    const pays = store.payments(); const idx = pays.findIndex(p=>p.id===id); if(idx<0) return;
    pays[idx].status = t.dataset.approve? 'approved' : 'rejected';
    store.savePayments(pays); renderAdmin();
  });
  $('#acctForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const acc = {
      user: $('#acctEmail').value.trim(),
      platform: $('#acctPlatform').value,
      server: $('#acctServer').value.trim(),
      login: $('#acctLogin').value.trim(),
      investor: $('#acctInvestor').value.trim(),
      status: $('#acctStatus').value,
      note: $('#acctNote').value.trim(),
      updated: new Date().toISOString()
    };
    if(!acc.user || !acc.server || !acc.login || !acc.investor){
      alert('Fill all required fields'); return;
    }
    const list = store.accounts();
    const idx = list.findIndex(a=>a.user.toLowerCase()===acc.user.toLowerCase() && a.login===acc.login);
    if(idx>=0) list[idx] = acc; else list.unshift(acc);
    store.saveAccounts(list);
    renderAdmin();
    e.target.reset();
    alert('Account saved/updated');
  });
}

function renderAdmin(){
  const users=store.users(); const pays=store.payments(); const accs=store.accounts();
  // Users
  const uBody = $('#admUsers tbody'); if(uBody){ uBody.innerHTML=''; users.forEach(u=>{ const tr=document.createElement('tr'); tr.innerHTML=`<td>${u.email}</td><td>${u.name||'-'}</td><td>${u.role}</td>`; uBody.appendChild(tr); }); }
  // Pending/History
  const pT=$('#admPending tbody'), hT=$('#admHistory tbody');
  if(pT&&hT){
    const pending=pays.filter(p=>p.status==='pending'); const history=pays.filter(p=>p.status!=='pending');
    pT.innerHTML=''; pending.forEach(p=>{ const tr=document.createElement('tr');
      tr.innerHTML=`<td>${new Date(p.created).toLocaleString()}</td><td>${p.user}</td><td>${p.pkg}</td><td>${fmtUSD(p.amount)}</td><td>${p.coin}</td><td>${p.chain}</td><td><a href="${p.screenshot}" target="_blank">View</a></td><td>${p.txid?'<span title="TX hash saved">yes</span>':'—'}</td><td class="adm-actions"><button class="btn" data-approve="${p.id}">Approve</button><button class="btn ghost" data-reject="${p.id}">Reject</button></td>`;
      pT.appendChild(tr);
    });
    hT.innerHTML=''; history.forEach(p=>{ const tr=document.createElement('tr');
      tr.innerHTML=`<td>${new Date(p.created).toLocaleString()}</td><td>${p.user}</td><td>${p.pkg}</td><td>${fmtUSD(p.amount)}</td><td><span class="pill ${p.status}">${p.status}</span></td>`; hT.appendChild(tr);
    });
  }
  // Accounts
  const adminAcc=$('#admAccounts tbody'); if(adminAcc){ adminAcc.innerHTML=''; accs.forEach(a=>{ const tr=document.createElement('tr'); tr.innerHTML=`<td>${a.user}</td><td>${a.platform}</td><td>${a.server}</td><td>${a.login}</td><td>${a.status}</td><td>${a.note||''}</td>`; adminAcc.appendChild(tr); }); }
}

// Page bootstrapper
document.addEventListener('DOMContentLoaded', ()=>{
  const page = document.body.dataset.page;
  ({index:initIndex, login:initLogin, register:initRegister, dashboard:initDashboard, 'admin-login':initAdminLogin, 'admin-dashboard':initAdminDashboard}[page]||(()=>{}))();
});
