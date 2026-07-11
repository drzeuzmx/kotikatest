/* Kótica — interacciones básicas */

/* Respaldo de imágenes: si el archivo local en /img aún no existe,
   carga automáticamente la imagen original desde el CDN de Wix.
   Así el sitio SIEMPRE se ve completo, tengas o no las fotos locales. */
function imgFallback(img){
  if (img.dataset.cdn && img.src !== img.dataset.cdn){
    img.onerror = function(){ img.style.display = 'none'; }; // 2º fallo: ocultar
    img.src = img.dataset.cdn;
  } else {
    img.style.display = 'none';
  }
}

(function () {
  "use strict";

  // ---- Menú móvil ----
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ---- Reveal al hacer scroll ----
  var targets = document.querySelectorAll(
    ".valor, .dev-card, .serv-card, .dev-row, .socio"
  );
  targets.forEach(function (el) { el.classList.add("reveal"); });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add("in"); });
  }

  // ---- Formulario de contacto (AJAX a Formspree) ----
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  if (form) {
    form.addEventListener("submit", function (ev) {
      var correo = form.querySelector("#correo");
      // Validación mínima
      if (correo && !correo.checkValidity()) {
        ev.preventDefault();
        setStatus("Escribe un correo válido, por favor.", "err");
        correo.focus();
        return;
      }
      // Si no configuraste Formspree, no intentamos AJAX: dejamos el submit normal
      // o el fallback de mailto (ver LEEME.txt).
      if (form.action.indexOf("TU_ID_AQUI") !== -1) {
        ev.preventDefault();
        setStatus("Formulario en modo demo. Configura Formspree o PHP (ver LEEME.txt).", "err");
        return;
      }
      // Envío AJAX
      ev.preventDefault();
      setStatus("Enviando…", "");
      var data = new FormData(form);
      fetch(form.action, { method: "POST", body: data, headers: { Accept: "application/json" } })
        .then(function (r) {
          if (r.ok) {
            form.reset();
            setStatus("¡Gracias! Tu mensaje fue enviado. Te contactaremos pronto.", "ok");
          } else {
            setStatus("No se pudo enviar. Intenta de nuevo o escríbenos por WhatsApp.", "err");
          }
        })
        .catch(function () {
          setStatus("No se pudo enviar. Revisa tu conexión e intenta de nuevo.", "err");
        });
    });
  }
  function setStatus(msg, cls) {
    if (!status) return;
    status.textContent = msg;
    status.className = "form__status" + (cls ? " " + cls : "");
  }
})();
