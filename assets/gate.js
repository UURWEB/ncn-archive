(function () {
  const required = Number(document.body.dataset.clearance || 0);
  const level = Number(localStorage.getItem('ncn_archive_clearance') || 0);
  const content = document.getElementById('gated-content');
  const denied = document.getElementById('access-denied');
  const badge = document.querySelector('[data-current-clearance]');
  if (badge) badge.textContent = String(level);
  if (level >= required) {
    if (content) content.hidden = false;
    if (denied) denied.hidden = true;
  } else {
    if (content) content.hidden = true;
    if (denied) denied.hidden = false;
  }
})();
