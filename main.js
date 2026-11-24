(function () {
  var root = document.documentElement;

  // Tema claro / oscuro
  document.getElementById('toggle').addEventListener('click', function () {
    var next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    // Reinicia la animación del ícono
    this.querySelectorAll('svg').forEach(function (s) { s.style.animation = 'none'; void s.offsetWidth; s.style.animation = ''; });
  });

  // Menú responsive
  var burger = document.getElementById('burger');
  var links = document.getElementById('nav-links');
  function setMenu(open) {
    links.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }
  burger.addEventListener('click', function (e) { e.stopPropagation(); setMenu(!links.classList.contains('open')); });
  links.querySelectorAll('a, button').forEach(function (el) { el.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('click', function (e) { if (!links.contains(e.target)) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  // Popup de contacto
  var modal = document.getElementById('modal');
  var form = document.getElementById('form');
  var sent = document.getElementById('sent');
  var err = document.getElementById('err');
  var lastFocus = null;
  var closeTimer = null;
  var TYPES = ['Crear un proyecto', 'Colaboración de contenido', 'Automatizar mi empresa'];
  var type = 0;

  function open() {
    clearTimeout(closeTimer);
    lastFocus = document.activeElement;
    modal.classList.remove('out');
    modal.hidden = false;
    document.body.classList.add('lock');
    setTimeout(function () { document.getElementById('f-name').focus({ preventScroll: true }); }, 700);
  }
  function close() {
    if (modal.hidden) return;
    modal.classList.add('out');
    clearTimeout(closeTimer);
    closeTimer = setTimeout(function () {
      modal.hidden = true;
      modal.classList.remove('out');
      document.body.classList.remove('lock');
      showForm();
      if (lastFocus) lastFocus.focus({ preventScroll: true });
    }, 800);
  }
  function showForm() { form.hidden = false; sent.hidden = true; err.hidden = true; }

  document.querySelectorAll('[data-open]').forEach(function (b) { b.addEventListener('click', open); });
  if (location.hash === '#hablemos') { history.replaceState(null, '', location.pathname); setTimeout(open, 300); }
  document.getElementById('close').addEventListener('click', close);
  document.getElementById('sent-close').addEventListener('click', close);
  document.getElementById('sent-reset').addEventListener('click', function () { form.reset(); selectType(0); showForm(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

  // Opciones de "¿Qué necesitas?"
  var opts = document.querySelectorAll('#opts .opt');
  function selectType(i) {
    type = i;
    opts.forEach(function (o, j) { o.setAttribute('aria-pressed', j === i ? 'true' : 'false'); });
  }
  opts.forEach(function (o, i) { o.addEventListener('click', function () { selectType(i); }); });

  // Envío: valida y abre el correo con el mensaje armado
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('f-name').value.trim();
    var email = document.getElementById('f-email').value.trim();
    var company = document.getElementById('f-company').value.trim();
    var msg = document.getElementById('f-msg').value.trim();
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      err.hidden = true; void err.offsetWidth; err.hidden = false;
      return;
    }
    var body = 'Hola Andres,\n\n' + msg + '\n\nNombre: ' + name + '\nCorreo: ' + email + (company ? '\nEmpresa: ' + company : '') + '\nNecesito: ' + TYPES[type];
    var href = 'mailto:hello@aandresdev.com?subject=' + encodeURIComponent('Proyecto: ' + TYPES[type]) + '&body=' + encodeURIComponent(body);
    window.location.href = href;
    document.getElementById('sent-name').textContent = name;
    form.hidden = true; sent.hidden = false; err.hidden = true;
  });
})();
