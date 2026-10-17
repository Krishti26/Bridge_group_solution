/* Presentation-only adaptation. No reference copy, links, analytics or contact integrations. */
(() => {
  'use strict';
  const $ = (s,r=document) => r.querySelector(s);
  const $$ = (s,r=document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const root = new URL('.', document.currentScript.src);
  const add = (el,...names) => el && el.classList.add(...names);
  const pathname=location.pathname;
  const isHome=pathname==='/' || pathname==='/index.html';
  if(isHome){
    const loaderStarted=performance.now();
    const loader = document.createElement('div');
    loader.className='ref-loader ref-home-loader'; loader.setAttribute('aria-hidden','true');
    document.body.classList.add('home-loading');
    const logo=document.createElement('img'); logo.src=new URL('logo.webp',root); logo.alt='';
    const progress=document.createElement('div'); progress.className='ref-loader-track';
    const orbit=document.createElement('div');orbit.className='ref-loader-orbit';
    const ring=document.createElement('div');ring.className='ref-loader-ring';
    const brand=document.createElement('div');brand.className='ref-loader-brand';brand.textContent='Bridge Group Solutions';
    orbit.append(ring,logo);loader.append(orbit,brand,progress);
    document.body.append(loader);
    let finishing=false;
    const finish = () => {
      if(finishing)return;finishing=true;
      const remaining=!reduced.matches ? 0 : 0;
      setTimeout(()=>{
        loader.classList.add('complete');document.body.classList.remove('home-loading');
        setTimeout(()=>loader.remove(),650);
      },remaining);
    };
    requestAnimationFrame(finish);
    setTimeout(finish,1200);
  }

  const main=$('main'); if(!main){finish();return}
  const isPortfolio=pathname.includes('portfolio');
  const isAbout=pathname.includes('about');
  const sections=$$('section',main);
  sections.forEach((section,index)=>{
    add(section,'ref-section');
    if(index===0 && $('h1',section)) add(section,'ref-hero');
    else if(/bg-surface-container/.test(section.className) && !section.classList.contains('faq-section')) add(section,'ref-wide');
    const heading=$('h2',section);
    if(heading){
      const box=heading.parentElement;
      if(box!==section && !box.classList.contains('grid') && !box.classList.contains('text-left') && !box.classList.contains('items-start')) add(box,'ref-section-heading');
      if(index%2===0 && !section.classList.contains('faq-section') && section.id!=='founders' && section.id!=='domestic-clients' && section.id!=='our-work' && section.id!=='features' && !pathname.includes('/services/') && !box.classList.contains('text-center') && !box.classList.contains('items-center') && !box.classList.contains('text-left') && !box.classList.contains('items-start')) add(box,'ref-heading-right');
    }
  });
  $$(':is(h1,h2,h3,h4) :is(span.italic, em, .text-primary.italic, span[class*="italic"]:not(.font-label-code))').forEach(el=>{
    add(el,'ref-accent');
    add(el,'ref-gradient');
  });

  // Tech marks use technologies already named in the original BGS content.
  const techMarks=[
    [['React','<g fill="none" stroke="#149eca" stroke-width="2"><ellipse rx="19" ry="7"/><ellipse rx="19" ry="7" transform="rotate(60)"/><ellipse rx="19" ry="7" transform="rotate(120)"/></g><circle r="3.5" fill="#149eca"/>'],
     ['Angular','<path d="M0-22 21-14 18 15 0 25-18 15-21-14Z" fill="#dd0031"/><path d="m0-16-13 29h6l3-7h8l3 7h6Zm0 10 3 7h-6Z" fill="white"/>']],
    [['Node.js','<path d="m0-23 20 12v23L0 24-20 12v-23Z" fill="#539e43"/><path d="M-9 11V-11h5L8 3v-14h5v22H8L-4-3v14Z" fill="white"/>'],
     ['Django','<text x="0" y="13" text-anchor="middle" font-family="Arial,sans-serif" font-size="39" font-weight="bold" fill="#092e20">dj</text>']],
    [['AWS','<text x="0" y="3" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" font-weight="bold" fill="#232f3e">aws</text><path d="M-18 11Q0 23 19 10M12 9l8 0-2 7" fill="none" stroke="#ff9900" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'],
     ['Azure','<path d="m-3-23-19 33h12l9-22Zm5 0 20 42H-9l25-5-9-17Z" fill="#0089d6"/>']]
  ];
  const hero=$('.ref-hero');
  if(isHome && hero){
    add(hero,'ref-home-hero');
    const grid=$(':scope > .grid',hero), title=$('h1',hero);
    if(grid && title){
      const copy=grid.firstElementChild, visual=grid.lastElementChild;
      const images=$$('img',visual);
      const targets=['Technology','Drives','Forward.'];
      images.forEach((img,i)=>{
        const frame=img.parentElement.parentElement; add(frame,'ref-hero-picture','ref-tech-stack');
        frame.replaceChildren();
        techMarks[i].forEach(([name,mark])=>{
          const icon=document.createElement('span');icon.className='ref-tech-mark';icon.title=name;icon.setAttribute('aria-hidden','true');
          icon.innerHTML=`<svg viewBox="-28 -28 56 56" xmlns="http://www.w3.org/2000/svg" focusable="false">${mark}</svg>`;
          frame.append(icon);
        });
        const walker=document.createTreeWalker(title,NodeFilter.SHOW_TEXT);
        let node,placed=false;
        while(node=walker.nextNode()){
          const at=node.textContent.indexOf(targets[i]);
          if(at>=0){
            const word=node.splitText(at);word.splitText(targets[i].length);
            const phrase=document.createElement('span');phrase.className='ref-tech-phrase';
            word.before(phrase);phrase.append(word,frame);placed=true;break;
          }
        }
        if(!placed) title.append(frame);
      });
      visual.remove(); // The three photo tiles are replaced by tech-stack icons.
      const bottom=document.createElement('div'); bottom.className='ref-home-bottom';
      const para=$(':scope > p',copy), actions=$(':scope > div.flex.flex-wrap',copy), stats=$(':scope > div.grid',copy);
      [para,actions,stats].filter(Boolean).forEach(el=>bottom.append(el));
      copy.append(bottom);
      add($(':scope > div:first-child',copy),'ref-hero-eyebrow');
      add($('.ref-accent',title),'ref-accent-pill');
    }
  }

  // Let the blog use the same direct hero structure as About.
  if(hero && (pathname.includes('blogs') || pathname.includes('careers'))){
    const wrapper=$(':scope > div:has(> .grid)',hero);
    if(wrapper) wrapper.replaceWith(...wrapper.childNodes);
  }
  // Other original page heroes use the same full-width editorial hierarchy.
  if(hero && !isHome){
    const grid=$(':scope > .grid',hero),title=$('h1',hero);
    if(grid && title){
      hero.insertBefore(title,grid);add(grid,'ref-page-hero-grid');add(hero,'ref-page-hero');
      const copy=grid.firstElementChild;copy.className+=' ref-page-hero-copy';
      const visual=grid.lastElementChild;add(visual,'ref-page-hero-visual');
      $$('img',visual).forEach(img=>{const frame=img.parentElement;if(frame!==visual)add(frame,'ref-image-frame')});
    }
  }
  // Card families and two-column solution layout.
  $$('.bento-card,.bento-card-hover,.hover-lift,.sales-card,.sales-pillar-box,.sales-bento-hero,.sales-section-box,.blog-card',main).forEach(card=>{
    if(card.closest('#company-timeline')) return;
    add(card,'ref-card');
  });
  $$('.grid',main).forEach(grid=>{
    if(grid.closest('#focus-industries')) return;
    const cards=[...grid.children].filter(el=>el.classList.contains('ref-card'));
    if(cards.length>=2 && !grid.classList.contains('timeline-grid')){
      add(grid,'ref-card-grid');
      if(cards.length>6) cards.forEach(card=>add(card,'ref-small-card'));
    }
  });
  // Some original cards are anonymous. Identify them by their own heading and grid parent.
  $$('h3',main).forEach(h=>{
    let card=h.parentElement;
    while(card && card!==main && !card.parentElement?.classList.contains('grid')) card=card.parentElement;
    if(card && card!==main && card.parentElement?.classList.contains('grid') && !card.parentElement.classList.contains('timeline-grid') && !card.classList.contains('grid') && !card.classList.contains('timeline-row')){
      if(card.querySelectorAll('h3').length===1 && !card.closest('.ref-hero') && !card.closest('#founders') && !card.closest('#company-timeline') && !card.closest('#focus-industries')) add(card,'ref-card');
    }
  });
  $$('.grid',main).forEach(grid=>{
    if(grid.closest('#focus-industries')) return;
    if(!grid.classList.contains('timeline-grid') && [...grid.children].filter(el=>el.classList.contains('ref-card')).length>=2) add(grid,'ref-card-grid');
  });
  // Group card icons and headings into a vertically centered flex row
  $$('.ref-card-grid > .ref-card, .ref-card',main).forEach(card=>{
    if(card.closest('#focus-industries,#founders-pillars,#company-timeline') || card.classList.contains('pillar-card') || card.classList.contains('ref-timeline-card')) return;
    // CRM benefit cards use separate corner positions for their number and icon,
    // with the heading on its own centered row below them.
    if(card.closest('#why') && document.querySelector('link[rel="canonical"][href$="/services/crm.html"]')) return;
    const h=card.querySelector(':scope > h3, :scope > h4');
    if(!h || h.closest('#b2b-tech-modules'))return;
    const prev=h.previousElementSibling;
    const icon=prev && (prev.tagName==='DIV'||prev.querySelector('.material-symbols-outlined')||prev.classList.contains('sales-icon-box'))?prev:null;
    if(icon && icon!==h && !icon.classList.contains('sales-num-badge') && !icon.classList.contains('ref-card-header-flex')){
      const wrap=document.createElement('div');
      wrap.className='ref-card-header-flex';
      icon.before(wrap);
      wrap.append(icon,h);
    }
  });

  // Tag cards with their icon/badge color palette for matching hover states
  const paletteMatchers = [
    { name: 'violet', regex: /violet|purple|8b5cf6|6d28d9|7c3aed|a855f7/i },
    { name: 'emerald', regex: /emerald|green|10b981|059669|34d399/i },
    { name: 'amber', regex: /amber|yellow|orange|f59e0b|d97706|fbbf24/i },
    { name: 'sky', regex: /sky|blue|cyan|0ea5e9|2563eb|0284c7|38bdf8/i },
    { name: 'indigo', regex: /indigo|6366f1|4f46e5|818cf8/i },
    { name: 'teal', regex: /teal|14b8a6|0d9488|2dd4bf/i },
    { name: 'rose', regex: /rose|red|f43f5e|e11d48|fb7185/i },
    { name: 'primary', regex: /primary|eb5737|ad2b0e|ff7849/i }
  ];
  $$('.ref-card, .bento-card, .group, .service-card, [class*="rounded-2xl"], [class*="rounded-3xl"]', main).forEach(card => {
    if (card.closest('#focus-industries, #navbar') || card.classList.contains('ref-dark')) return;
    if (card.dataset.cardColor) return;

    const badgeElements = card.querySelectorAll(
      '[class*="w-8"], [class*="w-9"], [class*="w-10"], [class*="w-11"], [class*="w-12"], [class*="w-14"], [class*="w-16"], ' +
      '[class*="rounded-xl"], [class*="rounded-2xl"], [class*="rounded-full"], ' +
      '.material-symbols-outlined, span.font-label-code, svg'
    );

    let textPool = '';
    badgeElements.forEach(el => {
      textPool += ' ' + (el.className || '') + ' ' + (el.getAttribute('style') || '');
    });

    for (const p of paletteMatchers) {
      if (p.regex.test(textPool)) {
        card.setAttribute('data-card-color', p.name);
        break;
      }
    }
  });
  if(isHome){
    const ethos=$('#ethos'), layout=ethos && $(':scope > .grid',ethos);
    if(layout){add(layout,'ref-process-layout');add(layout.firstElementChild,'ref-process-heading');add(layout.lastElementChild,'ref-process-list')}
    add($('#focus-industries'),'ref-dark');
    const sales=$('#sales');
    if(sales){$$('.sales-section-box',sales).forEach(el=>add(el,'ref-investment-panel'));$$('.sales-pill-badge',sales).forEach(el=>add(el,'ref-pill','ref-floating'))}
  }
  if(pathname.includes('why-bgs')){
    // Keep founders light so pillar cards can stack cleanly
  }
  if(pathname.includes('/services/')){
    $$('#contact, #cta').forEach(el=>add(el,'ref-final-cta'));
  }
  // Reference project rows and pointer-following image previews on the existing portfolio.
  let preview;
  if(isPortfolio){
    $$('.bento-card',main).forEach(card=>{
      if(!$('img.project-card-img',card)) return;
      add(card,'ref-project-row');card.classList.remove('ref-card');
      add(card.parentElement,'ref-project-list');card.parentElement.classList.remove('ref-card-grid');
      const img=$('img.project-card-img',card); add(img.parentElement,'ref-project-image');
      const h=$('h3',card); if(h) add(h.previousElementSibling,'ref-project-meta');
      card.addEventListener('pointerenter',()=>{
        if(!fine.matches || reduced.matches || innerWidth<1024) return;
        if(!preview){preview=document.createElement('div');preview.className='ref-hover-preview';preview.setAttribute('aria-hidden','true');const p=document.createElement('img');p.alt='';preview.append(p);document.body.append(preview)}
        // Decorative preview reuses the existing image URL and adds no text.
        $('img',preview).src=img.currentSrc || img.src;
      });
      card.addEventListener('pointermove',e=>{
        if(!preview || innerWidth<1024) return;
        const x=Math.max(12,Math.min(e.clientX+26,innerWidth-452));
        const y=Math.max(12,Math.min(e.clientY-125,innerHeight-260));
        preview.style.transform=`translate3d(${x}px,${y}px,0)`;preview.classList.add('visible');
      });
      card.addEventListener('pointerleave',()=>preview?.classList.remove('visible'));
    });
  }

  // Original controls receive the reference CTA and text-link styles.
  function controls(scope=document){
    const footer=scope.matches?.('footer')?scope:$('footer',scope);
    if(footer && !footer.dataset.refReady){
      footer.dataset.refReady='true';
      const contact=$('a[href$="contact.html"]',footer),brand=$('.footer-col-1',footer);
      if(contact && brand){add(contact,'ref-footer-cta','ref-button');brand.append(contact)}
    }
    $$('a,button',scope).forEach(el=>{
      if(el.closest('.faq-trigger') || el.classList.contains('faq-trigger') || el.id==='mobile-menu-btn' || el.id==='mobile-services-btn') return;
      const className=el.className;
      if(typeof className!=='string') return;
      if(/btn-primary|text-white|shadow-\[0_\d+px/.test(className) && !el.closest('.bgs-arch-footer')) add(el,'ref-button','amph-cta-ring');
      else if(el.closest('main') && el.tagName==='A' && /rounded-full|font-label-pill/.test(className)) add(el,'ref-text-link');
    });
  }
  controls();
  const componentObserver=new MutationObserver(records=>{
    records.forEach(record=>record.addedNodes.forEach(node=>{
      if(node.nodeType===1 && (node.matches('header,footer') || node.querySelector('header,footer'))) controls(node);
    }));
  });
  componentObserver.observe(document.body,{childList:true,subtree:true});

  // Exact original words wrapped for staggered blur reveals.
  function splitWords(el){
    if(el.dataset.refSplit) return;
    el.dataset.refSplit='true';
    const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
    const nodes=[];let node;
    while(node=walker.nextNode()) if(node.textContent.trim() && !node.parentElement.closest('.material-symbols-outlined,.ref-hero-picture')) nodes.push(node);
    let index=0;
    nodes.forEach(text=>{
      const frag=document.createDocumentFragment();
      text.textContent.split(/(\s+)/).forEach(token=>{
        if(!token) return;
        if(/^\s+$/.test(token)) frag.append(document.createTextNode(token));
        else {const span=document.createElement('span');span.className='ref-word';span.textContent=token;span.style.setProperty('--word-delay',`${Math.min(index++*.035,.6)}s`);frag.append(span)}
      });
      text.replaceWith(frag);
    });
  }
  const io=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{
    if(isIntersecting){target.classList.remove('pending');target.classList.add('visible');target.dataset.inView='true';io.unobserve(target)}
  }),{threshold:.08,rootMargin:'0px 0px -15px 0px'});
  $$('main h2,main .ref-quote').forEach(el=>{splitWords(el);add(el,'ref-reveal');if(!reduced.matches) add(el,'pending');io.observe(el)});
  $$('.ref-card,.timeline-row',main).forEach((el,i)=>{add(el,'ref-fade');if(!reduced.matches) add(el,'pending');el.style.transitionDelay=`${Math.min(i%4*.07,.21)}s`;io.observe(el)});

  // Reuse the original marquee tracks. Reviews animate with original cards only.
  const marquees=[];
  if(isHome && hero){
    const strip=hero.nextElementSibling;
    const group=strip && $(':scope > div > div:last-child',strip);
    if(group && group.children.length===4){
      add(strip,'ref-marquee-section');add(group,'ref-metrics-belt');
      const viewport=document.createElement('div');viewport.className='ref-marquee-viewport';group.before(viewport);viewport.append(group);
      const header=viewport.previousElementSibling;add(header,'ref-metrics-heading');
      let offset=0,last=0,paused=false;
      viewport.addEventListener('pointerenter',()=>paused=true);viewport.addEventListener('pointerleave',()=>paused=false);
      viewport.addEventListener('focusin',()=>paused=true);viewport.addEventListener('focusout',()=>paused=false);
      const tick=time=>{const dt=last?Math.min(time-last,40):0;last=time;const r=viewport.getBoundingClientRect();
        if(!reduced.matches && !paused && r.bottom>0 && r.top<innerHeight){offset-=dt*.02;const first=group.firstElementChild;const step=first.getBoundingClientRect().width+parseFloat(getComputedStyle(group).gap);if(offset<=-step){group.append(first);offset+=step}group.style.transform=`translate3d(${offset}px,0,0)`}requestAnimationFrame(tick)};
      requestAnimationFrame(tick);
    }
  }
  $$('.animate-marquee',main).forEach(belt=>{
    add(belt,'ref-marquee-belt');add(belt.parentElement,'ref-marquee-viewport');
    const section=belt.closest('section');if(section)add(section,'ref-marquee-section');
    belt.style.setProperty('--marquee-distance',`${belt.scrollWidth/2}px`);
    marquees.push(belt);
  });
  const impact=$('#impact');
  if(impact){
    add(impact,'ref-grid-background');
    const grids=$$('.grid',impact), reviews=grids.find(grid=>[...grid.children].some(card=>card.textContent.includes('Anil Gupta')));
    if(reviews){
      [...reviews.children].forEach(card=>add(card,'ref-card'));
    }
  }
  // Hover tilt on original hero visuals and image frames.
  $$('.ref-hero-picture,.ref-hero .ref-card').forEach(el=>{
    el.addEventListener('pointermove',e=>{if(!fine.matches || reduced.matches)return;const r=el.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(700px) rotateX(${-y*9}deg) rotateY(${x*12}deg)`});
    el.addEventListener('pointerleave',()=>el.style.transform='');
  });
  // Existing timeline fills progressively with the same soft entrance / dot pulse vocabulary.
  const timeline=$('#company-timeline');
  if(timeline){
    add($('div.absolute.bg-gradient-to-b',timeline),'ref-timeline-spine');
    $$('.timeline-row',timeline).forEach(row=>{
      const dot=$(':scope > .absolute',row);if(dot)add(dot,'ref-timeline-node');
      const wrapper=[...row.children].find(el=>el.querySelector('.bento-card'));add(wrapper,'ref-milestone-content');
      const context=[...row.children].find(el=>el.classList.contains('hidden'));add(context,'ref-milestone-context');
      const card=$('.bento-card',row);if(card)add(card,'ref-timeline-card');
    });
  }
  // Scroll-pinned original statement with word motion and a sweeping accent pill.
  const statement=impact && $('.ref-section-heading > p',impact);
  if(statement){
    add(statement,'ref-quote','ref-scroll-statement');splitWords(statement);
    const words=$$('.ref-word',statement);
    words.forEach((word,i)=>{word.style.setProperty('--morph-index',i);if(i%3===1)add(word,'ref-morph-pill')});
  }
  // Reference investment disclosures, populated only with the original sales module copy.
  $$('#b2b-tech-modules,#b2c-tech-modules').forEach((list,listIndex)=>{
    add(list,'ref-investment-list');list.classList.remove('ref-card-grid');
    $$('.sales-card',list).forEach((card,index)=>{
      const h=$('h5',card),ul=$('ul',card);if(!h || !ul)return;
      card.classList.remove('ref-card','ref-fade','pending');add(card,'ref-investment-item');
      const button=document.createElement('button');button.type='button';
      while(h.firstChild)button.append(h.firstChild);
      h.append(button);button.setAttribute('aria-expanded','false');
      const panel=document.createElement('div');panel.className='ref-investment-collapse';
      const inner=document.createElement('div');inner.className='ref-investment-inner';
      panel.id=`ref-investment-${listIndex}-${index}`;button.setAttribute('aria-controls',panel.id);
      ul.before(panel);inner.append(ul);panel.append(inner);
      card.classList.remove('open');panel.inert=true;

      const setOpen=(open)=>{
        card.classList.toggle('open',open);
        button.setAttribute('aria-expanded',String(open));
        panel.inert=!open;
      };

      card.addEventListener('mouseenter',()=>setOpen(true));
      card.addEventListener('mouseleave',()=>setOpen(false));
      button.addEventListener('focus',()=>setOpen(true));
      card.addEventListener('focusout',(e)=>{if(!card.contains(e.relatedTarget))setOpen(false)});
      button.addEventListener('click',(e)=>{
        e.stopPropagation();
        setOpen(!card.classList.contains('open'));
      });
    });
  });
  // Sticky stacks: retain original card dimensions and overlap consecutive rows on scroll.

  const stackGroups=[];
  function hasDarkBackground(card){
    if(card.closest('.ref-dark,.ref-final-cta,.pulse-ai-card,.bg-inverse-surface,.bg-black,.bgs-dark-card,.bgs-dark-surface'))return true;
    for(let element=card;element && element!==main.parentElement;element=element.parentElement){
      const color=getComputedStyle(element).backgroundColor;
      const components=color.match(/[\d.]+/g);
      if(!components || components.length<3 || (components.length>3 && Number(components[3])<.5))continue;
      const [r,g,b]=components.map(Number);
      return (.2126*r+.7152*g+.0722*b)/255<.35;
    }
    return false;
  }
  const parents=new Set($$('.ref-card,.timeline-row,.pillar-card',main).map(card=>card.parentElement));
  parents.forEach(group=>{
    if(!group || group.classList.contains('timeline-grid') || group.closest('#company-timeline,#ethos,#focus-industries,#impact,.ref-dark,.ref-final-cta'))return;
    const cards=[...group.children].filter(el=>(el.classList.contains('ref-card') || el.classList.contains('timeline-row') || el.classList.contains('pillar-card')) && !hasDarkBackground(el));
    if(cards.length<2)return;
    if(group.classList.contains('ref-review-belt'))add(group.parentElement,'ref-review-stack-viewport');
    add(group,'ref-stack-group');
    cards.forEach(card=>add(card,'ref-stack-card'));
    stackGroups.push({group,cards});
  });
  $$('.ref-stack-group',main).forEach(group=>{
    if(stackGroups.some(item=>item.group===group))return;
    const cards=[...group.children].filter(el=>el.classList.contains('ref-card') || el.classList.contains('pillar-card') || el.classList.contains('ref-stack-card'));
    if(cards.length>=2){
      cards.forEach(card=>add(card,'ref-stack-card'));
      stackGroups.push({group,cards});
    }
  });
  function updateStackPositions(){
    stackGroups.forEach(({group,cards})=>{
      const style=getComputedStyle(group);
      const columns=style.display==='grid'?style.gridTemplateColumns.split(' ').filter(Boolean).length:1;
      cards.forEach((card,i)=>{
        const row=Math.floor(i/Math.max(columns,1));
        const base=(innerWidth<=950?106:126)+Math.min(row,8)*14;
        card.style.setProperty('--stack-top',`${Math.min(base,innerHeight-card.offsetHeight-40)}px`);
        card.style.setProperty('--stack-layer',row+1);
        card.dataset.stackRow=row;
      });
    });
  }
  updateStackPositions();window.addEventListener('resize',updateStackPositions,{passive:true});
  document.fonts.ready.then(updateStackPositions);
  const stackResize=new ResizeObserver(updateStackPositions);stackGroups.forEach(({cards})=>cards.forEach(card=>stackResize.observe(card)));
  const tintTargets=$$('.ref-gradient');
  const driftTargets=$$('.ref-dark');
  let scheduled=false;
  function scrollEffects(){
    scheduled=false;
    stackGroups.forEach(({cards})=>cards.forEach((card,i)=>{
      const next=cards.find((candidate,j)=>j>i && candidate.dataset.stackRow!==card.dataset.stackRow);
      let progress=0;
      if(next && !reduced.matches){const top=parseFloat(card.style.getPropertyValue('--stack-top'));progress=Math.max(0,Math.min(1,(top+card.getBoundingClientRect().height-next.getBoundingClientRect().top)/Math.max(card.getBoundingClientRect().height,1)))}
      card.style.setProperty('--stack-scale',1-progress*.045);
      card.style.setProperty('--stack-shade',progress*.05);
    }));
    if(reduced.matches)return;
    tintTargets.forEach(el=>{const rect=el.getBoundingClientRect();const progress=Math.max(0,Math.min(1,(innerHeight-rect.top)/(innerHeight*.8)));el.style.setProperty('--tint',progress);el.style.backgroundSize=`${115+progress*35}% 100%`;el.style.backgroundPosition=`${progress*40}% 0`});
    if(statement){const rect=statement.getBoundingClientRect();const p=Math.max(0,Math.min(1,(innerHeight*.8-rect.top)/(innerHeight*.6)));statement.style.setProperty('--morph-progress',p)}
    if(timeline){const r=timeline.getBoundingClientRect();const p=Math.max(0,Math.min(1,(innerHeight*.5-r.top)/Math.max(r.height-innerHeight*.3,1)));timeline.style.setProperty('--timeline-progress',p)}
    driftTargets.forEach(el=>{const rect=el.getBoundingClientRect();const p=Math.max(-1,Math.min(1,(rect.top-innerHeight*.5)/innerHeight));el.style.setProperty('--drift',`${p*18}px`)});
  }
  window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(scrollEffects)}},{passive:true});scrollEffects();
  // Synchronize menu accessibility while preserving the site's own toggles and wording.
  document.addEventListener('click',e=>{
    if(e.target.closest('#mobile-menu-btn'))requestAnimationFrame(()=>{
      const button=$('#mobile-menu-btn'),menu=$('#mobile-nav-menu');
      if(button && menu) button.setAttribute('aria-expanded',String(!menu.classList.contains('hidden')));
    });
  });
  // Use an upright, familiar question-mark glyph in heading text.
  $$('h1,h2,h3,h4,h5,h6,.faq-question-text',main).forEach(heading=>{
    const walker=document.createTreeWalker(heading,NodeFilter.SHOW_TEXT);
    const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.filter(node=>/[?¿؟？]/.test(node.textContent)).forEach(node=>{
      const fragment=document.createDocumentFragment();
      node.textContent.split(/([?¿؟？])/).forEach(part=>{
        if(/^[?¿؟？]$/.test(part)){
          const mark=document.createElement('span'); mark.className='bgs-question-mark'; mark.textContent='?'; fragment.append(mark);
        } else fragment.append(document.createTextNode(part));
      });
      node.replaceWith(fragment);
    });
  });
  // Reuse each service icon's own palette for its card interaction.
  if(pathname.includes('/services/')){
    $$('.ref-card,.bento-card,.bento-card-hover,.ref-stack-card',main).forEach(card=>{
      const icon=$('.material-symbols-outlined',card);
      if(!icon)return;
      const box=icon.parentElement;
      const style=getComputedStyle(box);
      const background=style.backgroundImage.match(/rgba?\([^)]+\)/)?.[0] || style.backgroundColor;
      const values=background.match(/[\d.]+/g)?.map(Number);
      let accent=getComputedStyle(icon).color;
      if(values && values.length>=3 && (values.length<4 || values[3]>.5)){
        const [r,g,b]=values;
        if(Math.max(r,g,b)-Math.min(r,g,b)>35 && (r*.2126+g*.7152+b*.0722)<180)accent=background;
      }
      card.style.setProperty('--service-hover-accent',accent);
    });
  }
  // Animate numeric statistics once when they enter the viewport.
  if(!reduced.matches && 'IntersectionObserver' in window){
    const statObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        const el=entry.target;statObserver.unobserve(el);
        const final=el.dataset.counterFinal;
        const match=final.match(/^(\d[\d,]*)(\.\d+)?([+%])$/);
        const target=Number((match[1]+(match[2]||'')).replaceAll(',',''));
        const decimals=match[2] ? match[2].length-1 : 0;
        const suffix=match[3];let started;
        el.setAttribute('aria-label',final);
        el.style.fontVariantNumeric='tabular-nums';
        const tick=now=>{
          started ??= now;
          const progress=Math.min((now-started)/1200,1);
          const value=target*(1-Math.pow(1-progress,3));
          const formatted=match[1].includes(',') ? value.toLocaleString('en-US',{minimumFractionDigits:decimals,maximumFractionDigits:decimals}) : value.toFixed(decimals);
          el.textContent=progress===1 ? final : formatted+suffix;
          if(progress<1)requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    },{threshold:.4});
    $$('span,strong,h3,h4,div',main).forEach(el=>{
      if(el.children.length || el.closest('a,button,nav,.font-label-code,.font-label-eyebrow'))return;
      const text=el.textContent.trim();
      if(!/^\d[\d,]*(?:\.\d+)?[+%]$/.test(text))return;
      el.dataset.counterFinal=text;
      statObserver.observe(el);
    });
  }
  // One decorative, layout-free progress indicator shared by every page.
  if(!document.querySelector('.bgs-aurora-progress')){
    const bar=document.createElement('div');bar.className='bgs-aurora-progress';bar.setAttribute('aria-hidden','true');
    const fill=document.createElement('div');fill.className='bgs-aurora-fill';
    const edge=document.createElement('div');edge.className='bgs-aurora-edge';
    bar.append(fill,edge);document.body.append(bar);
    const scroller=document.scrollingElement || document.documentElement;
    let extent=0,viewport=innerWidth,target=0,current=0,raf=0,idle=0;
    const render=()=>{
      raf=0;
      current=reduced.matches ? target : current+(target-current)*.24;
      if(Math.abs(target-current)<.0002)current=target;
      fill.style.transform=`scaleX(${current})`;
      edge.style.transform=`translate3d(${current*viewport}px,0,0)`;
      bar.classList.toggle('has-progress',current>0);
      bar.classList.toggle('is-complete',current>=.9999 && extent>0);
      if(current!==target)raf=requestAnimationFrame(render);
    };
    const schedule=()=>{target=extent>0 ? Math.max(0,Math.min(1,scroller.scrollTop/extent)) : 0;if(!raf)raf=requestAnimationFrame(render)};
    const measure=()=>{viewport=document.documentElement.clientWidth;extent=Math.max(0,scroller.scrollHeight-scroller.clientHeight);schedule()};
    const track=()=>{bar.classList.add('is-scrolling');clearTimeout(idle);idle=setTimeout(()=>bar.classList.remove('is-scrolling'),150);schedule()};
    window.addEventListener('scroll',track,{passive:true});
    window.addEventListener('resize',measure,{passive:true});
    window.addEventListener('pageshow',measure);
    if('ResizeObserver' in window){const resize=new ResizeObserver(measure);resize.observe(document.body);resize.observe(document.documentElement)}
    document.fonts?.ready.then(measure);
    window.addEventListener('load',measure,{once:true});
    reduced.addEventListener('change',schedule);
    measure();
  }
  // Attach to the shared navbar after its asynchronous component arrives.
  const attachNavAurora=nav=>{
    if(nav.querySelector('.bgs-navbar-aurora'))return;
    const light=document.createElement('span');light.className='bgs-navbar-aurora';light.setAttribute('aria-hidden','true');nav.append(light);
    let active=false,visible=true,raf=0,rect,x=0,y=0,tx=0,ty=0;
    const allowed=()=>fine.matches&&!reduced.matches&&!document.hidden&&visible;
    const stop=()=>{active=false;nav.classList.remove('nav-aurora-active');cancelAnimationFrame(raf);raf=0};
    const measure=()=>{rect=nav.getBoundingClientRect()};
    const draw=()=>{
      raf=0;if(!active||!allowed()){stop();return;}
      x+=(tx-x)*.18;y+=(ty-y)*.18;
      light.style.setProperty('--mouse-x',x+'px');light.style.setProperty('--mouse-y',y+'px');
      if(Math.abs(tx-x)+Math.abs(ty-y)>.1)raf=requestAnimationFrame(draw);
    };
    const move=event=>{
      if(!allowed()||event.pointerType==='touch')return;
      if(!active){measure();x=event.clientX-rect.left;y=event.clientY-rect.top;active=true;nav.classList.add('nav-aurora-active')}
      tx=event.clientX-rect.left;ty=event.clientY-rect.top;
      if(!raf)raf=requestAnimationFrame(draw);
    };
    nav.addEventListener('pointerenter',move,{passive:true});nav.addEventListener('pointermove',move,{passive:true});nav.addEventListener('pointerleave',stop);nav.addEventListener('pointercancel',stop);
    const resize=new ResizeObserver(()=>{if(active)measure()});resize.observe(nav);
    const visibility=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible)stop()});visibility.observe(nav);
    const change=()=>{if(!allowed())stop()};
    const scroll=()=>{if(active)measure()};
    document.addEventListener('visibilitychange',change);window.addEventListener('scroll',scroll,{passive:true});
    reduced.addEventListener('change',change);fine.addEventListener('change',change);
    const cleanup=()=>{stop();resize.disconnect();visibility.disconnect();nav.removeEventListener('pointerenter',move);nav.removeEventListener('pointermove',move);nav.removeEventListener('pointerleave',stop);nav.removeEventListener('pointercancel',stop);document.removeEventListener('visibilitychange',change);window.removeEventListener('scroll',scroll);reduced.removeEventListener('change',change);fine.removeEventListener('change',change)};
    window.addEventListener('pagehide',event=>{if(!event.persisted)cleanup()});
  };
  const existingNav=document.querySelector('.bgs-main-navbar');
  if(existingNav)attachNavAurora(existingNav);
  else{
    const navObserver=new MutationObserver(()=>{const nav=document.querySelector('.bgs-main-navbar');if(nav){attachNavAurora(nav);navObserver.disconnect()}});
    navObserver.observe(document.body,{childList:true,subtree:true});
    window.addEventListener('pagehide',()=>navObserver.disconnect(),{once:true});
  }
  // Homepage service/principle interactions use the actual icon palette.
  $$('#core-services .ref-card,#ethos .ref-card',main).forEach(card=>{
    const icon=$('.material-symbols-outlined',card);if(!icon)return;
    const box=icon.parentElement;
    let accent=getComputedStyle(icon).color;
    const rgb=accent.match(/[\d.]+/g)?.map(Number)||[];
    if(rgb.length<3 || Math.max(...rgb.slice(0,3))-Math.min(...rgb.slice(0,3))<30){
      const style=getComputedStyle(box);
      accent=style.backgroundImage.match(/rgba?\([^)]+\)/)?.[0]||style.backgroundColor;
      const palette={primary:'#7359e8',violet:'#7c3aed',emerald:'#059669',amber:'#d97706',sky:'#0284c7',teal:'#0d9488',indigo:'#6366f1',rose:'#e11d48'};
      accent=palette[card.dataset.cardColor]||accent;
    }
    // Legacy coral icon boxes follow the site's violet replacement accent.
    if(/primary/.test(box.className))accent='#7359e8';
    card.style.setProperty('--card-icon-accent',accent);
    card.classList.add('bgs-icon-hover');box.classList.add('bgs-hover-icon-box');
  });
  document.documentElement.classList.add('bgs-layout-ready');
})();
