(() => {
 const section=document.querySelector('#partners.partner-directory');if(!section)return;
 const tabs=[...section.querySelectorAll('[role=tab]')],panels=[...section.querySelectorAll('[role=tabpanel]')],list=section.querySelector('.pd-tabs'),host=section.querySelector('.pd-panels'),mobile=matchMedia('(max-width:767px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');let active=0,timer=0;
 panels.forEach((p,i)=>{p.inert=i!==0});
 function indicator(){const tab=tabs[active];list.style.setProperty('--pd-indicator-top',`${tab.offsetTop}px`);list.style.setProperty('--pd-indicator-height',`${tab.offsetHeight}px`);list.style.setProperty('--pd-selected-accent',tab.style.getPropertyValue('--pd-accent'));list.setAttribute('aria-orientation',mobile.matches?'horizontal':'vertical')}
 function select(i){if(i===active)return;clearTimeout(timer);const outgoing=panels.find(p=>!p.hidden);active=i;
 tabs.forEach((t,j)=>{t.setAttribute('aria-selected',String(i===j));t.tabIndex=i===j?0:-1});indicator();
 if(mobile.matches){const t=tabs[i];list.scrollTo({left:t.offsetLeft-(list.clientWidth-t.clientWidth)/2,behavior:reduced.matches?'instant':'smooth'})}
 if(outgoing)outgoing.classList.add('pd-leaving');
 const show=()=>{panels.forEach((p,j)=>{p.hidden=j!==i;p.inert=j!==i;p.classList.remove('pd-leaving','pd-entering')});host.style.setProperty('--pd-glow',tabs[i].style.getPropertyValue('--pd-tint'));panels[i].classList.add('pd-entering')};
 if(reduced.matches)show();else timer=setTimeout(show,150);
 }
 tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>select(i));tab.addEventListener('keydown',e=>{let n;if(['ArrowRight','ArrowDown'].includes(e.key))n=(i+1)%tabs.length;if(['ArrowLeft','ArrowUp'].includes(e.key))n=(i+tabs.length-1)%tabs.length;if(e.key==='Home')n=0;if(e.key==='End')n=tabs.length-1;if(n!==undefined){e.preventDefault();tabs[n].focus();select(n)}})});
 new ResizeObserver(indicator).observe(list);if(document.fonts)document.fonts.ready.then(indicator);
 if('IntersectionObserver'in window){section.classList.add('pd-enhanced');const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){section.classList.add('pd-revealed');observer.disconnect()}},{threshold:.08});observer.observe(section)}
 indicator();
})();
