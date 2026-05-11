// @ts-nocheck
// Phase-1 split: login-page sparkle canvas animation (lines 34573–34650 of original).

(function(){
  const canvas=document.getElementById('sparkleCanvas');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  const DENSITY=1200;
  let particles=[];
  let raf;

  function resize(){
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    spawnParticles();
  }
  function rand(min,max){return Math.random()*(max-min)+min;}
  function spawnParticles(){
    const area=canvas.width*canvas.height;
    const count=Math.floor(area/1e6*DENSITY);
    particles=Array.from({length:count},()=>mkParticle());
  }
  function mkParticle(){
    return{
      x:rand(0,canvas.width),
      y:rand(0,canvas.height),
      size:rand(0.4,1.2),
      opacity:rand(0,1),
      delta:rand(0.003,0.012)*(Math.random()<.5?1:-1),
      speed:{x:rand(-.08,.08),y:rand(-.08,.08)},
    };
  }
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(const p of particles){
      p.opacity+=p.delta;
      if(p.opacity<=0||p.opacity>=1){p.delta*=-1;p.opacity=Math.max(0,Math.min(1,p.opacity));}
      p.x+=p.speed.x; p.y+=p.speed.y;
      if(p.x<-2)p.x=canvas.width+2;
      if(p.x>canvas.width+2)p.x=-2;
      if(p.y<-2)p.y=canvas.height+2;
      if(p.y>canvas.height+2)p.y=-2;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
      ctx.fillStyle=`rgba(255,255,255,${p.opacity})`;
      ctx.fill();
    }
    raf=requestAnimationFrame(draw);
  }

  window.addEventListener('resize',resize);
  resize();
  draw();

  const PASS='007';
  const gate=document.getElementById('gate');
  const input=document.getElementById('gateInput');
  const err=document.getElementById('gateErr');

  if(sessionStorage.getItem('kira_unlocked')==='1'){
    gate.style.display='none';
    cancelAnimationFrame(raf);
  } else {
    setTimeout(()=>{try{input.focus();}catch(e){}},100);
  }

  input.addEventListener('keydown',e=>{if(e.key==='Enter')checkGate();});

  window.checkGate=function(){
    if(input.value===PASS){
      sessionStorage.setItem('kira_unlocked','1');
      gate.classList.add('hide');
      setTimeout(()=>{gate.style.display='none';cancelAnimationFrame(raf);},650);
    } else {
      err.textContent='Incorrect password';
      input.classList.add('error');
      input.value='';
      setTimeout(()=>{input.classList.remove('error');err.textContent='';},1500);
    }
  };
})();
