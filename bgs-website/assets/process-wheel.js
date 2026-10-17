(() => {
 'use strict';
 const section=document.querySelector('#process.bgs-process-wheel');if(!section)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const fine=matchMedia('(hover:hover) and (pointer:fine)');
 const nodes=[...section.querySelectorAll('.pw-node')];
 const stages=[...section.querySelectorAll('.pw-stage')];
 const panels=[...section.querySelectorAll('.pw-detail')];
 const path=section.querySelector('.pw-progress');
 const wheel=section.querySelector('.pw-wheel');
 let selected=-1,entered=false,manual=false,frame=0,spotFrame=0;
 const select=(index,announce=false)=>{
  if(index===selected)return;selected=index;
  nodes.forEach((node,i)=>{node.setAttribute('aria-expanded',String(i===index));stages[i].classList.toggle('active',i===index);panels[i].hidden=i!==index;panels[i].classList.toggle('pw-selected',i===index)});
  const color=stages[index].style.getPropertyValue('--node-light');section.style.setProperty('--pw-accent',color);
  if(entered)path.style.strokeDashoffset=String(100-(index+1)*20);
  if(announce){panels[index].setAttribute('role','status');setTimeout(()=>panels[index].removeAttribute('role'),500)}
 };
 section.classList.add('pw-enhanced');section.querySelector('.pw-controls').hidden=false;select(0);
 nodes.forEach((node,i)=>{
  node.addEventListener('click',()=>{manual=true;select(i,true)});
  node.addEventListener('keydown',event=>{
   let next=i;
   if(event.key==='ArrowRight'||event.key==='ArrowDown')next=(i+1)%nodes.length;
   else if(event.key==='ArrowLeft'||event.key==='ArrowUp')next=(i+nodes.length-1)%nodes.length;
   else if(event.key==='Home')next=0;else if(event.key==='End')next=nodes.length-1;else return;
   event.preventDefault();manual=true;nodes[next].focus();select(next,true);
  });
 });
 const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){entered=true;section.classList.add('pw-entered');path.style.strokeDashoffset=String(100-(selected+1)*20);observer.disconnect()}},{threshold:.12});observer.observe(section);
 const onScroll=()=>{
  if(frame)return;frame=requestAnimationFrame(()=>{
   frame=0;if(manual||reduced.matches||!entered)return;
   const rect=section.getBoundingClientRect();
   const progress=Math.max(0,Math.min(1,(innerHeight*.7-rect.top)/(rect.height*.8)));
   select(Math.min(4,Math.floor(progress*5)));
  });
 };
 window.addEventListener('scroll',onScroll,{passive:true});
 const orbit=section.querySelector('.pw-motion');
 orbit.addEventListener('click',()=>{const enabled=orbit.getAttribute('aria-pressed')!=='true';orbit.setAttribute('aria-pressed',String(enabled));orbit.textContent=enabled?'Pause gentle orbit':'Enable gentle orbit';wheel.classList.toggle('pw-orbit',enabled&&!reduced.matches)});
 let targetX=50,targetY=40,x=50,y=40;
 const spotlight=()=>{x+=(targetX-x)*.12;y+=(targetY-y)*.12;section.style.setProperty('--mx',x+'%');section.style.setProperty('--my',y+'%');if(Math.abs(targetX-x)+Math.abs(targetY-y)>.2)spotFrame=requestAnimationFrame(spotlight);else spotFrame=0};
 section.addEventListener('pointermove',event=>{if(!fine.matches||reduced.matches)return;const r=section.getBoundingClientRect();targetX=(event.clientX-r.left)/r.width*100;targetY=(event.clientY-r.top)/r.height*100;if(!spotFrame)spotFrame=requestAnimationFrame(spotlight)},{passive:true});
 reduced.addEventListener('change',()=>{if(reduced.matches){wheel.classList.remove('pw-orbit');orbit.setAttribute('aria-pressed','false');orbit.textContent='Enable gentle orbit'}});
 window.addEventListener('pagehide',()=>{observer.disconnect();window.removeEventListener('scroll',onScroll);cancelAnimationFrame(frame);cancelAnimationFrame(spotFrame)},{once:true});
})();
