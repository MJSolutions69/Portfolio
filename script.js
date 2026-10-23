document.addEventListener('DOMContentLoaded',()=>{
  // Day/night theme toggle with a remembered preference.
  const themeButton = document.querySelector('.theme-toggle');
  const themeIcon = themeButton?.querySelector('.theme-toggle-icon');
  const themeLabel = themeButton?.querySelector('.theme-toggle-label');
  const themeStorageKey = 'mj-solution-theme';
  const applyTheme = (theme) => {
    const normalized = theme === 'light' ? 'light' : 'dark';
    document.body.dataset.theme = normalized;
    document.documentElement.dataset.theme = normalized;
    const lightMode = normalized === 'light';
    if (themeIcon) themeIcon.textContent = lightMode ? '☾' : '☀';
    if (themeLabel) themeLabel.textContent = lightMode ? 'Night mode' : 'Day mode';
    if (themeButton) {
      themeButton.setAttribute('aria-pressed', String(lightMode));
      themeButton.setAttribute('aria-label', lightMode ? 'Switch to night mode' : 'Switch to day mode');
      themeButton.title = lightMode ? 'Switch to night mode' : 'Switch to day mode';
    }
  };
  // Always start in Night Mode on a fresh page load.
  // The toggle remains functional during the current visit.
  applyTheme('dark');
  themeButton?.addEventListener('click', () => {
    const nextTheme = document.body.dataset.theme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme);
    try { localStorage.setItem(themeStorageKey, nextTheme); } catch (error) {}
  });

  const menu=document.querySelector('.menu-toggle');
  const nav=document.querySelector('.nav');
  menu?.addEventListener('click',()=>{
    const open=nav?.classList.toggle('open')||false;
    menu.setAttribute('aria-expanded',String(open));
  });
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    nav.classList.remove('open');menu?.setAttribute('aria-expanded','false');
  }));

  // Filter featured work by category.
  const filters=[...document.querySelectorAll('#projects .filter')];
  const cards=[...document.querySelectorAll('#projects .project-card')];
  const renderProjects=(value='all')=>{
    cards.forEach((card,i)=>{
      const categories=(card.dataset.category||'').split(/\s+/);
      const visible=value==='all'||categories.includes(value);
      card.style.display=visible?'':'none';
      if(visible){card.style.animation=`cardEnter .45s ${Math.min(i,8)*35}ms both`;}
    });
  };
  filters.forEach(filter=>filter.addEventListener('click',()=>{
    filters.forEach(x=>x.classList.remove('active'));
    filter.classList.add('active');
    renderProjects(filter.dataset.filter);
  }));
  renderProjects('all');

  const year=document.getElementById('year');
  if(year) year.textContent=new Date().getFullYear();

  // Scroll reveal, with a graceful fallback for browsers without IntersectionObserver.
  const revealTargets=[...document.querySelectorAll('.section,.stats-strip,.hero-tech,.portfolio-bridge,.cta,.footer')];
  if('IntersectionObserver' in window){
    const revealObserver=new IntersectionObserver((entries,obs)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },{threshold:.08,rootMargin:'0px 0px -25px 0px'});
    revealTargets.forEach((el,i)=>{
      el.classList.add('reveal');
      el.style.transitionDelay=`${Math.min(i%3,2)*55}ms`;
      revealObserver.observe(el);
    });
    const process=document.querySelector('.process');
    if(process){
      const processObserver=new IntersectionObserver(entries=>entries.forEach(e=>{
        if(e.isIntersecting){process.classList.add('is-visible');processObserver.unobserve(e.target);}
      }),{threshold:.25});
      processObserver.observe(process);
    }
  }else{
    revealTargets.forEach(el=>el.classList.add('is-visible'));
  }

  // Site-wide scroll choreography: use different motions for different content types.
  const motionGroups = [
    { selector: '.section-heading > div', motion: 'motion-left' },
    { selector: '.section-heading > p', motion: 'motion-right' },
    { selector: '.about-industries-grid > article', motion: 'motion-scale' },
    { selector: '.about-points > div', motion: 'motion-left' },
    { selector: '.about-facts > div', motion: 'motion-up' },
    { selector: '.industry-grid > .industry-card', motion: 'motion-soft' },
    { selector: '.service-grid > .service-card', motion: 'motion-up' },
    { selector: '.seo-grid > div', motion: 'motion-scale' },
    { selector: '.career-summary > div', motion: 'motion-left' },
    { selector: '.education-row > *', motion: 'motion-right' },
    { selector: '.project-grid > .project-card', motion: 'motion-zoom' },
    { selector: '.testimonial-track > .testimonial-card', motion: 'motion-soft' },
    { selector: '.tool-stack-grid > .tool-stack-card', motion: 'motion-scale' },
    { selector: '.faq-grid > .faq-item', motion: 'motion-up' },
    { selector: '.process > div', motion: 'motion-tilt' },
    { selector: '.stats-strip > div', motion: 'motion-up' },
    { selector: '.stack-category', motion: 'motion-left' },
    { selector: '.contact-grid > *', motion: 'motion-right' },
    { selector: '.contact-cards > *', motion: 'motion-scale' },
    { selector: '.portfolio-bridge > *', motion: 'motion-left' },
    { selector: '.cta-points > span', motion: 'motion-up' }
  ];
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionRecords = motionGroups.flatMap(group =>
    [...document.querySelectorAll(group.selector)].map(item => ({ item, motion: group.motion }))
  );
  const staggerItems = [...new Set(motionRecords.map(record => record.item))];
  if (!motionPreference.matches && 'IntersectionObserver' in window) {
    motionRecords.forEach(({ item, motion }) => {
      item.classList.add('scroll-item', motion);
      // Stagger each local group independently so each section feels intentional.
      const siblings = item.parentElement ? [...item.parentElement.children] : [item];
      const localIndex = Math.max(0, siblings.indexOf(item));
      item.style.setProperty('--scroll-delay', `${Math.min(localIndex, 4) * 75}ms`);
    });
    const itemObserver = new IntersectionObserver((observations, observer) => {
      observations.forEach(observation => {
        if (observation.isIntersecting) {
          observation.target.classList.add('scroll-item-visible');
          observer.unobserve(observation.target);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -28px 0px' });
    staggerItems.forEach(item => itemObserver.observe(item));
  } else {
    staggerItems.forEach(item => item.classList.add('scroll-item-visible'));
  }
  motionPreference.addEventListener?.('change', event => {
    if (event.matches) {
      staggerItems.forEach(item => item.classList.add('scroll-item-visible'));
      document.querySelectorAll('.career-timeline .timeline-item').forEach(item => {
        item.classList.add('timeline-visible');
        const date = item.querySelector('.timeline-date');
        if (date) date.classList.add('timeline-date-visible');
      });
    }
  });

  // Career timeline: red progress rail follows scroll; each detail enters from the right.
  const careerTimeline = document.querySelector('.career-timeline');
  const careerItems = careerTimeline ? [...careerTimeline.querySelectorAll('.timeline-item')] : [];
  if (careerTimeline && careerItems.length) {
    let progressRail = careerTimeline.querySelector('.timeline-progress');
    if (!progressRail) {
      progressRail = document.createElement('span');
      progressRail.className = 'timeline-progress';
      progressRail.setAttribute('aria-hidden', 'true');
      careerTimeline.prepend(progressRail);
    }

    if (motionPreference.matches || !('IntersectionObserver' in window)) {
      careerItems.forEach(item => {
        item.classList.add('timeline-visible');
        const date = item.querySelector('.timeline-date');
        if (date) date.classList.add('timeline-date-visible');
      });
    } else {
      const timelineRevealObserver = new IntersectionObserver((observations, observer) => {
        observations.forEach(observation => {
          if (observation.isIntersecting) {
            observation.target.classList.add('timeline-visible');
            const date = observation.target.querySelector('.timeline-date');
            if (date) date.classList.add('timeline-date-visible');
            observer.unobserve(observation.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
      careerItems.forEach(item => timelineRevealObserver.observe(item));
    }

    let timelineTicking = false;
    function updateCareerTimeline() {
      const rect = careerTimeline.getBoundingClientRect();
      const marker = window.innerHeight * 0.42;
      const progress = Math.min(careerTimeline.offsetHeight, Math.max(0, marker - rect.top));
      progressRail.style.height = `${progress}px`;

      let activeItem = careerItems[0];
      let closestDistance = Infinity;
      careerItems.forEach(item => {
        const itemRect = item.getBoundingClientRect();
        const point = itemRect.top + Math.min(itemRect.height * 0.18, 65);
        const distance = Math.abs(point - marker);
        if (distance < closestDistance) {
          closestDistance = distance;
          activeItem = item;
        }
      });
      careerItems.forEach(item => item.classList.toggle('timeline-active', item === activeItem));
      timelineTicking = false;
    }
    function requestTimelineUpdate() {
      if (!timelineTicking) {
        window.requestAnimationFrame(updateCareerTimeline);
        timelineTicking = true;
      }
    }
    window.addEventListener('scroll', requestTimelineUpdate, { passive: true });
    window.addEventListener('resize', requestTimelineUpdate, { passive: true });
    updateCareerTimeline();
  }

  // Navigation state follows the visible section.
  const navLinks=[...document.querySelectorAll('.site-header .nav a[href^="#"]')];
  const sections=navLinks.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if('IntersectionObserver' in window && sections.length){
    const activeObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+entry.target.id));
        }
      });
    },{rootMargin:'-35% 0px -55% 0px',threshold:0});
    sections.forEach(s=>activeObserver.observe(s));
  }

  // Testimonial carousel: 3 cards desktop, 2 tablet, 1 mobile; pauses on hover.
  (function initTestimonials(){
    const track=document.querySelector('.testimonial-track');
    const viewport=document.querySelector('.testimonial-viewport');
    const testimonialCards=track?[...track.querySelectorAll('.testimonial-card')]:[];
    const prev=document.querySelector('.testimonial-arrow.prev');
    const next=document.querySelector('.testimonial-arrow.next');
    const dotsWrap=document.querySelector('.testimonial-dots');
    if(!track||!viewport||!testimonialCards.length||!dotsWrap)return;
    let index=0,timer;
    const perView=()=>window.innerWidth<=760?1:(window.innerWidth<=1050?2:3);
    const maxIndex=()=>Math.max(0,testimonialCards.length-perView());
    function buildDots(){
      dotsWrap.innerHTML='';
      for(let i=0;i<=maxIndex();i++){
        const b=document.createElement('button');
        b.className='testimonial-dot'+(i===index?' active':'');
        b.type='button';b.setAttribute('aria-label',`Show testimonials ${i+1}`);
        b.addEventListener('click',()=>go(i,true));
        dotsWrap.appendChild(b);
      }
    }
    function go(i,manual=false){
      index=Math.min(Math.max(i,0),maxIndex());
      const cardWidth=testimonialCards[0].getBoundingClientRect().width;
      const gap=window.innerWidth<=760?12:18;
      track.style.transform=`translateX(-${index*(cardWidth+gap)}px)`;
      dotsWrap.querySelectorAll('.testimonial-dot').forEach((d,n)=>d.classList.toggle('active',n===index));
      if(manual)restart();
    }
    function restart(){clearInterval(timer);if(motionPreference.matches || document.hidden || viewport.matches(':hover') || viewport.contains(document.activeElement))return;timer=setInterval(()=>go(index>=maxIndex()?0:index+1),5200)}
    document.addEventListener('visibilitychange', restart);
    motionPreference.addEventListener?.('change', restart);
    prev?.addEventListener('click',()=>go(index<=0?maxIndex():index-1,true));
    next?.addEventListener('click',()=>go(index>=maxIndex()?0:index+1,true));
    window.addEventListener('resize',()=>{index=Math.min(index,maxIndex());buildDots();go(index);});
    buildDots();go(0);restart();
    viewport.addEventListener('mouseenter',()=>clearInterval(timer));
    viewport.addEventListener('mouseleave',restart);
    viewport.addEventListener('focusin',()=>clearInterval(timer));
    viewport.addEventListener('focusout',restart);
  })();
});


// v11 interactive network: full hero canvas plus a viewport-wide cursor-reactive layer.



/* v43: compact sticky horizontal Tech Stack; deterministic reversible scroll mapping */
(() => {
  const init = () => {
    const runway = document.querySelector('#skills .tool-stack-horizontal');
    const sticky = runway && runway.querySelector('.tool-stack-sticky');
    const track = sticky && sticky.querySelector('.tool-stack-grid');
    if (!runway || !sticky || !track || track.dataset.scrollLinkedV43 === 'true') return;
    track.dataset.scrollLinkedV43 = 'true';

    const mobile = window.matchMedia('(max-width: 700px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let maxShift = 0;
    let travelY = 1;
    let startY = 0;
    let resizeFrame = 0;

    const clearDesktopStyles = () => {
      sticky.removeAttribute('style');
      runway.style.height = '';
      runway.style.minHeight = '';
      track.style.transform = '';
    };

    const measure = () => {
      resizeFrame = 0;
      if (mobile.matches || reduced.matches) {
        clearDesktopStyles();
        return;
      }

      // The sticky viewport holds the heading and cards while the page scrolls
      // through the exact distance needed to translate the complete card row.
      const viewportWidth = sticky.clientWidth;
      maxShift = Math.max(0, track.scrollWidth - viewportWidth);
      if (maxShift < 2) {
        clearDesktopStyles();
        return;
      }

      const heading = runway.querySelector('.section-heading');
      const headingHeight = heading ? heading.offsetHeight : 0;
      const cardsHeight = track.offsetHeight;
      const headerClearance = 118;
      const availableHeight = Math.max(420, window.innerHeight - headerClearance - 38);
      sticky.style.height = `${availableHeight}px`;
      sticky.style.maxHeight = `${availableHeight}px`;
      sticky.style.paddingTop = `${headerClearance}px`;
      sticky.style.paddingBottom = '24px';
      sticky.style.display = 'flex';
      sticky.style.flexDirection = 'column';
      sticky.style.justifyContent = 'center';
      sticky.style.overflow = 'hidden';

      // Scroll runway is only viewport height + horizontal travel; no extra
      // 420px tail, so the next section follows immediately after the animation.
      travelY = Math.max(420, maxShift * 0.62);
      runway.style.height = `${Math.ceil(availableHeight + travelY)}px`;
      runway.style.minHeight = '0';
      startY = runway.getBoundingClientRect().top + window.scrollY;
      update();
    };

    const update = () => {
      if (mobile.matches || reduced.matches || maxShift < 2) return;
      const progress = Math.max(0, Math.min(1, (window.scrollY - startY) / travelY));
      track.style.transform = `translate3d(${-maxShift * progress}px,0,0)`;
    };

    const onScroll = () => update();
    const onResize = () => {
      if (resizeFrame) return;
      resizeFrame = requestAnimationFrame(measure);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('load', onResize, { once: true });
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(onResize);
      observer.observe(track);
    }
    mobile.addEventListener?.('change', onResize);
    reduced.addEventListener?.('change', onResize);
    measure();
    setTimeout(measure, 250);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
