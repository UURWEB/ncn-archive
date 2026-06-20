(function(){
  const counter = document.querySelector('[data-counter]');
  if(counter){
    const base = 183204;
    const days = Math.floor((Date.now() - new Date('2013-04-17T00:00:00Z').getTime()) / 86400000);
    counter.textContent = String(base + Math.max(0, days * 3)).padStart(7,'0');
  }
  document.querySelectorAll('[data-dead-link]').forEach(link => link.addEventListener('click', e => {
    e.preventDefault();
    alert('Archive error: this external resource was not captured.');
  }));
})();
