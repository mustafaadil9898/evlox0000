// Initialize Vanta background
VANTA.NET({
  el: "#vanta-bg",
  color: 0xff3366,
  backgroundColor: 0x0d0d0d
});

// Challenge interaction
document.addEventListener('DOMContentLoaded', () => {
  const typeButtons = document.querySelectorAll('.challenge-tabs button');
  const sizeButtons = document.querySelectorAll('.size-tabs button');
  const panelOne = document.getElementById('rules-one');
  const panelTwo = document.getElementById('rules-two');
  const priceBtn = document.getElementById('price-btn');
  const prices = {
    one: { '5000': 54, '10000': 92, '25000': 176, '50000': 275, '100000': 549, '200000': 1049 },
    two: { '5000': 46, '10000': 76, '25000': 144, '50000': 239, '100000': 525, '200000': 999 }
  };
  let currentType = 'two';
  let currentSize = '5000';

  function updateDisplay() {
    typeButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.type === currentType));
    sizeButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.size === currentSize));
    panelOne.style.display = currentType === 'one' ? 'block' : 'none';
    panelTwo.style.display = currentType === 'two' ? 'flex' : 'none';
    priceBtn.textContent = '$' + prices[currentType][currentSize];
  }

  typeButtons.forEach(btn => btn.addEventListener('click', () => {
    currentType = btn.dataset.type;
    updateDisplay();
  }));
  sizeButtons.forEach(btn => btn.addEventListener('click', () => {
    currentSize = btn.dataset.size;
    updateDisplay();
  }));

  updateDisplay();

  // FAQ accordion
  document.querySelectorAll('.accordion-item').forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    header.addEventListener('click', () => {
      const isActive = header.classList.contains('active');
      document.querySelectorAll('.accordion-header').forEach(h => h.classList.remove('active'));
      document.querySelectorAll('.accordion-content').forEach(c => c.style.maxHeight = null);
      if (!isActive) {
        header.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
});
