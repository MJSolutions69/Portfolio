document.addEventListener('DOMContentLoaded',()=>{
  const menu=document.querySelector('.menu-toggle');
  const nav=document.querySelector('.nav');
  menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
  document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>{nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false');}));

  const filters=[...document.querySelectorAll('#projects .filter')];
  const cards=[...document.querySelectorAll('#projects .project-card')];
  const render=(value='all')=>{
    cards.forEach(card=>{
      const categories=(card.dataset.category||'').split(/\s+/);
      card.style.display=(value==='all'||categories.includes(value))?'':'none';
    });
  };
  filters.forEach(filter=>filter.addEventListener('click',()=>{
    filters.forEach(x=>x.classList.remove('active'));
    filter.classList.add('active');
    render(filter.dataset.filter);
  }));
  render('all');
  const year=document.getElementById('year');
  if(year) year.textContent=new Date().getFullYear();
});


// Scroll reveal animations
const revealTargets = document.querySelectorAll('.section, .stats-strip, .cta, .footer');
revealTargets.forEach(el => { if(!el.classList.contains('hero')) el.classList.add('reveal'); });
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){ entry.target.classList.add('is-visible'); obs.unobserve(entry.target); }
  });
},{threshold:0.08});
revealTargets.forEach(el => revealObserver.observe(el));
const process = document.querySelector('.process');
if(process){
  const po = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting){ process.classList.add('is-visible'); po.unobserve(process); }}), {threshold:.25});
  po.observe(process);
}
// Small stagger for project cards
document.querySelectorAll('.project-card').forEach((card,i)=>{ card.style.transitionDelay = `${Math.min(i,7)*45}ms`; });

// Testimonial carousel: three cards on desktop, two on tablet, one on mobile.
(function initTestimonials(){
  const track=document.querySelector('.testimonial-track');
  const viewport=document.querySelector('.testimonial-viewport');
  const cards=track ? [...track.querySelectorAll('.testimonial-card')] : [];
  const prev=document.querySelector('.testimonial-arrow.prev');
  const next=document.querySelector('.testimonial-arrow.next');
  const dotsWrap=document.querySelector('.testimonial-dots');
  if(!track || !viewport || !cards.length) return;
  let index=0;
  let timer;
  const perView=()=>window.innerWidth<=760?1:(window.innerWidth<=1050?2:3);
  const maxIndex=()=>Math.max(0,cards.length-perView());
  function buildDots(){
    dotsWrap.innerHTML='';
    const pages=maxIndex()+1;
    for(let i=0;i<pages;i++){
      const b=document.createElement('button');
      b.className='testimonial-dot'+(i===index?' active':'');
      b.type='button'; b.setAttribute('aria-label',`Show testimonials ${i+1}`);
      b.addEventListener('click',()=>go(i,true)); dotsWrap.appendChild(b);
    }
  }
  function go(i,manual=false){
    index=Math.min(Math.max(i,0),maxIndex());
    const cardWidth=cards[0].getBoundingClientRect().width;
    const gap=window.innerWidth<=760?12:18;
    track.style.transform=`translateX(-${index*(cardWidth+gap)}px)`;
    dotsWrap.querySelectorAll('.testimonial-dot').forEach((d,n)=>d.classList.toggle('active',n===index));
    if(manual) restart();
  }
  function restart(){clearInterval(timer);timer=setInterval(()=>go(index>=maxIndex()?0:index+1),5200)}
  prev?.addEventListener('click',()=>go(index<=0?maxIndex():index-1,true));
  next?.addEventListener('click',()=>go(index>=maxIndex()?0:index+1,true));
  window.addEventListener('resize',()=>{index=Math.min(index,maxIndex());buildDots();go(index);});
  buildDots(); go(0); restart();
  viewport.addEventListener('mouseenter',()=>clearInterval(timer));
  viewport.addEventListener('mouseleave',restart);
})();
