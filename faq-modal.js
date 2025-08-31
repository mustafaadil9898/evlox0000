// === FAQ modal open/close ===
document.addEventListener('click', function(e){
  const btn = e.target.closest('.faq-btn');
  if(btn){
    const link = btn.getAttribute('data-link');
    if(link==="#LINK_EVALUX") (document.getElementById('modal-evalux')||{}).style.display='flex';
    if(link==="#LINK_PAYOUTS") (document.getElementById('modal-payouts')||{}).style.display='flex';
    if(link==="#LINK_EAS") (document.getElementById('modal-eas')||{}).style.display='flex';
  }
  if(e.target.matches('[data-close]')){
    const m = e.target.closest('.faq-modal'); if(m) m.style.display='none';
  }
});
document.querySelectorAll('.faq-modal').forEach(m=>{
  m.addEventListener('click', (ev)=>{ if(ev.target===m) m.style.display='none'; });
});
