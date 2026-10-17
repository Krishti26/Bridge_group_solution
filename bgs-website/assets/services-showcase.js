(() => {
 'use strict';const section=document.querySelector('#core-services.services-showcase');if(!section)return;
 const cards=[...section.querySelectorAll('.sc-card')],reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover:hover) and (pointer:fine)');
 section.classList.add('sc-enhanced');const frames=new Set();
 const play=card=>{
  if(reduced.matches)return;
  card.classList.remove('sc-playing');
  const first=requestAnimationFrame(()=>{frames.delete(first);const second=requestAnimationFrame(()=>{frames.delete(second);if(card.isConnected)card.classList.add('sc-playing')});frames.add(second)});frames.add(first);
 };
 const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('sc-visible');play(entry.target);observer.unobserve(entry.target)}})},{threshold:.18});
 cards.forEach(card=>{
  observer.observe(card);let frame=0,rect,x=0,y=0,tx=0,ty=0,active=false;
  const draw=()=>{
   frame=0;x+=(tx-x)*.15;y+=(ty-y)*.15;
   card.style.setProperty('--sc-rx',(-y*2.5)+'deg');card.style.setProperty('--sc-ry',(x*2.5)+'deg');
   card.style.setProperty('--sc-mx',((x+.5)*100)+'%');card.style.setProperty('--sc-my',((y+.5)*100)+'%');
   card.style.setProperty('--sc-angle',(Math.atan2(y,x)*180/Math.PI+90)+'deg');
   if(Math.abs(tx-x)+Math.abs(ty-y)>.002)frame=requestAnimationFrame(draw);
  };
  card.addEventListener('pointerenter',event=>{if(!fine.matches||event.pointerType==='touch')return;rect=card.getBoundingClientRect();active=true;play(card)},{passive:true});
  card.addEventListener('pointermove',event=>{if(!active||!fine.matches||reduced.matches)return;tx=Math.max(-.5,Math.min(.5,(event.clientX-rect.left)/rect.width-.5));ty=Math.max(-.5,Math.min(.5,(event.clientY-rect.top)/rect.height-.5));if(!frame)frame=requestAnimationFrame(draw)},{passive:true});
  card.addEventListener('pointerleave',()=>{active=false;tx=ty=0;if(!reduced.matches&&!frame)frame=requestAnimationFrame(draw)},{passive:true});
  card.addEventListener('focusin',()=>play(card));
  reduced.addEventListener('change',()=>{if(reduced.matches){cancelAnimationFrame(frame);card.style.setProperty('--sc-rx','0deg');card.style.setProperty('--sc-ry','0deg')}});
  window.addEventListener('pagehide',event=>{if(!event.persisted)cancelAnimationFrame(frame)});
 });
 window.addEventListener('pagehide',event=>{if(!event.persisted){observer.disconnect();frames.forEach(cancelAnimationFrame);frames.clear()}});
})();
