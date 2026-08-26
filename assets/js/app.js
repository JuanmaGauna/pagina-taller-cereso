import { categoriasGaleria, obrasGaleria } from './galeria-data.js';

if (window.lucide) {
  window.lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', () => {
  setupGoogleBusinessSimulation();
  setupRegistrationForm();
  setupGalleryFilters();
  setupBotonVolverArriba();
});

/**
 * Gestión de la ficha de Google Business simulada
 */
function setupGoogleBusinessSimulation() {
  const btnOpinion = document.getElementById('btn-opinion');
  const btnGuardar = document.getElementById('btn-guardar');
  const btnCompartir = document.getElementById('btn-compartir');
  const iconGuardar = document.getElementById('icon-guardar');

  let isSaved = false;

  if (btnOpinion) {
    btnOpinion.addEventListener('click', () => {
      const contactSection = document.getElementById('contacto');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (btnGuardar && iconGuardar) {
    btnGuardar.addEventListener('click', () => {
      isSaved = !isSaved;
      if (isSaved) {
        iconGuardar.classList.add('fill-current');
        btnGuardar.querySelector('span').innerText = 'Guardado';
      } else {
        iconGuardar.classList.remove('fill-current');
        btnGuardar.querySelector('span').innerText = 'Guardar';
      }
    });
  }

  if (btnCompartir) {
    btnCompartir.addEventListener('click', () => {
      const shareUrl = window.location.href;
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('🎨 ¡Enlace del Taller copiado con éxito! Compartílo con otras familias.');
      }).catch(err => {
        console.error('Error al intentar copiar el enlace: ', err);
      });
    });
  }
}

let obrasVisibles = obrasGaleria;
let indiceLightboxActual = 0;

const FOTOS_POR_PAGINA = 9;
let fotosVisiblesCount = FOTOS_POR_PAGINA;

/**
 * Genera dinámicamente los botones de filtro y las tarjetas de la
 * Galería Creativa a partir de assets/js/galeria-data.js. Muestra las
 * fotos de a tandas (paginado con "Cargar más") para no abrumar con
 * todas las fotos de una sola vez. Al hacer clic en una foto, abre el
 * lightbox navegable (carrusel) dentro de la categoría filtrada.
 */
function setupGalleryFilters() {
  const filtrosContenedor = document.getElementById('gallery-filtros');
  const grid = document.getElementById('gallery-grid');
  const cargarMasContenedor = document.getElementById('gallery-cargar-mas-contenedor');
  if (!filtrosContenedor || !grid) return;

  filtrosContenedor.innerHTML = categoriasGaleria.map((cat, index) => `
    <button class="gallery-filter-btn px-4 py-2 rounded-full border-2 border-pizarra text-sm font-bold transition-all ${index === 0 ? 'bg-pizarra text-white active' : 'bg-white text-pizarra hover:bg-crema'}" data-filter="${cat.id}">${cat.etiqueta}</button>
  `).join('');

  function renderGrid(filtro) {
    obrasVisibles = filtro === 'todos' ? obrasGaleria : obrasGaleria.filter(o => o.categoria === filtro);
    fotosVisiblesCount = FOTOS_POR_PAGINA;
    pintarTarjetas();
  }

  function pintarTarjetas() {
    const obrasAMostrar = obrasVisibles.slice(0, fotosVisiblesCount);

    grid.innerHTML = obrasAMostrar.map((obra, index) => `
      <div class="gallery-item cursor-pointer bg-white p-4 rounded-3xl border-2 border-pizarra shadow-sm hover:shadow-lg transition-all" data-index="${index}">
        <div class="aspect-square rounded-2xl overflow-hidden relative border border-pizarra/10 bg-crema">
          <img src="${obra.imagen}" alt="${obra.titulo}" class="w-full h-full object-cover" loading="lazy">
          <span class="absolute bottom-2 left-2 bg-pizarra text-white text-[10px] px-2 py-0.5 rounded font-bold">${obra.etiqueta}</span>
        </div>
        <h4 class="font-bold text-pizarra text-base mt-3 font-handdrawn">${obra.titulo}</h4>
        <p class="text-xs text-pizarra/60">Hecho por ${obra.autor}</p>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();

    grid.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        abrirLightbox(parseInt(item.getAttribute('data-index'), 10));
      });
    });

    // Botón "Cargar más" — solo aparece si quedan fotos sin mostrar
    if (cargarMasContenedor) {
      const quedanFotos = fotosVisiblesCount < obrasVisibles.length;
      cargarMasContenedor.innerHTML = quedanFotos
        ? `<button id="btn-cargar-mas" class="bg-white hover:bg-crema text-pizarra font-bold px-6 py-3 rounded-full border-2 border-pizarra text-sm shadow-sm transition-all">Cargar más fotos (${obrasVisibles.length - fotosVisiblesCount} más)</button>`
        : '';

      const btnCargarMas = document.getElementById('btn-cargar-mas');
      if (btnCargarMas) {
        btnCargarMas.addEventListener('click', () => {
          fotosVisiblesCount += FOTOS_POR_PAGINA;
          pintarTarjetas();
        });
      }
    }
  }

  renderGrid('todos');

  filtrosContenedor.querySelectorAll('.gallery-filter-btn').forEach(button => {
    button.addEventListener('click', () => {
      filtrosContenedor.querySelectorAll('.gallery-filter-btn').forEach(btn => {
        btn.classList.remove('bg-pizarra', 'text-white', 'active');
        btn.classList.add('bg-white', 'text-pizarra');
      });
      button.classList.remove('bg-white', 'text-pizarra');
      button.classList.add('bg-pizarra', 'text-white', 'active');
      renderGrid(button.getAttribute('data-filter'));
    });
  });

  setupLightbox();
}

function abrirLightbox(indice) {
  indiceLightboxActual = indice;
  actualizarLightbox();
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('hidden');
  lightbox.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

function actualizarLightbox() {
  const obra = obrasVisibles[indiceLightboxActual];
  if (!obra) return;
  document.getElementById('lightbox-imagen').src = obra.imagen;
  document.getElementById('lightbox-imagen').alt = obra.titulo;
  document.getElementById('lightbox-titulo').textContent = obra.titulo;
  document.getElementById('lightbox-autor').textContent = `Hecho por ${obra.autor}`;
}

function cerrarLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.add('hidden');
  lightbox.classList.remove('flex');
  document.body.style.overflow = '';
}

function setupLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox || lightbox.dataset.listo) return;
  lightbox.dataset.listo = 'true';

  document.getElementById('lightbox-cerrar').addEventListener('click', cerrarLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') cerrarLightbox();
  });
  document.getElementById('lightbox-anterior').addEventListener('click', () => {
    indiceLightboxActual = (indiceLightboxActual - 1 + obrasVisibles.length) % obrasVisibles.length;
    actualizarLightbox();
  });
  document.getElementById('lightbox-siguiente').addEventListener('click', () => {
    indiceLightboxActual = (indiceLightboxActual + 1) % obrasVisibles.length;
    actualizarLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('hidden')) return;
    if (e.key === 'Escape') cerrarLightbox();
    if (e.key === 'ArrowLeft') document.getElementById('lightbox-anterior').click();
    if (e.key === 'ArrowRight') document.getElementById('lightbox-siguiente').click();
  });
}

/**
 * Número de WhatsApp del taller que recibe las consultas del formulario.
 * IMPORTANTE: mismo número que se usa en los botones de WhatsApp del resto
 * del sitio. Si cambia el número del taller, actualizar acá también.
 */
const WHATSAPP_TALLER = '5493515093572';

/**
 * Valida el formulario, envía los datos por WhatsApp al taller
 * y lanza confeti digital interactivo al enviar los datos.
 */
function setupRegistrationForm() {
  const form = document.getElementById('form-registro');
  const feedbackExito = document.getElementById('feedback-exito');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombrePadre = document.getElementById('nombre-padre').value.trim();
      const datosPeque = document.getElementById('datos-peque').value.trim();
      const telPadre = document.getElementById('tel-padre').value.trim();
      const tallerInteres = document.getElementById('taller-interes');
      const tallerInteresLabel = tallerInteres.options[tallerInteres.selectedIndex]?.text || '';
      const mensajeAdicional = document.getElementById('mensaje-adicional').value.trim();

      if (!nombrePadre || !datosPeque || !telPadre || !tallerInteres.value) {
        alert('Por favor, rellená todos los campos solicitados.');
        return;
      }

      // Arma el mensaje con todos los datos del formulario y lo envía
      // por WhatsApp al taller (no requiere backend propio).
      const lineas = [
        '¡Hola! Quiero consultar por los talleres 🎨',
        `Nombre del adulto responsable: ${nombrePadre}`,
        `Datos del/la peque: ${datosPeque}`,
        `Teléfono de contacto: ${telPadre}`,
        `Taller de interés: ${tallerInteresLabel}`,
      ];
      if (mensajeAdicional) {
        lineas.push(`Mensaje adicional: ${mensajeAdicional}`);
      }
      const mensajeWhatsApp = encodeURIComponent(lineas.join('\n'));
      const urlWhatsApp = `https://wa.me/${WHATSAPP_TALLER}?text=${mensajeWhatsApp}`;
      window.open(urlWhatsApp, '_blank', 'noopener,noreferrer');

      form.classList.add('hidden');
      if (feedbackExito) {
        feedbackExito.classList.remove('hidden');
        feedbackExito.scrollIntoView({ behavior: 'smooth' });
      }

      triggerConfetti();
    });
  }
}

/**
 * Motor interactivo de Confeti Digital en Canvas
 */
function triggerConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;

  canvas.classList.remove('hidden');
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const colors = ['#FF6F59', '#9E7FFE', '#FFE494', '#A2E8DD', '#E1F5FE'];
  const particles = [];

  for (let i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height - height,
      r: Math.random() * 6 + 4,
      d: Math.random() * width,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 5,
      tiltAngleIncremental: Math.random() * 0.07 + 0.02,
      tiltAngle: 0
    });
  }

  let animationFrameId;
  let duration = 0;

  function draw() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p, index) => {
      p.tiltAngle += p.tiltAngleIncremental;
      p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
      p.tilt = Math.sin(p.tiltAngle - index / 3) * 15;

      if (p.y > height) {
        p.x = Math.random() * width;
        p.y = -20;
        p.tilt = Math.random() * 10 - 5;
      }

      ctx.beginPath();
      ctx.lineWidth = p.r;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
      ctx.stroke();
    });

    duration++;
    if (duration < 250) {
      animationFrameId = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, width, height);
      canvas.classList.add('hidden');
      cancelAnimationFrame(animationFrameId);
    }
  }

  draw();
}

/**
 * Muestra el botón "Volver arriba" solo cuando el usuario scrolleó
 * hacia abajo, y lo lleva suavemente al inicio de la página al hacer clic.
 */
function setupBotonVolverArriba() {
  const btn = document.getElementById('btn-volver-arriba');
  if (!btn) return;

  const UMBRAL_SCROLL = 400;

  window.addEventListener('scroll', () => {
    if (window.scrollY > UMBRAL_SCROLL) {
      btn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
    } else {
      btn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}