function toggleDetails(id) {
  const el = document.getElementById('details-' + id);
  el.style.display = el.style.display === 'block' ? 'none' : 'block';
}