
(() => {
  // Preserve previously shared hash routes while serving crawlable documents.
  const language = document.documentElement.lang;
  const prefix = language === 'en' ? '/en' : '';
  const legacy = {'#/': prefix || '/', '#/bistro': prefix + '/bistro', '#/farm': prefix + '/farm'};
  if (Object.prototype.hasOwnProperty.call(legacy, location.hash)) {
    location.replace(legacy[location.hash]);
    return;
  }
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const navs = document.querySelectorAll('.nav');
  function onScroll() {
    navs.forEach(nav => nav.classList.toggle('solid', document.body.classList.contains('legal-page') || window.scrollY > 80));
  }
  addEventListener('scroll', onScroll, {passive: true});
  onScroll();
  document.querySelectorAll('.nav-toggle').forEach(toggle => {
    const links = toggle.parentElement.querySelector('.nav-links');
    const close = () => {links.removeAttribute('style'); toggle.setAttribute('aria-expanded','false');};
    toggle.addEventListener('click', () => {
      if(toggle.getAttribute('aria-expanded') === 'true') return close();
      toggle.setAttribute('aria-expanded','true');
      links.style.cssText = `display:flex;position:fixed;top:${toggle.parentElement.offsetHeight}px;left:0;right:0;flex-direction:column;background:rgba(246,241,231,.98);padding:24px 32px;gap:20px;box-shadow:0 20px 30px -20px rgba(0,0,0,.4)`;
      links.querySelectorAll('a').forEach(a => a.style.color='var(--ink)');
    });
    links.addEventListener('click', close);
    document.addEventListener('keydown', event => {if(event.key === 'Escape') close();});
    matchMedia('(max-width:900px)').addEventListener('change', close);
  });
  document.querySelectorAll('.hero-bg').forEach(bg => {
    const slides = Array.from(bg.querySelectorAll('.slide'));
    let current = 0;
    if(slides.length < 2 || reducedMotion) return;
    setInterval(() => {
      if(document.hidden) return;
      const next = (current + 1) % slides.length;
      if(slides[next].dataset.background) {
        slides[next].style.backgroundImage = `url("${slides[next].dataset.background}")`;
        delete slides[next].dataset.background;
      }
      slides[current].classList.remove('on');
      slides[next].classList.add('on');
      current = next;
    }, 6000);
  });
  const reveals = document.querySelectorAll('.reveal:not(.in)');
  if('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if(entry.isIntersecting) {entry.target.classList.add('in');observer.unobserve(entry.target);}
    }), {threshold:.08});
    reveals.forEach(element => observer.observe(element));
  } else reveals.forEach(element => element.classList.add('in'));
  document.querySelectorAll('.suite-tabs').forEach(group => {
    const tabs = group.querySelectorAll('.suite-tab');
    const panels = group.parentElement.querySelectorAll('.suite-panel');
    tabs.forEach(tab => tab.addEventListener('click', () => {
      tabs.forEach(button => {button.classList.toggle('active', button === tab);button.setAttribute('aria-pressed',String(button === tab));});
      panels.forEach(panel => panel.classList.toggle('active', panel.dataset.panel === tab.dataset.suite));
    }));
  });
  document.querySelectorAll('.season-switch').forEach(group => {
    const buttons = group.querySelectorAll('button');
    const contents = group.parentElement.querySelectorAll('.season-content .sc');
    buttons.forEach(button => button.addEventListener('click', () => {
      buttons.forEach(item => {item.classList.toggle('active',item === button);item.setAttribute('aria-pressed',String(item === button));});
      contents.forEach(item => item.classList.toggle('active',item.dataset.sc === button.dataset.season));
    }));
  });
  document.querySelectorAll('.suite-thumbs').forEach(strip => {
    const main = strip.parentElement.querySelector('.suite-main');
    const thumbs = strip.querySelectorAll('img');
    function select(thumb) {
      main.src = thumb.src;
      main.alt = thumb.alt;
      main.width = thumb.width;
      main.height = thumb.height;
      thumbs.forEach(item => {item.classList.toggle('on',item === thumb);item.setAttribute('aria-pressed',String(item === thumb));});
    }
    thumbs.forEach((thumb,index) => {
      thumb.classList.toggle('on',index === 0);
      thumb.setAttribute('aria-pressed',String(index === 0));
      thumb.addEventListener('click', () => select(thumb));
      thumb.addEventListener('keydown', event => {if(event.key === 'Enter' || event.key === ' ') {event.preventDefault();select(thumb);}});
    });
  });
})();
