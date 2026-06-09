/* ============================================================================
   Mobile nav menu toggle — keeps the primary nav links reachable on phones
   and small tablets (where .nav-links is otherwise hidden). Shared by
   index.html, products.html and xavio.html. No dependencies.
   ========================================================================== */
(function () {
  var nav = document.getElementById('nav');
  if (!nav) return;
  var btn = nav.querySelector('.nav-toggle');
  var links = nav.querySelector('.nav-links');
  if (!btn || !links) return;

  function close() {
    nav.classList.remove('menu-open');
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    var open = nav.classList.toggle('menu-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // close after choosing a destination, when tapping outside, or on Escape
  links.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('menu-open') && !nav.contains(e.target)) close();
  });
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();
