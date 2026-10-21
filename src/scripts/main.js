import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

// ---------- Scroll suave (Lenis) sincronizado con ScrollTrigger ----------
const lenis = new Lenis({ duration: 1.15, smoothWheel: !reduced });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
lenis.stop();

// Links internos (#seccion) pasan por Lenis. Se apunta al título de la sección (o al panel navy) para que quede
// a 100 px del borde, debajo del menú. Se mide con offsetTop porque getBoundingClientRect incluye las animaciones (scale, y).
const topDoc = (el) => { let y = 0; for (; el; el = el.offsetParent) y += el.offsetTop; return y; };
$$('a[href^="#"]').forEach((a) =>
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    const target = $(href);
    if (!target) return;
    e.preventDefault();
    if (href === '#inicio') return lenis.scrollTo(0);
    // Contacto es la última sección: va hasta el final (el panel tiene aire arriba, así que el menú no tapa el título)
    if (href === '#contacto') return lenis.scrollTo('bottom');
    const ancla = target.querySelector('.panel, .eyebrow') ?? target;
    lenis.scrollTo(topDoc(ancla) - 100);
  }),
);

// ---------- Tema claro / oscuro ----------
const root = document.documentElement;
const isDark = () => root.dataset.theme === 'dark';
// El botón se anuncia como "Tema oscuro" activado o no (aria-pressed)
$('.js-theme')?.setAttribute('aria-pressed', String(isDark()));
$('.js-theme')?.addEventListener('click', () => {
  const next = isDark() ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch (e) {}
  $('meta[name="theme-color"]').content = next === 'dark' ? '#0a1029' : '#f7f8fb';
  $('.js-theme').setAttribute('aria-pressed', String(next === 'dark'));
  stage?.setDark(next === 'dark');
});

// ---------- Copiar el mail (para quien no tiene un programa de correo configurado) ----------
$$('.js-copy').forEach((btn) => {
  const texto = btn.textContent;
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      btn.textContent = '¡Copiado!';
    } catch (e) {
      btn.textContent = btn.dataset.copy; // si el navegador no deja copiar, al menos queda a la vista
    }
    setTimeout(() => (btn.textContent = texto), 2000);
  });
});

// ---------- Escena 3D (se carga aparte para no frenar la primera pintura) ----------
const canvas = $('.stage3d');
let stage = null;
if (canvas) {
  // Se espera a Poppins para que las letras de las teclas salgan con la fuente correcta
  Promise.all([import('./stage3d.js'), document.fonts?.ready])
    .then(([m]) => {
      stage = m.createStage(canvas, { reduced, dark: isDark() });
    })
    // Sin WebGL (equipos viejos o GPU deshabilitada) el hero queda sin escena, sin errores
    .catch(() => canvas.closest('.hero__stage')?.classList.add('is-off'));
}

// ---------- Intro ----------
// Habilita el scroll y corta la red de seguridad del <head> (index.astro)
function desbloquear() {
  clearTimeout(window.__sinIntro);
  document.body.classList.remove('is-loading');
  lenis.start();
}

function intro() {
  // La ola se ve una vez por sesión; al volver (recarga, atrás desde el PDF) entra directo el hero
  const conOla = !reduced && !root.classList.contains('intro-vista');
  try { sessionStorage.setItem('intro', '1'); } catch (e) {}

  if (reduced) {
    gsap.set('.loader', { display: 'none' });
    desbloquear();
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  if (conOla) {
    const wave = $('.loader__wave');
    const len = wave.getTotalLength();
    gsap.set(wave, { strokeDasharray: len, strokeDashoffset: len });
    tl.to(wave, { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut' })
      .from('.loader__txt', { y: 30, opacity: 0, duration: 0.7 }, '-=0.4')
      .to('.loader', { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '+=0.1')
      .add(desbloquear, '-=0.45') // se puede scrollear mientras el loader termina de subir
      .set('.loader', { display: 'none' });
  } else {
    gsap.set('.loader', { display: 'none' });
    desbloquear();
  }

  tl.from('.nav', { y: -90, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, conOla ? '-=0.55' : 0)
    .from('.hero__title .line__in', { yPercent: 110, duration: 1.3, stagger: 0.09 }, '<')
    .fromTo('.js-hero-in', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.08 }, '<0.25')
    .from('.hero__stage', { scale: 0.85, opacity: 0, duration: 1.6 }, '<');
}

// ---------- Animaciones con el scroll ----------
function scrollAnimations() {
  // Nav: se esconde al bajar, vuelve al subir
  const nav = $('.nav');
  let last = 0;
  lenis.on('scroll', ({ scroll }) => {
    const delta = scroll - last;
    if (Math.abs(delta) < 4) return;
    nav.classList.toggle('is-hidden', delta > 0 && scroll > 200);
    last = scroll;
  });

  // Link activo según la sección visible
  $$('.nav__links a').forEach((a) => {
    const sec = $(a.getAttribute('href'));
    ScrollTrigger.create({
      trigger: sec,
      start: 'top center',
      end: 'bottom center',
      onToggle: (st) => a.classList.toggle('is-active', st.isActive),
    });
  });

  // Hero: la escena 3D se aleja y el texto sube con parallax
  gsap.to('.hero__copy', {
    yPercent: -18,
    opacity: 0.2,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });
  ScrollTrigger.create({
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    onUpdate: (st) => stage?.setProgress(st.progress),
  });

  // Títulos de sección
  $$('.reveal').forEach((el) =>
    gsap.fromTo(
      el,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' } },
    ),
  );

  // Perfil: palabra por palabra, de apagado a encendido (como "Más de 100 ya se suman a la ola")
  const scrub = $('.scrub-text');
  scrub.innerHTML = scrub.textContent
    .trim()
    .split(/\s+/)
    .map((w) => `<span class="w">${w}</span>`)
    .join(' ');
  gsap.to($$('.w', scrub), {
    color: '#f4f6fb',
    stagger: 0.1,
    ease: 'none',
    scrollTrigger: { trigger: scrub, start: 'top 80%', end: 'bottom 45%', scrub: true },
  });

  // Panel navy que "crece" al entrar
  gsap.from('.perfil .panel', {
    scale: 0.92,
    borderRadius: 80,
    ease: 'none',
    scrollTrigger: { trigger: '.perfil', start: 'top bottom', end: 'top 30%', scrub: true },
  });

  // Contadores
  $$('.js-count').forEach((el) => {
    const obj = { v: 0 };
    // Arranca en 0 solo si hay animación; el HTML ya trae el número real
    el.textContent = '0';
    gsap.to(obj, {
      v: Number(el.dataset.to),
      duration: 1.8,
      ease: 'power3.out',
      onUpdate: () => (el.textContent = Math.round(obj.v)),
      scrollTrigger: { trigger: el, start: 'top 90%' },
    });
  });

  // Proyectos: los chips entran saltando y la vitrina sube
  // clearProps: al terminar, el chip vuelve a su CSS (si no, el transform en línea pisa la inclinación del elegido)
  gsap.from('.proj__chip', { y: 30, opacity: 0, duration: 0.8, ease: 'back.out(2.5)', stagger: 0.05, clearProps: 'transform,opacity', scrollTrigger: { trigger: '.proj__chips', start: 'top 85%' } });
  gsap.from('.proj__vitrina', { y: 80, scale: 0.94, opacity: 0, duration: 1.2, ease: 'expo.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '.proj__vitrina', start: 'top 80%' } });

  // Pase automático mientras la sección está a la vista (solo desktop; en celular la tarjeta es más alta que la pantalla).
  // La barrita del chip elegido muestra cuánto falta. Se pausa con el mouse o el foco en los chips o en la tarjeta,
  // y se corta del todo cuando la persona elige un proyecto.
  if (window.matchMedia('(min-width: 901px)').matches) {
    // Mouse y foco se llevan por separado: si el mouse sale mientras el foco sigue en un chip, no arranca
    const pausa = { mouse: false, foco: false };
    const quieto = () => pausa.mouse || pausa.foco;
    const aplicarPausa = () => (quieto() ? proyectos.auto?.pause() : proyectos.auto?.resume());
    const avanzar = () => {
      proyectos.auto?.kill();
      if (proyectos.elegido) return;
      const barra = $('.proj__chip.is-on .proj__chip-bar');
      proyectos.auto = gsap.fromTo(barra, { scaleX: 0 }, {
        scaleX: 1, duration: 10, ease: 'none', paused: quieto(),
        onComplete: () => { gsap.set(barra, { scaleX: 0 }); proyectos.mostrar(proyectos.actual + 1); avanzar(); },
      });
    };
    $$('.proj__chips, .proj__vitrina').forEach((zona) => {
      zona.addEventListener('pointerenter', () => { pausa.mouse = true; aplicarPausa(); });
      zona.addEventListener('pointerleave', () => { pausa.mouse = false; aplicarPausa(); });
      zona.addEventListener('focusin', () => { pausa.foco = true; aplicarPausa(); });
      zona.addEventListener('focusout', () => { pausa.foco = false; aplicarPausa(); });
    });
    ScrollTrigger.create({
      trigger: '.proj',
      start: 'top 60%',
      end: 'bottom 40%',
      onToggle: (st) => {
        if (st.isActive) avanzar();
        else { proyectos.auto?.kill(); gsap.set('.proj__chip-bar', { scaleX: 0 }); }
      },
    });
  }

  // Marquesinas: avanzan solas y aceleran con la velocidad del scroll
  const marquees = $$('.marquee').map((m) => {
    const inner = $('.marquee__inner', m);
    const dir = Number(m.dataset.dir);
    return { inner, dir, x: dir > 0 ? -inner.scrollWidth / 2 : 0 };
  });
  let boost = 0;
  lenis.on('scroll', ({ velocity }) => (boost = Math.min(Math.abs(velocity) * 0.6, 12)));
  // Si la sección no se ve, no se calcula nada
  let marqueesVisibles = false;
  ScrollTrigger.create({ trigger: '.stack', start: 'top bottom', end: 'bottom top', onToggle: (st) => (marqueesVisibles = st.isActive) });
  gsap.ticker.add((_, dt) => {
    if (!marqueesVisibles) return;
    boost *= 0.92;
    const speed = (0.04 + boost * 0.02) * dt;
    marquees.forEach((m) => {
      const half = m.inner.scrollWidth / 2;
      m.x += m.dir * speed;
      if (m.x <= -half) m.x += half;
      if (m.x >= 0) m.x -= half;
      m.inner.style.transform = `translate3d(${m.x}px,0,0)`;
    });
  });

  // Formación: la línea se completa con el scroll y cada hito aparece
  gsap.to('.timeline__fill', {
    scaleY: 1,
    ease: 'none',
    scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 60%', scrub: true },
  });
  $$('.timeline__item').forEach((it) => {
    gsap.from(it, { x: 40, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: it, start: 'top 82%' } });
    ScrollTrigger.create({
      trigger: it,
      start: 'top 62%',
      onToggle: (st) => $('.timeline__dot', it).classList.toggle('is-on', st.isActive),
      end: 'max',
    });
  });

  // Competencias: entran escalonadas
  gsap.from('.skill', {
    y: 70,
    opacity: 0,
    duration: 1.1,
    ease: 'expo.out',
    stagger: 0.1,
    scrollTrigger: { trigger: '.skills__grid', start: 'top 85%' },
  });

  // Contacto
  gsap.from('.contact__title .line__in', {
    yPercent: 110,
    duration: 1.2,
    ease: 'expo.out',
    stagger: 0.1,
    scrollTrigger: { trigger: '.contact__title', start: 'top 85%' },
  });
}

// ---------- Proyectos: tocás un chip y cambia la tarjeta grande ----------
const proyectos = { actual: 0, auto: null, elegido: false, mostrar: () => {} };
{
  const chips = $$('.proj__chip');
  const cards = $$('.proj__card');
  const fila = $('.proj__chips');
  const partes = '.proj__count, .proj__tags, .proj__title, .proj__client, .proj__desc, .proj__did li, .proj__stack';

  proyectos.mostrar = (n, { foco = false } = {}) => {
    const i = (n + cards.length) % cards.length;
    if (i === proyectos.actual) return;
    const sale = cards[proyectos.actual];
    const entra = cards[i];
    proyectos.actual = i;

    chips.forEach((c, j) => {
      c.classList.toggle('is-on', j === i);
      c.setAttribute('aria-selected', String(j === i));
      c.tabIndex = j === i ? 0 : -1;
    });
    if (foco) chips[i].focus({ preventScroll: true });
    // En celular la fila se desliza para que el chip elegido quede a la vista
    if (fila.scrollWidth > fila.clientWidth) {
      const chip = chips[i].getBoundingClientRect();
      const caja = fila.getBoundingClientRect();
      const left = fila.scrollLeft + chip.left - caja.left - (caja.width - chip.width) / 2;
      fila.scrollTo({ left, behavior: reduced ? 'auto' : 'smooth' });
    }

    if (reduced) {
      sale.classList.remove('is-on');
      entra.classList.add('is-on');
      return;
    }
    gsap.killTweensOf([sale, entra, ...entra.querySelectorAll(partes), entra.querySelector('.device')]);
    gsap.to(sale, {
      opacity: 0,
      scale: 0.96,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        sale.classList.remove('is-on');
        gsap.set(sale, { clearProps: 'opacity,transform' });
      },
    });
    entra.classList.add('is-on');
    gsap.fromTo(entra, { opacity: 0, y: 40, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'expo.out', delay: 0.15, clearProps: 'transform' });
    gsap.fromTo(entra.querySelectorAll(partes), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.04, delay: 0.25 });
    gsap.fromTo(entra.querySelector('.device'), { scale: 0.6, rotate: -8 }, { scale: 1, rotate: 0, duration: 1.1, ease: 'elastic.out(1, 0.6)', delay: 0.2 });
  };

  const elegir = (i, opciones) => {
    proyectos.elegido = true; // si la persona elige, se corta el pase automático
    proyectos.auto?.kill();
    gsap.set('.proj__chip-bar', { scaleX: 0 });
    proyectos.mostrar(i, opciones);
  };
  chips.forEach((chip, i) => {
    chip.addEventListener('click', () => elegir(i));
    // Flechas, Inicio y Fin recorren los chips, como en cualquier lista de pestañas
    chip.addEventListener('keydown', (e) => {
      const destino = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: chips.length - 1 }[e.key];
      if (destino === undefined) return;
      e.preventDefault();
      elegir(destino, { foco: true });
    });
  });
}

// ---------- Interacciones con el mouse ----------
function pointerEffects() {
  if (reduced || !window.matchMedia('(hover: hover)').matches) return;

  // Tarjetas que se inclinan hacia el cursor
  $$('.js-tilt').forEach((el) => {
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3' });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3' });
    gsap.set(el, { transformPerspective: 800 });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 14);
      rx(-((e.clientY - r.top) / r.height - 0.5) * 14);
    });
    el.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });

  // Botón magnético
  $$('.js-magnetic').forEach((el) => {
    const x = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    const y = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - r.left - r.width / 2) * 0.3);
      y((e.clientY - r.top - r.height / 2) * 0.4);
    });
    el.addEventListener('pointerleave', () => { x(0); y(0); });
  });
}

intro();
if (!reduced) scrollAnimations();
pointerEffects();
document.fonts?.ready.then(() => ScrollTrigger.refresh());
