// Small click-only fireworks. No cursor replacement or movement tracking.
(()=>{
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover: hover) and (pointer: fine)');
const light=['#32866b','#d57a49','#9164c3','#508bd0','#b99a35'];
const dark=['#83d9ae','#f2ad78','#c5a0f0','#91baf5','#ead079'];
let bursts=[],raf=0;
const palette=()=>document.documentElement.dataset.theme==='dark'?dark:light;
const allowed=()=>!reduced.matches&&fine.matches;
const canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');canvas.id='click-fireworks';
Object.assign(canvas.style,{position:'fixed',inset:'0',width:'100%',height:'100%',pointerEvents:'none',zIndex:'9999'});document.body.append(canvas);
const ctx=canvas.getContext('2d');
if(!ctx){canvas.remove();return}
function clear(){bursts=[];if(raf)cancelAnimationFrame(raf);raf=0;ctx.clearRect(0,0,innerWidth,innerHeight)}
function resize(){const d=Math.min(devicePixelRatio||1,2);canvas.width=innerWidth*d;canvas.height=innerHeight*d;ctx.setTransform(d,0,0,d,0,0);clear()}
resize();addEventListener('resize',resize);addEventListener('blur',clear);document.addEventListener('visibilitychange',()=>{if(document.hidden)clear()});
for(const query of [reduced,fine])query.addEventListener('change',clear);
function start(){if(!raf)raf=requestAnimationFrame(draw)}
function draw(now){
 ctx.clearRect(0,0,innerWidth,innerHeight);bursts=bursts.filter(b=>now-b.start<850);
 for(const b of bursts){const t=(now-b.start)/850,e=1-Math.pow(1-t,2.5),fade=Math.pow(1-t,1.25);
  for(const p of b.points){const r=p.radius*e,x=b.x+Math.cos(p.a)*r,y=b.y+Math.sin(p.a)*r+8*t*t;
   ctx.globalAlpha=fade*p.alpha;ctx.strokeStyle=p.color;ctx.fillStyle=p.color;ctx.lineWidth=p.w;ctx.lineCap='round';
   const len=3+7*(1-t);ctx.beginPath();ctx.moveTo(x-Math.cos(p.a)*len,y-Math.sin(p.a)*len);ctx.lineTo(x,y);ctx.stroke();
   if(p.dot){ctx.beginPath();ctx.arc(x+Math.cos(p.a)*5,y+Math.sin(p.a)*5,.75,0,Math.PI*2);ctx.fill()}
  }
 }
 ctx.globalAlpha=1;raf=bursts.length?requestAnimationFrame(draw):0;
}
function excluded(e){return !(e.target instanceof Element)||e.target.closest('input,textarea,select,[contenteditable],[role="slider"],canvas')}
document.addEventListener('pointerdown',e=>{
 if(!allowed()||e.pointerType!=='mouse'||e.button!==0||excluded(e))return;
 const colors=palette().slice();for(let i=colors.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[colors[i],colors[j]]=[colors[j],colors[i]]}colors.length=2+Math.floor(Math.random()*3);
 const points=Array.from({length:24},(_,i)=>({a:i*Math.PI*2/24+(Math.random()-.5)*.12,radius:36+Math.random()*24,alpha:.9+Math.random()*.1,w:i%3===0?2:1.5,color:colors[i%colors.length],dot:i%4===1}));
 bursts.push({x:e.clientX,y:e.clientY,start:performance.now(),points});if(bursts.length>5)bursts.shift();start();
},{passive:true});
})();
