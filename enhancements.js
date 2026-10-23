document.addEventListener('DOMContentLoaded', () => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const nav = document.querySelector('.nav');
  const menu = document.querySelector('.menu-toggle');
  const closeMenu = () => { nav?.classList.remove('open'); menu?.setAttribute('aria-expanded', 'false'); };
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && nav?.classList.contains('open')) {closeMenu();menu?.focus();} });
  document.addEventListener('click', e => {if(!nav?.contains(e.target) && !menu?.contains(e.target))closeMenu();});
  matchMedia('(min-width: 1100px)').addEventListener('change', e => {if(e.matches)closeMenu();});
  document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
    button.parentElement.querySelectorAll('.filter').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  }));
  document.querySelectorAll('.shot-wrap img').forEach(img => {
    const fallback = () => {img.hidden=true;img.closest('.shot-wrap')?.classList.add('preview-unavailable');};
    img.addEventListener('error', fallback);
    if(img.complete && !img.naturalWidth)fallback();
  });
  const progress = document.createElement('div');progress.className='reading-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
  const top = document.createElement('button');top.className='back-to-top';top.type='button';top.textContent='↑';top.setAttribute('aria-label','Back to top');document.body.append(top);
  top.addEventListener('click',()=>window.scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'}));
  let pending=false;
  const update=()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?scrollY/max:0})`;top.hidden=scrollY<600;pending=false;};
  addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(update);}},{passive:true});update();

});

document.addEventListener('DOMContentLoaded',()=>{
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const fine=matchMedia('(hover: hover) and (pointer: fine)');
  document.querySelectorAll('.service-card,.project-card').forEach(card=>{
    const glow=document.createElement('span');glow.className='mj-pointer-glow';glow.setAttribute('aria-hidden','true');card.append(glow);
    let frame=0;
    card.addEventListener('pointermove',e=>{
      if(motion.matches||!fine.matches||frame)return;
      frame=requestAnimationFrame(()=>{const r=card.getBoundingClientRect();card.style.setProperty('--pointer-x',`${e.clientX-r.left}px`);card.style.setProperty('--pointer-y',`${e.clientY-r.top}px`);frame=0;});
    },{passive:true});
  });
});

// Smooth, broad red light follows the pointer without intercepting any controls.
document.addEventListener('DOMContentLoaded',()=>{
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const fine=matchMedia('(hover: hover) and (pointer: fine)');
  const aura=document.createElement('div');aura.className='cursor-aura';aura.setAttribute('aria-hidden','true');document.body.append(aura);
  let frame=0,x=0,y=0;
  addEventListener('pointermove',e=>{
    if(motion.matches||!fine.matches)return;
    x=e.clientX;y=e.clientY;aura.style.opacity='1';
    if(!frame)frame=requestAnimationFrame(()=>{aura.style.transform=`translate3d(${x}px,${y}px,0)`;frame=0;});
  },{passive:true});
  document.documentElement.addEventListener('pointerleave',()=>{aura.style.opacity='0';});
  addEventListener('blur',()=>{aura.style.opacity='0';});
  motion.addEventListener('change',()=>{if(motion.matches)aura.style.opacity='0';});
  document.querySelectorAll('.service-card,.project-card').forEach(card=>{
    card.addEventListener('pointermove',e=>{if(motion.matches||!fine.matches)return;const r=card.getBoundingClientRect();card.style.rotate=`${((e.clientX-r.left)/r.width-.5)*2}deg`;},{passive:true});
    card.addEventListener('pointerleave',()=>{card.style.rotate='';});
  });
});


// Reference-inspired fullscreen navigation, with keyboard and scroll handling.
document.addEventListener('DOMContentLoaded',()=>{
 const toggle=document.querySelector('.menu-toggle'),source=document.querySelector('.nav');
 if(!toggle||!source)return;
 const panel=document.createElement('div');panel.className='reference-menu';panel.id='reference-menu';panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label','Explore MJ Solution');
 const top=document.createElement('div');top.className='reference-menu-top';
 const brand=document.querySelector('.brand').cloneNode(true);const close=document.createElement('button');close.type='button';close.className='reference-close';close.textContent='Close ×';close.setAttribute('aria-label','Close menu');top.append(brand,close);
 const watermark=document.createElement('div');watermark.className='menu-watermark';watermark.textContent='MJ SOLUTION';watermark.setAttribute('aria-hidden','true');
 const links=document.createElement('nav');links.className='reference-links';links.setAttribute('aria-label','Portfolio sections');
 source.querySelectorAll('a').forEach((a,i)=>{const link=a.cloneNode(true);const number=document.createElement('small');number.textContent=String(i+1).padStart(2,'0');link.prepend(number);links.append(link);});
 const note=document.createElement('a');note.className='reference-menu-contact';note.href='mailto:marketing.mjsolutions@gmail.com';note.textContent='Have a project in mind? Let’s talk ↗';panel.append(top,watermark,links,note);document.body.append(panel);
 let opened=false,lastFocus=null,timer;
 const setOpen=value=>{clearTimeout(timer);opened=value;toggle.setAttribute('aria-expanded',String(value));source.classList.remove('open');document.body.classList.toggle('reference-menu-open',value);document.querySelectorAll('main,footer').forEach(e=>e.inert=value);
 if(value){lastFocus=document.activeElement;panel.hidden=false;requestAnimationFrame(()=>panel.classList.add('is-open'));close.focus();}else{panel.classList.remove('is-open');timer=setTimeout(()=>{if(!opened)panel.hidden=true;},matchMedia('(prefers-reduced-motion: reduce)').matches?0:650);lastFocus?.focus();}};
 // Replace the old toggle node to remove its dropdown-specific listener.
 const fresh=toggle.cloneNode(true);toggle.replaceWith(fresh);fresh.setAttribute('aria-controls',panel.id);fresh.setAttribute('aria-expanded','false');fresh.addEventListener('click',()=>{setOpen(!opened);fresh.setAttribute('aria-expanded',String(opened));});
 close.addEventListener('click',()=>{setOpen(false);fresh.setAttribute('aria-expanded','false');fresh.focus();});
 panel.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{setOpen(false);fresh.setAttribute('aria-expanded','false');}));
 document.addEventListener('keydown',e=>{if(!opened)return;if(e.key==='Escape'){e.preventDefault();setOpen(false);fresh.setAttribute('aria-expanded','false');fresh.focus();}if(e.key==='Tab'){const focus=[...panel.querySelectorAll('a,button')];const first=focus[0],last=focus.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
});


// Ambient dots only; a separate, tightly bounded network follows the cursor.
document.addEventListener('DOMContentLoaded',()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let ambient=document.querySelector('.site-network');
 if(!ambient){ambient=document.createElement('canvas');ambient.className='site-network';ambient.setAttribute('aria-hidden','true');document.body.prepend(ambient);}
 document.querySelector('.hero-network')?.remove();
 const local=document.createElement('canvas');local.className='cursor-network';local.setAttribute('aria-hidden','true');document.body.append(local);
 const ctx=ambient.getContext('2d'),ink=local.getContext('2d');if(!ctx||!ink)return;
 const radius=175;let w=0,h=0,points=[],raf=0,last=0;
 const pointer={x:-1000,y:-1000,active:false};
 const nodes=Array.from({length:13},(_,i)=>({angle:i*2.39996,r:40+(i%5)*25,speed:.13+(i%4)*.045,phase:Math.random()*Math.PI*2}));
 const resize=()=>{w=innerWidth;h=innerHeight;const dpr=Math.min(devicePixelRatio||1,1.5);ambient.width=Math.round(w*dpr);ambient.height=Math.round(h*dpr);ambient.style.width=w+'px';ambient.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);local.width=Math.round(radius*2*dpr);local.height=Math.round(radius*2*dpr);local.style.width=radius*2+'px';local.style.height=radius*2+'px';ink.setTransform(dpr,0,0,dpr,0,0);const count=Math.min(170,Math.max(65,Math.round(w*h/9000)));points=Array.from({length:count},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.28,vy:(Math.random()-.5)*.28,r:.7+Math.random()*.6}));};
 const draw=t=>{raf=0;if(document.hidden||reduced.matches)return;raf=requestAnimationFrame(draw);if(t-last<30)return;last=t;
 const light=document.body.dataset.theme==='light';ctx.clearRect(0,0,w,h);
 // No stroke operations on the ambient canvas: only softly drifting dots.
 points.forEach(p=>{p.x=(p.x+p.vx+w)%w;p.y=(p.y+p.vy+h)%h;ctx.fillStyle=light?'rgba(35,35,40,.3)':'rgba(244,105,117,.35)';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();});
 ink.clearRect(0,0,radius*2,radius*2);if(!pointer.active){local.style.opacity='0';return;}local.style.opacity='1';local.style.transform=`translate3d(${pointer.x-radius}px,${pointer.y-radius}px,0)`;
 const rgb=light?'0,0,0':'255,20,40';const seconds=t*.001;
 const active=nodes.map(n=>{const angle=n.angle+seconds*n.speed;const orbit=n.r+Math.sin(seconds*.9+n.phase)*10;return{x:radius+Math.cos(angle)*orbit,y:radius+Math.sin(angle*1.12+n.phase*.12)*orbit};});
 ink.save();ink.beginPath();ink.arc(radius,radius,radius,0,Math.PI*2);ink.clip();
 active.forEach(p=>{ink.fillStyle=`rgba(${rgb},.65)`;ink.beginPath();ink.arc(p.x,p.y,1.45,0,Math.PI*2);ink.fill();});
 const edges=[],degree=active.map(()=>0);
 active.forEach((p,i)=>{for(let j=i+1;j<active.length;j++){const q=active[j],distance=Math.hypot(p.x-q.x,p.y-q.y),threshold=145+Math.sin(seconds*1.1+i*.7+j)*22;if(distance<threshold)edges.push({i,j,distance,threshold});}});
 edges.sort((a,b)=>a.distance-b.distance).forEach(({i,j,distance,threshold})=>{if(degree[i]>=3||degree[j]>=3)return;degree[i]++;degree[j]++;const p=active[i],q=active[j];ink.strokeStyle=`rgba(${rgb},${.24+.22*(1-distance/threshold)})`;ink.lineWidth=.85;ink.beginPath();ink.moveTo(p.x,p.y);ink.lineTo(q.x,q.y);ink.stroke();});ink.restore();
 };
 const start=()=>{if(!raf&&!document.hidden&&!reduced.matches)raf=requestAnimationFrame(draw);};
 addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;pointer.x=e.clientX;pointer.y=e.clientY;pointer.active=true;},{passive:true});
 const leave=()=>{pointer.active=false;local.style.opacity='0';ink.clearRect(0,0,radius*2,radius*2);};
 document.documentElement.addEventListener('pointerleave',leave);addEventListener('blur',leave);addEventListener('resize',resize,{passive:true});document.addEventListener('visibilitychange',()=>{if(document.hidden)leave();else start();});reduced.addEventListener('change',()=>{ctx.clearRect(0,0,w,h);leave();start();});resize();start();
});
