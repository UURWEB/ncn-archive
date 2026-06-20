(function(){
  const counter = document.querySelector('[data-counter]');
  if(counter){
    counter.textContent = '0183204';
  }
  document.querySelectorAll('[data-dead-link]').forEach(link => link.addEventListener('click', e => {
    e.preventDefault();
    alert('Archive error: this external resource was not captured.');
  }));
})();
