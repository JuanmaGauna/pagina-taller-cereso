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
  
  /**
   * Filtros de la Galería Creativa
   */
  function setupGalleryFilters() {
    const filterButtons = document.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
  
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
  
        filterButtons.forEach(btn => {
          btn.classList.remove('bg-pizarra', 'text-white');
          btn.classList.add('bg-white', 'text-pizarra');
        });
        button.classList.remove('bg-white', 'text-pizarra');
        button.classList.add('bg-pizarra', 'text-white');
  
        const filterValue = button.getAttribute('data-filter');
  
        galleryItems.forEach(item => {
          const itemCategory = item.getAttribute('data-category');
          if (filterValue === 'todos' || itemCategory === filterValue) {
            item.classList.remove('hidden-item');
          } else {
            item.classList.add('hidden-item');
          }
        });
      });
    });
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
  