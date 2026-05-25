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

  /* DATE MASK */
  const dataInput = document.getElementById('data');
  if (dataInput) {
    dataInput.addEventListener('input', function () {
      let v = this.value.replace(/\D/g, '');
      if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
      if (v.length > 5) v = v.slice(0, 5) + '/' + v.slice(5);
      this.value = v.slice(0, 10);
    });
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