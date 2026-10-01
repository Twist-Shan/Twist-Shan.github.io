/* Self-contained, dependency-free interactions. All numeric results are from the supplied paper.
   geometry-data.js holds real PCA display coordinates; paper figures retain their original panels. */
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const dark = () => document.documentElement.dataset.theme === 'dark';
  const themeButton = $('#theme-toggle');
  function updateThemeLabel() {
    themeButton.setAttribute('aria-label', `Switch to ${dark() ? 'light' : 'dark'} theme`);
    $$('img[data-light-src]').forEach(img => {
      const source = dark() ? img.dataset.darkSrc : img.dataset.lightSrc;
      if (source && img.getAttribute('src') !== source) img.src = source;
    });
  }
  updateThemeLabel();
  themeButton.addEventListener('click', () => {
    document.documentElement.dataset.theme = dark() ? 'light' : 'dark';
    try { localStorage.setItem('liang-theme', document.documentElement.dataset.theme); } catch (_) {}
    updateThemeLabel();
    drawGeometries();
  });
  // Reading position updates are coalesced into a single frame.
  let scrollFrame = 0;
  const sectionLinks = $$('#toc a');
  const sections = $$('.article-section');
  function updateReading() {
    const available = document.documentElement.scrollHeight - innerHeight;
    $('#reading-fill').style.transform = `scaleX(${available > 0 ? Math.min(1, scrollY / available) : 0})`;
    let active = sections[0];
    for (const s of sections) if (s.getBoundingClientRect().top < innerHeight * .35) active = s;
    sectionLinks.forEach(a => {
      const current = a.hash === '#' + active.id;
      a.classList.toggle('active', current);
      if (current) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
    });
    scrollFrame = 0;
  }
  document.addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateReading); }, {passive: true});
  updateReading();
  $$('.mobile-toc a').forEach(a => a.addEventListener('click', () => { $('.mobile-toc').open = false; }));

  // Small 3D projection renderer: no WebGL, no network and no generated scientific data.
  function setupCanvas(canvas){
    const dpr=Math.min(devicePixelRatio||1,2),r=canvas.getBoundingClientRect();
    if(!r.width||!r.height)return null;
    if(canvas.width!==Math.round(r.width*dpr)||canvas.height!==Math.round(r.height*dpr)){
      canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);
    }
    const ctx=canvas.getContext('2d');if(!ctx)return null;
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,r.width,r.height);
    return {ctx,w:r.width,h:r.height};
  }
  function project(p,yaw,pitch){
    const xx=p.x*Math.cos(yaw)+p.z*Math.sin(yaw), zz=-p.x*Math.sin(yaw)+p.z*Math.cos(yaw);
    return {x:xx,y:p.y*Math.cos(pitch)-zz*Math.sin(pitch),z:p.y*Math.sin(pitch)+zz*Math.cos(pitch)};
  }
  function line2(ctx,a,b,color,width=1){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
  const palette=['#6750E8','#00A9D8','#00A88F','#2DBE77','#A7C957','#D6B52C','#F29E4C','#E76F51','#D94B86','#8E5DB7'];
  const views = [
    {canvas:$('#geometry-direct'),key:'non_thinking',yaw:-.72,pitch:-.45,zoom:1},
    {canvas:$('#geometry-thinking'),key:'native_thinking',yaw:-.72,pitch:-.45,zoom:1}
  ];
  let selectedCount=0,showCentroids=true,showPoints=true;
  function drawGeometry(view){
    const data=window.GEOMETRY_DATA?.modes?.[view.key], surface=setupCanvas(view.canvas);
    if(!surface)return;
    const {ctx,w,h}=surface;
    if(!data){ctx.fillStyle=dark()?'#a8c7b4':'#66716b';ctx.font='13px Arial';ctx.fillText('Geometry data unavailable.',20,h/2);return;}
    const all=[...data.points,...data.centroids];
    const mins={},maxs={},center={};
    for(const dim of ['x','y','z']){mins[dim]=Math.min(...all.map(p=>p[dim]));maxs[dim]=Math.max(...all.map(p=>p[dim]));center[dim]=(mins[dim]+maxs[dim])/2;}
    const extent=Math.max(...['x','y','z'].map(dim=>maxs[dim]-mins[dim]));
    const normalize=p=>({x:(p.x-center.x)/extent*2,y:(p.y-center.y)/extent*2,z:(p.z-center.z)/extent*2});
    const scale=Math.min(w,h)*.285*view.zoom;
    const toScreen=p=>{const r=project(p,view.yaw,view.pitch);return {x:w/2+r.x*scale,y:h/2-r.y*scale+5,z:r.z};};
    const grid=dark()?'#91b6a222':'#41695314',axis=dark()?'#93b4a477':'#65837588';
    for(let t=-1;t<=1.001;t+=.5){
      line2(ctx,toScreen({x:t,y:-1,z:-1}),toScreen({x:t,y:-1,z:1}),grid);
      line2(ctx,toScreen({x:-1,y:-1,z:t}),toScreen({x:1,y:-1,z:t}),grid);
      line2(ctx,toScreen({x:-1,y:t,z:-1}),toScreen({x:1,y:t,z:-1}),grid);
    }
    const origin=toScreen({x:-1,y:-1,z:-1});
    [['x','PC1'],['y','PC2'],['z','PC3']].forEach(([d,label])=>{
      const end={x:-1,y:-1,z:-1};end[d]=1.17;
      const p=toScreen(end);line2(ctx,origin,p,axis,.8);ctx.fillStyle=dark()?'#9cb6a7':'#75847a';ctx.font='9px Consolas,monospace';ctx.fillText(label,p.x+3,p.y+3);
    });
    const centroids=data.centroids.map(p=>({...toScreen(normalize(p)),count:p.count}));
    if(showCentroids){for(let i=1;i<centroids.length;i++)line2(ctx,centroids[i-1],centroids[i],dark()?'#9bd0b966':'#276e5555',1.1);}
    if(showPoints){
      data.points.map(p=>({...toScreen(normalize(p)),count:p.count})).sort((a,b)=>a.z-b.z).forEach(p=>{
        ctx.globalAlpha=selectedCount && selectedCount !== p.count ? .12 : .76;
        ctx.beginPath();ctx.arc(p.x,p.y,2.7+Math.max(-.5,Math.min(.6,p.z*.35)),0,Math.PI*2);
        ctx.fillStyle=palette[p.count-1];ctx.fill();
      });
      ctx.globalAlpha=1;
    }
    if(showCentroids){
      centroids.sort((a,b)=>a.z-b.z).forEach(p=>{
        ctx.globalAlpha=selectedCount && selectedCount !== p.count ? .15 : 1;
        ctx.beginPath();ctx.arc(p.x,p.y,8,0,Math.PI*2);ctx.fillStyle=palette[p.count-1];ctx.fill();ctx.lineWidth=1.4;ctx.strokeStyle=dark()?'#b4cbbb':'#fffffb';ctx.stroke();
        ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='9px Consolas,monospace';ctx.fillText(p.count,p.x,p.y+.5);
      });
      ctx.globalAlpha=1;ctx.textAlign='start';ctx.textBaseline='alphabetic';
    }
  }
  function drawGeometries(){views.forEach(drawGeometry);}
  function setStatus(){
    $('#geometry-status').textContent=window.GEOMETRY_DATA?
      `${selectedCount?`Count ${selectedCount} highlighted · `:''}100 real states per panel · Independent PCA bases and display scaling · Lines join group means, not an individual trajectory.`:
      'The saved data could not be loaded. Check that assets/geometry-data.js is present beside this page; the article and source PDF remain available.';
  }
  for(let c=0;c<=10;c++){
    const b=document.createElement('button');b.type='button';b.textContent=c||'All';if(c)b.style.setProperty('--count-color',palette[c-1]);b.setAttribute('aria-label',c?`Highlight count ${c}`:'Show all counts');b.setAttribute('aria-pressed',String(c===0));
    b.addEventListener('click',()=>{selectedCount=c;$$('#count-buttons button').forEach((el,i)=>el.setAttribute('aria-pressed',String(i===c)));setStatus();drawGeometries();});$('#count-buttons').append(b);
  }
  views.forEach(view=>{
    let drag=null;
    const c=view.canvas;
    c.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={x:e.clientX,y:e.clientY,touch:e.pointerType==='touch'};c.setPointerCapture(e.pointerId);});
    c.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
      view.yaw+=dx*.012;view.pitch=Math.max(-1.35,Math.min(1.35,view.pitch+dy*.012));drag.x=e.clientX;drag.y=e.clientY;drawGeometry(view);});
    const end=()=>{drag=null;};c.addEventListener('pointerup',end);c.addEventListener('pointercancel',end);c.addEventListener('lostpointercapture',end);
    c.addEventListener('wheel',e=>{if(document.activeElement!==c)return;e.preventDefault();view.zoom=Math.max(.6,Math.min(2,view.zoom-e.deltaY*.001));drawGeometry(view);},{passive:false});
    c.addEventListener('click',()=>c.focus({preventScroll:true}));
    c.addEventListener('keydown',e=>{
      let used=true;
      if(e.key==='ArrowLeft')view.yaw-=.12;else if(e.key==='ArrowRight')view.yaw+=.12;
      else if(e.key==='ArrowUp')view.pitch=Math.min(1.35,view.pitch+.12);else if(e.key==='ArrowDown')view.pitch=Math.max(-1.35,view.pitch-.12);
      else if(e.key==='+'||e.key==='=')view.zoom=Math.min(2,view.zoom+.1);else if(e.key==='-')view.zoom=Math.max(.6,view.zoom-.1);else used=false;
      if(used){e.preventDefault();drawGeometry(view);}
    });
  });
  $('#show-centroids').addEventListener('change',e=>{showCentroids=e.target.checked;drawGeometries();});
  $('#show-points').addEventListener('change',e=>{showPoints=e.target.checked;drawGeometries();});
  $('#geometry-reset').addEventListener('click',()=>{views.forEach(v=>Object.assign(v,{yaw:-.72,pitch:-.45,zoom:1}));drawGeometries();});
  $$('[data-orbit]').forEach(button=>button.addEventListener('click',()=>{
    views.forEach(view=>{
      const direction=button.dataset.orbit;
      if(direction==='left')view.yaw-=.18;
      if(direction==='right')view.yaw+=.18;
      if(direction==='up')view.pitch=Math.min(1.35,view.pitch+.14);
      if(direction==='down')view.pitch=Math.max(-1.35,view.pitch-.14);
      if(direction==='in')view.zoom=Math.min(2,view.zoom+.13);
      if(direction==='out')view.zoom=Math.max(.6,view.zoom-.13);
    });
    drawGeometries();
  }));
  setStatus();

  const resizeObserver=new ResizeObserver(()=>{drawGeometries();updateReading();});
  views.forEach(v=>resizeObserver.observe(v.canvas));
  drawGeometries();

  // Figure controls open the page's accessible dialog without navigating away.
  const dialog = $('#figure-dialog'), dialogImage = $('#figure-dialog-image');
  let returnFocus = null;
  function resetFigureZoom(){ dialog.classList.remove('zoomed'); $('#figure-fit').textContent='Zoom in +'; $('#figure-fit').setAttribute('aria-pressed','false'); }
  $$('[data-zoom]').forEach(trigger => trigger.addEventListener('click', () => {
    returnFocus=trigger; resetFigureZoom();
    const source=trigger.querySelector('img'); dialogImage.src=source.src; dialogImage.alt=source.alt;
    $('#figure-dialog-title').textContent=source.alt;
    $('#figure-dialog-caption').textContent=trigger.closest('figure').querySelector('figcaption').textContent.trim();
    dialog.showModal(); document.body.classList.add('dialog-open'); $('#figure-close').focus();
  }));
  $('#figure-close').addEventListener('click',()=>dialog.close());
  $('#figure-fit').addEventListener('click',()=>{const zoomed=dialog.classList.toggle('zoomed');$('#figure-fit').textContent=zoomed?'Fit to window −':'Zoom in +';$('#figure-fit').setAttribute('aria-pressed',String(zoomed));});
  dialog.addEventListener('click', event => { if(event.target===dialog) dialog.close(); });
  dialog.addEventListener('close',()=>{document.body.classList.remove('dialog-open'); returnFocus?.focus({preventScroll:true});});

})();
