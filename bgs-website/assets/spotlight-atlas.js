(() => {
 const section=document.querySelector('#spotlight-atlas');if(!section)return;
 const cards=[...section.querySelectorAll('.atlas-country')],labels=[...section.querySelectorAll('.atlas-map-card')],strip=section.querySelector('.atlas-countries'),map=section.querySelector('.atlas-map'),spot=section.querySelector('.atlas-spotlight'),tip=section.querySelector('.atlas-tooltip'),connections=section.querySelector('.atlas-connections'),controls=[...section.querySelectorAll('.atlas-controls button')],motion=matchMedia('(prefers-reduced-motion: reduce)'),ns='http://www.w3.org/2000/svg';
 let selected=0,displayed=0;const ix=+cards[0].dataset.x,iy=+cards[0].dataset.y;
 cards.slice(1).forEach((card,j)=>{const x=+card.dataset.x,y=+card.dataset.y,d=`M${ix} ${iy} Q${(ix+x)/2} ${Math.min(iy,y)-Math.min(65,Math.abs(ix-x)*.17+15)} ${x} ${y}`;const path=document.createElementNS(ns,'path');path.setAttribute('d',d);path.setAttribute('pathLength','100');path.dataset.route=j+1;path.classList.add('atlas-connection');path.style.setProperty('--arrival',`${.5+j*.12}s`);connections.append(path);if([1,4,10].includes(j+1)){const pulse=path.cloneNode();pulse.classList.replace('atlas-connection','atlas-occasional-pulse');pulse.style.setProperty('--pulse-delay',`${j*1.7}s`);connections.append(pulse)}});
 function show(index){
  displayed=index;const card=cards[index],x=+card.dataset.x,y=+card.dataset.y;
  spot.style.transform=`translate(${x}px,${y}px)`;
  tip.replaceChildren(...[...card.children].map(el=>el.cloneNode(true)));
  map.setAttribute('aria-label',`Connected nations map. ${card.lastElementChild.textContent} highlighted`);
  [...cards,...labels].forEach(c=>c.classList.toggle('atlas-preview',+(c.dataset.country??c.dataset.label)===index));
  connections.querySelectorAll('[data-route]').forEach(p=>p.classList.toggle('atlas-active-route',+p.dataset.route===index));
  section.querySelectorAll('.atlas-node').forEach((node,i)=>node.classList.toggle('atlas-active-node',i===index));placeTip();
 }
 function placeTip(){const x=+cards[displayed].dataset.x/940*map.clientWidth,y=+cards[displayed].dataset.y/400;const mobile=matchMedia('(max-width:700px)').matches;tip.style.left=`${Math.max(tip.offsetWidth/2+4,Math.min(map.clientWidth-tip.offsetWidth/2-4,x))}px`;tip.style.top=`${(mobile?(1/12+y*5/6):y)*map.clientHeight-10}px`}
 function select(i){selected=i;[...cards,...labels].forEach(c=>c.setAttribute('aria-pressed',String(+(c.dataset.country??c.dataset.label)===i)));show(i);section.querySelector('.atlas-status').textContent=`${cards[i].lastElementChild.textContent} selected`}
 [...cards,...labels].forEach(card=>{const i=+(card.dataset.country??card.dataset.label);
  card.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')show(i)});card.addEventListener('pointerleave',()=>show(selected));card.addEventListener('focus',()=>show(i));card.addEventListener('blur',()=>show(selected));card.addEventListener('click',()=>select(i));
  card.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%cards.length;if(e.key==='ArrowLeft')next=(i+cards.length-1)%cards.length;if(e.key==='Home')next=0;if(e.key==='End')next=cards.length-1;if(next!==undefined){e.preventDefault();const group=card.classList.contains('atlas-country')?cards:labels;group[next].focus();if(group===cards)group[next].scrollIntoView({block:'nearest',inline:'nearest',behavior:motion.matches?'instant':'smooth'})}});
 });
 function updateControls(){const max=strip.scrollWidth-strip.clientWidth;controls[0].disabled=strip.scrollLeft<2;controls[1].disabled=strip.scrollLeft>=max-2;section.querySelector('.atlas-controls').hidden=max<2;placeTip()}
 controls.forEach((b,i)=>b.addEventListener('click',()=>strip.scrollBy({left:(i?1:-1)*strip.clientWidth*.7,behavior:motion.matches?'instant':'smooth'})));
 strip.addEventListener('scroll',updateControls,{passive:true});new ResizeObserver(updateControls).observe(map);
 if('IntersectionObserver'in window){section.classList.add('atlas-enhanced');new IntersectionObserver(entries=>entries.forEach(e=>{section.classList.toggle('atlas-inview',e.isIntersecting);if(e.isIntersecting)section.classList.add('atlas-revealed')}),{threshold:.12}).observe(section)}else section.classList.add('atlas-revealed');
 show(0);updateControls();
})();
