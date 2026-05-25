/* Scripts extraídos de agape-landing-v4 (2).html */

(function () {
  'use strict';

  /* NAV SCROLL */
  const nav = document.getElementById('nav');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 60); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* MOBILE BURGER */
  const burger = document.getElementById('burger');
  const navLinks = document.querySelector('.nav__links');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      burger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  /* SCROLL REVEAL */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = entry.target.parentElement.querySelectorAll('.reveal-stagger');
        siblings.forEach((el, i) => setTimeout(() => el.classList.add('visible'), i * 110));
        staggerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  document.querySelectorAll('.reveal-stagger').forEach(el => staggerObserver.observe(el));

  /* CAROUSEL */
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('carouselDots');

  if (track) {
    const slides = track.querySelectorAll('.carousel__slide');
    const total = slides.length;
    let current = 0, autoTimer;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel__dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Ir para foto ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    function goTo(idx) {
      current = (idx + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dotsContainer.querySelectorAll('.carousel__dot').forEach((d, i) => d.classList.toggle('active', i === current));
    }
    function startAuto() { autoTimer = setInterval(() => goTo(current + 1), 4500); }
    function stopAuto() { clearInterval(autoTimer); }

    prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
    nextBtn.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) { stopAuto(); goTo(current + (dx < 0 ? 1 : -1)); startAuto(); }
    });
    startAuto();
  }

  /* DATE PICKER */
  const dataInput = document.getElementById('data');
  if (dataInput) {
    const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    const DIAS  = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
    let cal = null, curYear, curMonth;

    function parseSel() {
      const v = dataInput.value;
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(v)) {
        const [d, m, y] = v.split('/').map(Number);
        if (m >= 1 && m <= 12 && d >= 1 && d <= 31) return new Date(y, m - 1, d);
      }
      return null;
    }

    function openCal() {
      if (cal) return;
      const sel = parseSel();
      const ref = sel || new Date();
      curYear  = ref.getFullYear();
      curMonth = ref.getMonth();

      cal = document.createElement('div');
      cal.className = 'agape-cal';
      document.body.appendChild(cal);
      renderCal(sel);
      positionCal();
    }

    function positionCal() {
      const r = dataInput.getBoundingClientRect();
      cal.style.top  = (r.bottom + window.scrollY + 6) + 'px';
      cal.style.left = (r.left  + window.scrollX) + 'px';
    }

    function renderCal(sel) {
      const today = new Date();
      const first = new Date(curYear, curMonth, 1);
      const last  = new Date(curYear, curMonth + 1, 0);
      const startDow = first.getDay();

      let html = `
        <div class="agape-cal__header">
          <button class="agape-cal__nav" data-nav="-1">&#8249;</button>
          <span class="agape-cal__title">${MESES[curMonth]} ${curYear}</span>
          <button class="agape-cal__nav" data-nav="1">&#8250;</button>
        </div>
        <div class="agape-cal__grid">
          ${DIAS.map(d => `<div class="agape-cal__dow">${d}</div>`).join('')}`;

      for (let i = 0; i < startDow; i++)
        html += `<div class="agape-cal__day agape-cal__day--other"></div>`;

      for (let d = 1; d <= last.getDate(); d++) {
        const isToday = today.getFullYear() === curYear && today.getMonth() === curMonth && today.getDate() === d;
        const isSel   = sel && sel.getFullYear() === curYear && sel.getMonth() === curMonth && sel.getDate() === d;
        let cls = 'agape-cal__day';
        if (isToday) cls += ' agape-cal__day--today';
        if (isSel)   cls += ' agape-cal__day--selected';
        html += `<div class="${cls}" data-d="${d}">${d}</div>`;
      }

      html += `</div>
        <hr class="agape-cal__sep">
        <button class="agape-cal__clear">Limpar</button>`;
      cal.innerHTML = html;

      cal.querySelectorAll('[data-nav]').forEach(btn => {
        btn.addEventListener('click', e => {
          e.stopPropagation();
          curMonth += parseInt(btn.dataset.nav);
          if (curMonth > 11) { curMonth = 0;  curYear++; }
          if (curMonth < 0)  { curMonth = 11; curYear--; }
          renderCal(parseSel());
        });
      });

      cal.querySelectorAll('[data-d]').forEach(cell => {
        cell.addEventListener('click', e => {
          e.stopPropagation();
          const d  = cell.dataset.d.padStart(2, '0');
          const m  = String(curMonth + 1).padStart(2, '0');
          dataInput.value = `${d}/${m}/${curYear}`;
          closeCal();
        });
      });

      cal.querySelector('.agape-cal__clear').addEventListener('click', e => {
        e.stopPropagation();
        dataInput.value = '';
        closeCal();
      });
    }

    function closeCal() {
      if (cal) { cal.remove(); cal = null; }
    }

    dataInput.setAttribute('readonly', true);
    dataInput.addEventListener('click', openCal);
    dataInput.addEventListener('focus', openCal);
    document.addEventListener('click', e => {
      if (cal && !cal.contains(e.target) && e.target !== dataInput) closeCal();
    });
    window.addEventListener('scroll', () => { if (cal) positionCal(); }, { passive: true });
    window.addEventListener('resize', () => { if (cal) positionCal(); });
  }

  /* PHONE MASK */
  const phoneInput = document.getElementById('telefone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      let v = this.value.replace(/\D/g, '');
      if (v.length <= 10) v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
      else v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
      this.value = v;
    });
  }

})();