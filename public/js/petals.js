// Simple falling petals effect using canvas
(()=>{
  const canvas = document.createElement('canvas');
  canvas.id = 'petalCanvasEl';
  canvas.style.position = 'fixed';
  canvas.style.left = '0';
  canvas.style.top = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '1';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let W, H;
  function resize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize); resize();

  const petals = [];
  function rand(min,max){return Math.random()*(max-min)+min}
  function makePetal(){
    return {
      x: rand(0,W), y: rand(-H,0), r: rand(6,18), xv: rand(-0.4,0.8), yv: rand(0.5,2.0), rot: rand(0,Math.PI*2), vr: rand(-0.02,0.02), hue: rand(10,30)
    };
  }
  for(let i=0;i<40;i++) petals.push(makePetal());

  function draw(){
    ctx.clearRect(0,0,W,H);
    petals.forEach(p=>{
      p.x += p.xv; p.y += p.yv; p.rot += p.vr;
      if(p.y - p.r > H){ Object.assign(p, makePetal()); p.y = -10; }
      ctx.save();
      ctx.translate(p.x,p.y); ctx.rotate(p.rot);
      ctx.fillStyle = `hsl(${p.hue} 60% 60% / 0.85)`;
      ctx.beginPath(); ctx.ellipse(0,0,p.r,p.r*0.6,0,0,Math.PI*2); ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();
