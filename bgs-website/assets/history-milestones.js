(() => {
 const section=document.querySelector('#company-timeline.history-milestones');if(!section)return;
 const viewport=section.querySelector('.hm-viewport'),steps=[...section.querySelectorAll('.hm-step')],years=[...section.querySelectorAll('.hm-years button')],prev=section.querySelector('.hm-prev'),next=section.querySelector('.hm-next'),range=section.querySelector('.hm-scroll'),path=section.querySelector('.hm-path-progress'),glow=section.querySelector('.hm-glow'),reduced=matchMedia('(prefers-reduced-motion:reduce)'),mobile=matchMedia('(max-width:767px)');let active=0,furthest=0,frame=0;
 function activate(i){active=i;section.style.setProperty("--hm-tail",String(i));steps.forEach((s,j)=>s.classList.toggle('hm-active',i===j));years.forEach((b,j)=>b.setAttribute('aria-pressed',String(j===i)));prev.disabled=i===0;next.disabled=i===8}
 steps.forEach(step=>step.querySelectorAll('.hm-icon svg path,.hm-icon svg circle').forEach(shape=>shape.setAttribute('pathLength','100')));
 function reveal(i){steps[i].classList.add('hm-seen');furthest=Math.max(furthest,i);path.style.strokeDashoffset=String(100-furthest/8*100);glow.setAttribute('cx',String(174+furthest*350));glow.setAttribute('cy',String(552-furthest*12));if(i===8)section.classList.add('hm-complete')}
 function go(i){i=Math.max(0,Math.min(8,i));activate(i);if(mobile.matches){steps[i].scrollIntoView({block:'center',behavior:reduced.matches?'instant':'smooth'})}else viewport.scrollTo({left:steps[i].offsetLeft-14,behavior:reduced.matches?'instant':'smooth'})}
 years.forEach((b,i)=>b.addEventListener('click',()=>go(i)));prev.addEventListener('click',()=>go(active-1));next.addEventListener('click',()=>go(active+1));range.addEventListener('input',()=>{viewport.scrollLeft=+range.value/100*(viewport.scrollWidth-viewport.clientWidth)});
 function tightenTop(){
  if(mobile.matches){section.style.removeProperty('--hm-crop');return}
  const left=viewport.scrollLeft,right=left+viewport.clientWidth;
  const visible=steps.filter(step=>step.offsetLeft+step.offsetWidth>left+12&&step.offsetLeft<right-12);
  const top=Math.min(...visible.map(step=>step.querySelector('.hm-card').offsetTop));
  section.style.setProperty('--hm-crop',`${Number.isFinite(top)?Math.max(0,top-24):0}px`);
 }
 function sync(){frame=0;tightenTop();const max=viewport.scrollWidth-viewport.clientWidth;range.value=max?String(viewport.scrollLeft/max*100):'0';if(!mobile.matches)activate(Math.min(8,Math.round(viewport.scrollLeft/350)))}
 viewport.addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(sync)},{passive:true});viewport.addEventListener('keydown',e=>{if(e.target!==viewport)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();go(active+(e.key==='ArrowRight'?1:-1))}if(e.key==='Home'){e.preventDefault();go(0)}if(e.key==='End'){e.preventDefault();go(8)}});
 steps.forEach((step,i)=>step.querySelector('.hm-card').addEventListener('focus',()=>{activate(i);reveal(i)}));
 if('IntersectionObserver'in window){section.classList.add('hm-enhanced');path.style.strokeDashoffset='100';new IntersectionObserver(entries=>{entries.forEach(e=>{section.classList.toggle('hm-inview',e.isIntersecting);if(e.isIntersecting)section.classList.add('hm-heading-visible')})},{threshold:.05}).observe(section);const observer=new IntersectionObserver(entries=>{entries.filter(e=>e.isIntersecting).sort((a,b)=>steps.indexOf(a.target)-steps.indexOf(b.target)).forEach(e=>{const i=steps.indexOf(e.target);reveal(i);if(mobile.matches)activate(i);observer.unobserve(e.target)})},{threshold:.25});steps.forEach(s=>observer.observe(s))}else{section.classList.add('hm-complete');steps.forEach((_,i)=>reveal(i))}
 new ResizeObserver(sync).observe(viewport);window.addEventListener('resize',tightenTop,{passive:true});if(document.fonts)document.fonts.ready.then(tightenTop);activate(0);tightenTop();
})();
