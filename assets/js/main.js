/* =============================================================
   EMÍLIO CUCINA CONTEMPORÂNEA — interações
   GSAP + ScrollTrigger + Lenis. Respeita prefers-reduced-motion.
   ============================================================= */
(function () {
  'use strict';
  window.__emilio = 1;

  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hasGSAP = !!(window.gsap && window.ScrollTrigger);
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  if (!hasGSAP || reduce) root.classList.remove('js');
  if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
  }

  /* ---------- WhatsApp: mensagens prontas ---------- */
  var TEL_RES = '5515996869645';
  var TEL_EV = '5515996246436';
  var WA = {
    reserva: [TEL_RES, 'Olá! Vim pelo site do Emílio e gostaria de reservar uma mesa.'],
    almoco: [TEL_RES, 'Olá! Vim pelo site do Emílio e gostaria de reservar uma mesa para o almoço.'],
    feijoada: [TEL_RES, 'Olá! Vim pelo site do Emílio e quero reservar para a feijoada.'],
    jantar: [TEL_RES, 'Olá! Vim pelo site do Emílio e gostaria de reservar uma mesa para o jantar.'],
    bar: [TEL_RES, 'Olá! Vim pelo site do Emílio e quero reservar uma mesa no bar.'],
    pet: [TEL_RES, 'Olá! Vim pelo site do Emílio e quero reservar uma mesa no deck pet friendly.'],
    evento: [TEL_EV, 'Olá! Vim pelo site do Emílio e gostaria de um orçamento para um evento.']
  };
  function waLink(tel, text) { return 'https://wa.me/' + tel + '?text=' + encodeURIComponent(text); }
  $$('[data-wa]').forEach(function (a) {
    var d = WA[a.getAttribute('data-wa')];
    if (d) a.setAttribute('href', waLink(d[0], d[1]));
  });

  /* ---------- títulos (máscara) e citação (palavras) ---------- */
  $$('.h2 .b, .h2 .l').forEach(function (part) {
    var inner = document.createElement('span');
    inner.className = 'm-in';
    while (part.firstChild) inner.appendChild(part.firstChild);
    part.appendChild(inner);
    part.classList.add('m');
  });
  var quote = $('.review-quote.big .words');
  var quoteWords = [];
  if (quote) {
    var words = quote.textContent.trim().split(/\s+/);
    quote.textContent = '';
    words.forEach(function (w, i) {
      var s = document.createElement('span');
      s.className = 'qw';
      s.textContent = w;
      quote.appendChild(s);
      if (i < words.length - 1) quote.appendChild(document.createTextNode(' '));
      quoteWords.push(s);
    });
  }

  /* ---------- rolagem suave ---------- */
  var lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.95 });
    if (hasGSAP) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  function scrollToTarget(target) {
    var offset = target.id === 'top' ? 0 : -70;
    if (lenis) lenis.scrollTo(target, { offset: offset, duration: 1.5 });
    else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset, behavior: reduce ? 'auto' : 'smooth' });
  }

  /* ---------- navegação em tela cheia ---------- */
  var nav = $('#nav');
  var trigger = $('.menu-trigger');
  var navClose = $('.nav-close');
  if (nav) nav.inert = true;
  $$('.nav-list a').forEach(function (a, i) { a.style.setProperty('--i', i); });
  function openNav() {
    nav.classList.add('open');
    nav.inert = false;
    nav.setAttribute('aria-hidden', 'false');
    trigger.setAttribute('aria-expanded', 'true');
    if (lenis) lenis.stop();
    setTimeout(function () { navClose.focus({ preventScroll: true }); }, 350);
  }
  function closeNav() {
    if (!nav.classList.contains('open')) return;
    nav.classList.remove('open');
    nav.inert = true;
    nav.setAttribute('aria-hidden', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    if (lenis) lenis.start();
  }
  if (trigger) trigger.addEventListener('click', openNav);
  if (navClose) navClose.addEventListener('click', function () { closeNav(); trigger.focus({ preventScroll: true }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });

  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id.length < 2) return;
      var target = document.getElementById(id.slice(1));
      if (!target) return;
      e.preventDefault();
      var wasOpen = nav && nav.classList.contains('open');
      closeNav();
      setTimeout(function () { scrollToTarget(target); }, wasOpen ? 300 : 0);
    });
  });

  /* ---------- cabeçalho: claro sobre o hero; papel ao rolar; logo depois da assinatura ---------- */
  var header = $('.site-header');
  var hero = $('.hero');
  var heroTitle = $('.hero-title');
  var logoLine = 0, heroEnd = 0;
  function measure() {
    if (heroTitle) logoLine = heroTitle.getBoundingClientRect().bottom + window.scrollY - 60;
    if (hero) heroEnd = hero.offsetTop + hero.offsetHeight - 70;
  }
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('scrolled', y > heroEnd);
    header.classList.toggle('on-hero', y <= heroEnd);
    header.classList.toggle('show-logo', y > logoLine);
  }
  measure();
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { measure(); onScroll(); });

  /* ---------- aberto agora / hoje ---------- */
  var DAYS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  function periods(dow) {
    var p = [];
    if (dow === 0) p.push({ k: 'almoço', a: 12 * 60, b: 17 * 60 });
    else p.push({ k: 'almoço', a: 11 * 60 + 30, b: 15 * 60 });
    if (dow >= 3 && dow <= 6) p.push({ k: 'jantar', a: 18 * 60, b: dow >= 5 ? 24 * 60 : 23 * 60 });
    return p;
  }
  function hhmm(m) { var h = Math.floor(m / 60) % 24, mi = m % 60; return (h < 10 ? '0' : '') + h + ':' + (mi < 10 ? '0' : '') + mi; }
  (function status() {
    var now = new Date();
    var dow = now.getDay();
    var mins = now.getHours() * 60 + now.getMinutes();
    var open = null, next = null;
    periods(dow).forEach(function (p) {
      if (mins >= p.a && mins < p.b) open = p;
      else if (!next && mins < p.a) next = p;
    });
    var text;
    if (open) text = 'Aberto agora · ' + open.k + ' até ' + (open.b === 24 * 60 ? 'meia-noite' : hhmm(open.b));
    else if (next) text = 'Hoje tem ' + next.k + ' a partir das ' + hhmm(next.a);
    else {
      var t = (dow + 1) % 7;
      text = 'Fechado agora · abre ' + (t === 0 ? 'domingo' : 'amanhã') + ' às ' + hhmm(periods(t)[0].a);
    }
    $$('[data-status]').forEach(function (el) {
      el.querySelector('.st-t').textContent = text;
      el.classList.toggle('is-open', !!open);
    });
    var day = $('.day[data-day="' + dow + '"]');
    if (day) day.classList.add('today');
    $$('.op[data-days]').forEach(function (op) {
      var ds = op.getAttribute('data-days');
      if (ds && ds.split(',').indexOf(String(dow)) > -1) op.classList.add('is-today');
    });
  })();

  /* ---------- vídeos: tocar só quando visíveis ---------- */
  var heroVideos = $$('.hero video');
  function tryPlay(v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  if ('IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) {
          if (v.preload === 'none' && !v.dataset.loaded) { v.preload = 'auto'; v.load(); v.dataset.loaded = '1'; }
          if (!reduce || v.classList.contains('hv')) tryPlay(v);
        } else {
          v.pause();
        }
      });
    }, { rootMargin: '120px 0px' });
    $$('.lazy-video').concat(heroVideos).forEach(function (v) { vio.observe(v); });
  }
  heroVideos.forEach(function (v) {
    v.muted = true; v.defaultMuted = true; v.playsInline = true;
    var kick = function () { if (v.paused && v.offsetParent !== null) tryPlay(v); };
    v.addEventListener('loadeddata', kick);
    ['pointerdown', 'touchstart', 'scroll', 'keydown'].forEach(function (ev) {
      window.addEventListener(ev, kick, { passive: true, once: true });
    });
    tryPlay(v);
  });

  /* ---------- as opções: lista que troca a foto ---------- */
  var ops = $$('.op');
  var opImgs = $$('.op-img');
  var opLabelN = $('.op-label-n'), opLabelT = $('.op-label-t');
  var opHover = false;
  function setOp(op) {
    if (!op || op.classList.contains('is-active')) return;
    ops.forEach(function (o) {
      var on = o === op;
      o.classList.toggle('is-active', on);
      o.querySelector('.op-head').setAttribute('aria-expanded', on ? 'true' : 'false');
    });
    var key = op.getAttribute('data-op');
    opImgs.forEach(function (im) { im.classList.toggle('is-on', im.getAttribute('data-for') === key); });
    if (opLabelN) {
      opLabelN.textContent = op.querySelector('.op-n').textContent;
      opLabelT.textContent = op.querySelector('.op-title b').textContent;
    }
    if (hasGSAP) setTimeout(function () { ScrollTrigger.refresh(); }, 700);
  }
  if (ops.length) {
    ops[0].classList.add('is-active');
    ops.forEach(function (op) {
      var head = op.querySelector('.op-head');
      head.addEventListener('click', function () { setOp(op); });
      if (fine && window.innerWidth > 1000) {
        op.addEventListener('pointerenter', function () { opHover = true; setOp(op); });
        op.addEventListener('pointerleave', function () { opHover = false; });
      }
    });
  }

  /* ---------- da nossa cucina: foto emoldurada que gira ---------- */
  var prSection = $('.pratos');
  var prItems = $$('.pr-item');
  var prStage = $('.pr-stage');
  var prRow = $('.pr-row');
  var prBg = $('.pr-bg');
  var prNum = $('.pr-num'), prName = $('.pr-name'), prSub = $('.pr-sub');
  var prPos = 0;
  var prN = prItems.length;
  var prPrevRel = prItems.map(function () { return 0; });
  var mod = function (a, n) { return ((a % n) + n) % n; };
  function prLayout(animate) {
    if (!prN) return;
    var size = prItems[0].offsetWidth;
    var spacing = size * (window.innerWidth < 700 ? 0.78 : 0.9);
    prItems.forEach(function (it, i) {
      var rel = mod(i - prPos, prN);
      if (rel > prN / 2) rel -= prN;
      var abs = Math.abs(rel);
      var props = {
        x: rel * spacing,
        y: abs * 18,
        rotation: rel === 0 ? 0 : (rel > 0 ? 4 : -4) + rel * 1.5,
        scale: rel === 0 ? 1 : Math.max(0.5, 0.74 - (abs - 1) * 0.12),
        autoAlpha: abs >= 3 ? 0 : (rel === 0 ? 1 : 0.85 - (abs - 1) * 0.35),
        zIndex: 10 - abs
      };
      var jump = Math.abs(rel - prPrevRel[i]) > prN / 2;
      if (!animate || jump || reduce) gsap.set(it, props);
      else gsap.to(it, Object.assign({ duration: 1.05, ease: 'expo.out', overwrite: 'auto' }, props));
      prPrevRel[i] = rel;
    });
    var idx = mod(prPos, prN);
    var it = prItems[idx];
    if (prBg) prBg.style.backgroundImage = 'url("' + it.querySelector('img').currentSrc + '")';
    var num = String(idx + 1).padStart(2, '0') + ' / ' + String(prN).padStart(2, '0');
    var nm = it.getAttribute('data-name'), sb = it.getAttribute('data-sub');
    if (animate && !reduce) {
      gsap.to([prNum, prName, prSub], { yPercent: -60, autoAlpha: 0, duration: 0.25, ease: 'power2.in', onComplete: function () {
        prNum.textContent = num; prName.textContent = nm; prSub.textContent = sb;
        gsap.fromTo([prNum, prName, prSub], { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out', stagger: 0.05 });
      } });
    } else {
      prNum.textContent = num; prName.textContent = nm; prSub.textContent = sb;
    }
  }
  function prStep(d) { prPos += d; prLayout(true); }
  var prTimer = null, prHover = false, prVisible = false, prDragging = false, prMoved = false;
  function prAuto() {
    clearInterval(prTimer);
    if (reduce) return;
    prTimer = setInterval(function () { if (!prHover && prVisible && !prDragging && !document.hidden) prStep(1); }, 3400);
  }
  if (prN && hasGSAP) {
    prSection.classList.add('js-pr');
    prLayout(false);
    prAuto();
    $('.pr-next').addEventListener('click', function () { prStep(1); prAuto(); });
    $('.pr-prev').addEventListener('click', function () { prStep(-1); prAuto(); });
    prStage.addEventListener('pointerenter', function () { prHover = true; });
    prStage.addEventListener('pointerleave', function () { prHover = false; });
    prStage.setAttribute('tabindex', '0');
    prStage.setAttribute('aria-label', 'Pratos da casa. Use as setas para trocar.');
    prStage.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { prStep(1); prAuto(); }
      if (e.key === 'ArrowLeft') { prStep(-1); prAuto(); }
    });
    prItems.forEach(function (it, i) {
      it.addEventListener('click', function () {
        if (prMoved) return;
        var rel = mod(i - prPos, prN); if (rel > prN / 2) rel -= prN;
        if (rel !== 0) { prStep(rel); prAuto(); }
      });
    });
    var startX = 0, dx = 0;
    prStage.addEventListener('pointerdown', function (e) {
      prDragging = true; prMoved = false; startX = e.clientX; dx = 0;
      prStage.classList.add('dragging');
    });
    window.addEventListener('pointermove', function (e) {
      if (!prDragging) return;
      dx = e.clientX - startX;
      if (Math.abs(dx) > 6) prMoved = true;
      gsap.to(prRow, { x: dx * 0.5, duration: 0.3, ease: 'power3.out', overwrite: true });
    });
    window.addEventListener('pointerup', function () {
      if (!prDragging) return;
      prDragging = false;
      prStage.classList.remove('dragging');
      gsap.to(prRow, { x: 0, duration: 0.9, ease: 'expo.out', overwrite: true });
      if (Math.abs(dx) > 50) { prStep(dx < 0 ? 1 : -1); prAuto(); }
      setTimeout(function () { prMoved = false; }, 50);
    });
    window.addEventListener('resize', function () { prLayout(false); });
    ScrollTrigger.create({ trigger: prSection, start: 'top bottom', end: 'bottom top', onToggle: function (self) { prVisible = self.isActive; } });
  }

  /* ---------- formulários: montam a mensagem do WhatsApp ---------- */
  function fmtDate(v) {
    if (!v) return null;
    var p = v.split('-'); if (p.length !== 3) return null;
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    return { d: d, txt: p[2] + '/' + p[1] + ' (' + DAYS[d.getDay()] + ')' };
  }
  (function minDates() {
    var t = new Date(); var iso = t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');
    $$('input[type="date"]').forEach(function (i) { i.min = iso; });
  })();
  /* o botão é um link de verdade (abre o WhatsApp em qualquer navegador);
     a mensagem é montada a cada mudança e conferida no clique */
  function buildMsg(f) {
    if (f.getAttribute('data-form') === 'mesa') {
      var dt = fmtDate(f.data.value);
      var per = f.periodo.value;
      var n = parseInt(f.pessoas.value, 10) || 0;
      if (!dt) return { err: 'Escolha o dia da reserva.', el: f.data };
      if (n < 1) return { err: 'Diga quantas pessoas vêm.', el: f.pessoas };
      var dow = dt.d.getDay();
      if (per === 'feijoada' && dow !== 3 && dow !== 6) return { err: 'A feijoada é só às quartas e aos sábados, no almoço.', el: f.periodo };
      if ((per === 'jantar' || per === 'bar') && (dow < 3 || dow > 6)) return { err: 'Jantar e bar abrem de quarta a sábado.', el: f.periodo };
      var nomes = { almoco: 'o almoço', feijoada: 'a feijoada', jantar: 'o jantar', bar: 'o bar e porções' };
      return { url: waLink(TEL_RES, 'Olá! Vim pelo site do Emílio e gostaria de reservar uma mesa para ' + n + (n === 1 ? ' pessoa' : ' pessoas') + ' no dia ' + dt.txt + ', para ' + nomes[per] + '.') };
    }
    var dt2 = fmtDate(f.data.value);
    var c = parseInt(f.convidados.value, 10) || 0;
    if (c < 1) return { err: 'Diga quantos convidados você espera.', el: f.convidados };
    var out = { url: waLink(TEL_EV, 'Olá! Vim pelo site do Emílio e gostaria de um orçamento para um evento: ' + f.tipo.value.toLowerCase() + ', para cerca de ' + c + ' convidados' + (dt2 ? ', no dia ' + dt2.txt : '') + '.') };
    if (c > 70) out.note = 'O casarão recebe até 70 convidados. Para grupos maiores, a equipe confirma pelo WhatsApp.';
    return out;
  }
  $$('form[data-form]').forEach(function (f) {
    var msg = f.querySelector('.res-msg');
    var send = f.querySelector('.res-send');
    function update() {
      var r = buildMsg(f);
      if (r.url) send.setAttribute('href', r.url);
      msg.textContent = r.note || '';
      return r;
    }
    f.addEventListener('input', update);
    f.addEventListener('change', update);
    send.addEventListener('click', function (e) {
      var r = update();
      if (r.err) { e.preventDefault(); msg.textContent = r.err; r.el.focus(); }
    });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var r = update();
      if (r.err) { msg.textContent = r.err; r.el.focus(); return; }
      send.click();
    });
  });

  /* ---------- cursor com etiqueta e botões magnéticos ---------- */
  if (fine && !reduce && hasGSAP) {
    var cur = $('.cursor');
    var lab = $('.cursor-label');
    var cx = gsap.quickTo(cur, 'x', { duration: 0.35, ease: 'power3.out' });
    var cy = gsap.quickTo(cur, 'y', { duration: 0.35, ease: 'power3.out' });
    window.addEventListener('pointermove', function (e) { cx(e.clientX); cy(e.clientY); cur.classList.add('is-on'); });
    document.addEventListener('pointerleave', function () { cur.classList.remove('is-on'); });
    $$('[data-cursor]').forEach(function (el) {
      el.addEventListener('pointerenter', function () { lab.textContent = el.getAttribute('data-cursor'); cur.classList.add('is-big'); });
      el.addEventListener('pointerleave', function () { cur.classList.remove('is-big'); });
    });
    $$('a, button, input, select').forEach(function (el) {
      if (el.closest('[data-cursor]')) return;
      el.addEventListener('pointerenter', function () { cur.classList.add('is-hidden'); });
      el.addEventListener('pointerleave', function () { cur.classList.remove('is-hidden'); });
    });
    $$('.magnetic').forEach(function (b) {
      var mx = gsap.quickTo(b, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.45)' });
      var my = gsap.quickTo(b, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.45)' });
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        mx((e.clientX - r.left - r.width / 2) * 0.28);
        my((e.clientY - r.top - r.height / 2) * 0.4);
      });
      b.addEventListener('pointerleave', function () { mx(0); my(0); });
    });
    /* cartões: inclinam levemente acompanhando o mouse */
    $$('.card').forEach(function (c) {
      var rx = gsap.quickTo(c, 'rotationY', { duration: 0.8, ease: 'power3.out' });
      var ry = gsap.quickTo(c, 'rotationX', { duration: 0.8, ease: 'power3.out' });
      gsap.set(c, { transformPerspective: 1100 });
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect();
        rx(((e.clientX - r.left) / r.width - 0.5) * 6);
        ry(-((e.clientY - r.top) / r.height - 0.5) * 6);
      });
      c.addEventListener('pointerleave', function () { rx(0); ry(0); });
    });
  }

  function fmt(v, dec) { return v.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec }); }

  if (!hasGSAP || reduce) return;

  /* ================== animações com GSAP ================== */

  /* ---------- entrada do hero ---------- */
  var intro = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete: function () { measure(); onScroll(); } });
  intro.fromTo('.hero-bg', { autoAlpha: 0, scale: 1.18 }, { autoAlpha: 1, scale: 1, duration: 2.6, ease: 'power3.out' }, 0)
    .fromTo('.hero-prato-wrap', { autoAlpha: 0, y: 140, rotation: -4 }, { autoAlpha: 1, y: 0, rotation: 0, duration: 2, ease: 'expo.out' }, 0.45)
    .fromTo('.hero-logo', { '--w': '0%' }, { '--w': '112%', duration: 2.3, ease: 'power2.inOut' }, 0.7)
    .fromTo('.hero-tag', { autoAlpha: 0, letterSpacing: '1.2em' }, { autoAlpha: 1, letterSpacing: '.62em', duration: 1.6 }, 1.9)
    .fromTo('.hero-line, .hero-cta', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.1 }, 2.1)
    .fromTo('.hero-foot', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 2.4)
    .fromTo('.site-header', { autoAlpha: 0, y: -16 }, { autoAlpha: 1, y: 0, duration: 1, clearProps: 'transform' }, 1.6);

  /* ---------- hero ao rolar: os painéis se separam e a assinatura sobe ---------- */
  gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
    .to('.hero-bg', { yPercent: 12, ease: 'none' }, 0)
    .to('.hero-prato', { yPercent: -22, scale: 1.18, ease: 'none' }, 0)
    .to('.hero-shade', { '--shade': 0.72, ease: 'none' }, 0)
    .to('.hero-copy', { yPercent: -16, autoAlpha: 0.15, ease: 'none' }, 0);

  /* ---------- hero: profundidade com o mouse (fundo e panela em sentidos opostos) ---------- */
  if (fine && hero) {
    var bgx = gsap.quickTo('.hero-bg img', 'x', { duration: 1.4, ease: 'power3.out' });
    var bgy = gsap.quickTo('.hero-bg img', 'y', { duration: 1.4, ease: 'power3.out' });
    var px = gsap.quickTo('.hero-prato-wrap', 'x', { duration: 1.1, ease: 'power3.out' });
    var pr = gsap.quickTo('.hero-prato-wrap', 'rotation', { duration: 1.1, ease: 'power3.out' });
    hero.addEventListener('pointermove', function (e) {
      var nx = e.clientX / window.innerWidth - 0.5, ny = e.clientY / window.innerHeight - 0.5;
      bgx(nx * -26); bgy(ny * -16); px(nx * 22); pr(nx * 2.5);
    });
    hero.addEventListener('pointerleave', function () { bgx(0); bgy(0); px(0); pr(0); });
  }

  /* ---------- títulos, pontinhos, ondas e textos ---------- */
  $$('.h2').forEach(function (h) {
    gsap.timeline({ scrollTrigger: { trigger: h, start: 'top 86%', once: true } })
      .from(h.querySelectorAll('.m-in'), { yPercent: 115, duration: 1.25, ease: 'expo.out', stagger: 0.12 });
  });
  $$('.dots').forEach(function (d) {
    gsap.from(d.children, { scale: 0, duration: 0.7, ease: 'back.out(3)', stagger: 0.06, scrollTrigger: { trigger: d, start: 'top 92%', once: true } });
  });
  $$('.ondas').forEach(function (o) {
    gsap.to(o.querySelectorAll('path'), { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', stagger: 0.18, scrollTrigger: { trigger: o, start: 'top 95%', once: true } });
  });
  $$('.fade-up').forEach(function (el) {
    gsap.from(el, { autoAlpha: 0, y: 34, duration: 1.15, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });

  /* ---------- a casa: faixas rasgadas emolduram a fachada ---------- */
  gsap.from('.casa-media .img-wrap', { clipPath: 'inset(14% 12% 14% 12%)', duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: '.casa-media', start: 'top 80%', once: true } });
  gsap.from('.faixa-a', { xPercent: -110, duration: 1.4, ease: 'expo.out', delay: 0.35, scrollTrigger: { trigger: '.casa-media', start: 'top 80%', once: true } });
  gsap.from('.faixa-b', { xPercent: 110, duration: 1.4, ease: 'expo.out', delay: 0.5, scrollTrigger: { trigger: '.casa-media', start: 'top 80%', once: true } });
  gsap.fromTo('.faixa-a', { rotation: -5 }, { rotation: 1, ease: 'none', scrollTrigger: { trigger: '.casa-media', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.fromTo('.faixa-b', { rotation: 4 }, { rotation: -1.5, ease: 'none', scrollTrigger: { trigger: '.casa-media', start: 'top bottom', end: 'bottom top', scrub: true } });
  $$('[data-parallax-img]').forEach(function (img) {
    gsap.fromTo(img, { yPercent: -7, scale: 1.12 }, { yPercent: 7, scale: 1, ease: 'none', scrollTrigger: { trigger: img.closest('figure') || img, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  gsap.fromTo('.pull-floreio', { rotation: -40, scale: 0.6 }, { rotation: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: '.pull', start: 'top bottom', end: 'bottom 45%', scrub: true } });

  /* ---------- pratos ---------- */
  gsap.from(prRow, { yPercent: 22, autoAlpha: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: prStage, start: 'top 80%', once: true } });

  /* ---------- faixa: velocidade acompanha a rolagem ---------- */
  (function () {
    var track = $('.tick-track');
    if (!track) return;
    var tw = gsap.fromTo(track, { xPercent: 0 }, { xPercent: -50, duration: 40, ease: 'none', repeat: -1 });
    var proxy = { s: 1 };
    var dir = 1;
    gsap.ticker.add(function () { tw.timeScale(proxy.s); });
    ScrollTrigger.create({
      trigger: '.ticker', start: 'top bottom', end: 'bottom top',
      onUpdate: function (self) {
        dir = self.direction;
        var boost = 1 + Math.min(Math.abs(self.getVelocity()) / 300, 5);
        gsap.to(proxy, { s: boost * dir, duration: 0.25, overwrite: true, onComplete: function () { gsap.to(proxy, { s: dir, duration: 1.4, ease: 'power2.out' }); } });
      }
    });
    gsap.fromTo('.tick-band', { rotation: -4 }, { rotation: -1, ease: 'none', scrollTrigger: { trigger: '.ticker', start: 'top bottom', end: 'bottom top', scrub: true } });
  })();

  /* ---------- as opções ---------- */
  gsap.from('.op', { y: 40, autoAlpha: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, clearProps: 'transform', scrollTrigger: { trigger: '.op-list', start: 'top 85%', once: true } });
  gsap.from('.op-frame', { clipPath: 'inset(0 0 100% 0)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: '.op-grid', start: 'top 80%', once: true } });
  if (window.innerWidth > 1000) {
    ops.forEach(function (op) {
      ScrollTrigger.create({ trigger: op, start: 'top 58%', end: 'bottom 58%', onToggle: function (self) { if (self.isActive && !opHover) setOp(op); } });
    });
  }
  gsap.from('.week-head > *', { y: 30, autoAlpha: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.week', start: 'top 88%', once: true } });
  gsap.from('.day', { y: 34, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.06, clearProps: 'transform', scrollTrigger: { trigger: '.week-grid', start: 'top 90%', once: true } });

  /* ---------- a cozinha: trilho horizontal fixado ---------- */
  var film = $('.film');
  var mm = gsap.matchMedia();
  mm.add('(min-width: 0px)', function () {
    film.classList.add('is-pinned');
    var track = $('.film-track');
    var pin = $('.film-pin');
    var dist = function () { return Math.max(0, track.scrollWidth - (window.innerWidth - track.offsetLeft)); };
    var tw = gsap.to(track, {
      x: function () { return -dist(); }, ease: 'none', force3D: true,
      scrollTrigger: { trigger: pin, start: 'top top', end: function () { return '+=' + dist(); }, pin: true, scrub: true, invalidateOnRefresh: true, anticipatePin: 1, refreshPriority: 1 }
    });
    gsap.to('.film-progress span', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: pin, start: 'top top', end: function () { return '+=' + dist(); }, scrub: true, invalidateOnRefresh: true, refreshPriority: 1 } });
    $$('.fi-img img').forEach(function (img) {
      gsap.fromTo(img, { xPercent: -6 }, { xPercent: 6, ease: 'none', force3D: true, scrollTrigger: { trigger: img.parentNode, containerAnimation: tw, start: 'left right', end: 'right left', scrub: true } });
    });
    gsap.fromTo('.film-item', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.out', stagger: 0.1, clearProps: 'clipPath', scrollTrigger: { trigger: pin, start: 'top 75%', once: true } });
    return function () { film.classList.remove('is-pinned'); gsap.set(track, { x: 0 }); };
  });

  /* ---------- primeira visita ---------- */
  $$('.card').forEach(function (c, i) {
    gsap.from(c, { clipPath: 'inset(14% 8% 14% 8%)', duration: 1.5, ease: 'expo.out', delay: (i % 2) * 0.08, scrollTrigger: { trigger: c, start: 'top 88%', once: true } });
    gsap.from(c.querySelector('.card-label'), { y: 60, autoAlpha: 0, duration: 1.1, ease: 'expo.out', delay: 0.3 + (i % 2) * 0.08, clearProps: 'transform', scrollTrigger: { trigger: c, start: 'top 88%', once: true } });
  });
  gsap.from('.menu-dl', { y: 30, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.menus', start: 'top 92%', once: true } });

  /* ---------- números ---------- */
  gsap.from('.stats-row li', { y: 40, autoAlpha: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: '.stats-row', start: 'top 88%', once: true } });
  $$('[data-count]').forEach(function (el) {
    var end = parseFloat(el.getAttribute('data-count'));
    var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
    var obj = { v: 0 };
    el.textContent = fmt(0, dec);
    gsap.to(obj, { v: end, duration: 2.2, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true }, onUpdate: function () { el.textContent = fmt(obj.v, dec); } });
  });

  /* ---------- ambientes ---------- */
  $$('.tile').forEach(function (fig, i) {
    gsap.from(fig, { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.6, ease: 'expo.out', delay: i * 0.1, scrollTrigger: { trigger: '.amb-collage', start: 'top 80%', once: true } });
  });
  if (window.innerWidth > 760) {
    $$('[data-speed]').forEach(function (fig) {
      var s = parseFloat(fig.getAttribute('data-speed'));
      gsap.fromTo(fig, { yPercent: s * -100 }, { yPercent: s * 100, ease: 'none', scrollTrigger: { trigger: '.amb-collage', start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.fromTo(fig.querySelector('img'), { scale: 1.18 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.amb-collage', start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }

  /* ---------- avaliações ---------- */
  gsap.from('.score-n', { autoAlpha: 0, scale: 0.7, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.review', start: 'top 75%', once: true } });
  gsap.from('.score-stars svg', { autoAlpha: 0, scale: 0, rotation: -90, duration: 0.8, ease: 'back.out(2.5)', stagger: 0.08, scrollTrigger: { trigger: '.review', start: 'top 72%', once: true } });
  if (quoteWords.length) {
    gsap.fromTo(quoteWords, { opacity: 0.25 }, { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: '.review-quote.big', start: 'top 82%', end: 'bottom 50%', scrub: true } });
  }
  gsap.from('.review-quote:not(.big)', { y: 40, autoAlpha: 0, duration: 1.1, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: '.review-list', start: 'top 60%', once: true } });

  /* ---------- eventos ---------- */
  gsap.fromTo('.ev-card', { scale: 0.92 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.eventos', start: 'top bottom', end: 'top 25%', scrub: true } });
  gsap.fromTo('.ev-floreio', { yPercent: 20, rotation: -14 }, { yPercent: -16, rotation: 4, ease: 'none', scrollTrigger: { trigger: '.eventos', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.ev-list li', { autoAlpha: 0, x: -20, duration: 0.9, ease: 'power3.out', stagger: 0.09, scrollTrigger: { trigger: '.ev-list', start: 'top 88%', once: true } });

  /* ---------- reservar ---------- */
  gsap.from('.res', { y: 80, autoAlpha: 0, duration: 1.4, ease: 'expo.out', stagger: 0.15, clearProps: 'transform', scrollTrigger: { trigger: '.res-grid', start: 'top 84%', once: true } });

  /* ---------- assinatura grande: escreve conforme a rolagem ---------- */
  gsap.fromTo('.wm-sig', { '--w': '0%' }, { '--w': '112%', ease: 'none', scrollTrigger: { trigger: '.wordmark', start: 'top 85%', end: 'bottom 75%', scrub: 0.6 } });
  gsap.from('.wm-line', { autoAlpha: 0, y: 24, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.wm-line', start: 'top 95%', once: true } });

  /* ---------- rodapé ---------- */
  gsap.from('.footer-grid > *', { y: 40, autoAlpha: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: '.site-footer', start: 'top 92%', once: true } });

  /* ---------- recalcular depois de fontes e imagens ---------- */
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); prLayout(false); measure(); });
  window.addEventListener('load', function () { ScrollTrigger.refresh(); measure(); onScroll(); });
})();
