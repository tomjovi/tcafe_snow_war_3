/* Five lightweight snowball-arcade builds. The sixth, baseball concept is a separate game. */
(() => {
  const themeId = Math.min(5, Math.max(1, Number(new URLSearchParams(location.search).get('theme')) || 1));
  const themes = [
    { id: 'tactical', title: 'WHITEOUT COMMAND', intro: '설원 작전실 · 전술 레이더' },
    { id: 'postcard', title: '눈 오는 날의 엽서', intro: '종이 콜라주 · 포근한 겨울' },
    { id: 'hyperpop', title: 'FROST! FRENZY!', intro: '캔디 컬러 · 콤보 아케이드' },
    { id: 'noir', title: '마지막 눈보라', intro: '흑백 설원 · 생존 라운드' },
    { id: 'pixel', title: '빙하 레코드 198X', intro: '16비트 오락실 · 최고 기록' }
  ];
  const theme = themes[themeId - 1];
  document.body.dataset.theme = theme.id;
  document.title = `${theme.title} — 눈보라 대혼전`;
  document.getElementById('gameTitle').textContent = theme.title;
  document.getElementById('overlayEyebrow').textContent = theme.intro;
  document.getElementById('overlayTitle').textContent = theme.title;
  document.getElementById('overlayText').innerHTML = '좌우로 움직여 자동 발사되는 눈덩이를 맞혀요.<br>적의 눈덩이는 피하고, 아이템을 챙기세요!';

  const palettes = {
    tactical: { sky:'#111b16', hill:'#263d31', snow:'#d9e8d1', accent:'#caff5b', friend:'#edf4df', player:'#caff5b', ball:'#f7ffe9', hazard:'#ff8d73', panel:'#101916', tree:'#14271e' },
    postcard: { sky:'#adc9ca', hill:'#718b7e', snow:'#fff8e9', accent:'#df7053', friend:'#fff9eb', player:'#476b6b', ball:'#fffdf5', hazard:'#bd5848', panel:'#eee3ca', tree:'#536e64' },
    hyperpop: { sky:'#75cfef', hill:'#557dae', snow:'#f2ffff', accent:'#ff53b6', friend:'#ff81c8', player:'#f8ff43', ball:'#f8ff43', hazard:'#ff604f', panel:'#c7f4ff', tree:'#29496d' },
    noir: { sky:'#171717', hill:'#292826', snow:'#e9e5dd', accent:'#ff403c', friend:'#f1eee8', player:'#ff403c', ball:'#fffaf0', hazard:'#ff403c', panel:'#111111', tree:'#111111' },
    pixel: { sky:'#173542', hill:'#326578', snow:'#e8f5df', accent:'#5ef0d4', friend:'#fcfcdf', player:'#ffcf59', ball:'#ffffff', hazard:'#ff8870', panel:'#13232b', tree:'#173b49' }
  }[theme.id];
  const [sky,hill,snow,accent,friendColor,playerColor,ballColor,hazard,panel,tree]=Object.values(palettes);
  const canvas=document.getElementById('game'),ctx=canvas.getContext('2d'),$=id=>document.getElementById(id);
  const W=360,H=640,BASE=575;
  const modes=[
    {name:'아주 쉬움',friends:3,speed:44,throw:2.9},
    {name:'쉬움',friends:4,speed:58,throw:2.5},
    {name:'보통',friends:5,speed:75,throw:2.05},
    {name:'어려움',friends:6,speed:98,throw:1.65},
    {name:'매우 어려움',friends:8,speed:125,throw:1.25}
  ];
  const state={mode:'title',level:3,time:30,score:0,life:3,player:{x:180},friends:[],friendly:[],hostile:[],pickups:[],snow:[],clock:0,spawn:.6,combo:0,lastTarget:null,notice:'',noticeTime:0,effect:{rapid:0,big:0,spread:0},round:1};
  let prev=performance.now(),pointer=null;
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),rand=(a,b)=>a+Math.random()*(b-a);
  function resize(){const r=canvas.getBoundingClientRect(),d=Math.min(2,devicePixelRatio||1);canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d);ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);}
  if('ResizeObserver'in window)new ResizeObserver(resize).observe(canvas);else window.addEventListener('resize',resize);resize();
  function hud(){$('timer').textContent=Math.max(0,Math.ceil(state.time));$('score').textContent=state.score;$('friends').textContent=state.friends.length;$('levelLabel').textContent=state.level;}
  function message(text){state.notice=text;state.noticeTime=1.15;}
  function makeWave(){const cfg=modes[state.level-1],n=cfg.friends;state.friends=Array.from({length:n},(_,i)=>({id:state.round*100+i,x:35+(i%4)*Math.min(92,290/Math.max(1,Math.min(4,n)-1)),y:145+Math.floor(i/4)*72+rand(-10,10),r:16,hp:2,phase:rand(0,7),vx:rand(-1,1),aim:rand(.8,cfg.throw+1)}));}
  function begin(){state.level=Number($('difficulty').value);state.mode='playing';state.time=30;state.score=0;state.life=3;state.round=1;state.player.x=180;state.friendly=[];state.hostile=[];state.pickups=[];state.effect={rapid:0,big:0,spread:0};state.clock=0;state.spawn=.4;state.combo=0;state.lastTarget=null;state.notice='';makeWave();$('overlay').hidden=true;$('start').textContent='다시 플레이';hud();}
  function finish(won){state.mode='result';$('overlayEyebrow').textContent=won?'라운드 생존 성공':'눈싸움 종료';$('overlayTitle').textContent=won?'좋은 눈싸움이었다!':'눈보라가 너무 셌어!';$('overlayText').innerHTML=`점수 <b>${state.score}</b> · 쓰러뜨린 친구 ${Math.max(0,state.round*modes[state.level-1].friends-state.friends.length)}명<br>다시 플레이하거나 다른 디자인 시안을 골라보세요.`;$('overlay').hidden=false;}
  function fire(){const spread=state.effect.spread>0?Math.min(4,state.effect.spread):0,count=1+spread,large=state.effect.big>0?state.effect.big:0;for(let i=0;i<count;i++){const angle=(i-(count-1)/2)*.14;state.friendly.push({x:state.player.x,y:BASE-18,vx:Math.sin(angle)*100,vy:-430,r:6+large*2});}}
  function effect(type){state.effect[type]=Math.min(type==='rapid'?13:11,state.effect[type]+(type==='rapid'?5:7));message(({rapid:'연사!',big:'큰 눈덩이!',spread:'산탄!'})[type]);}
  function hit(ball,enemy){ball.dead=true;enemy.hp--;enemy.flash=.12;state.combo=enemy.id===state.lastTarget?state.combo+1:1;state.lastTarget=enemy.id;const perfect=state.combo>=3;state.score+=perfect?20:10;if(perfect){message('PERFECT! +20');state.combo=0;state.lastTarget=null;}if(enemy.hp<=0){state.friends=state.friends.filter(e=>e!==enemy);if(Math.random()<.16)state.pickups.push({x:enemy.x,y:enemy.y,r:11,vy:58,type:['rapid','big','spread'][Math.floor(Math.random()*3)]});}hud();}
  function update(dt){if(state.mode!=='playing')return;state.time-=dt;state.noticeTime=Math.max(0,state.noticeTime-dt);if(state.time<=0){finish(true);return;}const cfg=modes[state.level-1];
    for(const key of ['rapid','big','spread'])state.effect[key]=Math.max(0,state.effect[key]-dt);
    const dir=(keys.has('ArrowRight')||keys.has('KeyD')?1:0)-(keys.has('ArrowLeft')||keys.has('KeyA')?1:0);state.player.x=clamp(state.player.x+dir*360*dt,22,W-22);
    if(pointer!==null){const dx=pointer-state.player.x;state.player.x=clamp(state.player.x+dx*.2,22,W-22);}
    state.clock-=dt;if(state.clock<=0){fire();state.clock=state.effect.rapid>0?Math.max(.15,.52/(1+state.effect.rapid*.12)):.52;}
    state.spawn-=dt;if(state.spawn<=0&&state.friends.length<cfg.friends){const edge=Math.random()<.5?22:W-22;state.friends.push({id:Math.random(),x:edge,y:rand(125,275),r:16,hp:2,phase:rand(0,7),vx:edge<100?1:-1,aim:rand(1,cfg.throw)});state.spawn=cfg.throw;}
    for(const enemy of state.friends){enemy.phase+=dt*2;enemy.x+=enemy.vx*cfg.speed*dt;if(enemy.x<enemy.r+5||enemy.x>W-enemy.r-5)enemy.vx*=-1;enemy.y+=Math.sin(enemy.phase)*5*dt;enemy.aim-=dt;enemy.flash=Math.max(0,(enemy.flash||0)-dt);if(enemy.aim<=0){state.hostile.push({x:enemy.x,y:enemy.y+enemy.r,vx:clamp((state.player.x-enemy.x)*.22,-90,90),vy:190+state.level*25,r:6});enemy.aim=cfg.throw*rand(.8,1.2);}}
    for(const ball of state.friendly){ball.x+=ball.vx*dt;ball.y+=ball.vy*dt;for(const enemy of state.friends){if(!ball.dead&&Math.hypot(ball.x-enemy.x,ball.y-enemy.y)<ball.r+enemy.r){hit(ball,enemy);break;}}if(ball.y<0||ball.x<0||ball.x>W)ball.dead=true;}
    state.friendly=state.friendly.filter(b=>!b.dead);
    for(const ball of state.hostile){ball.x+=ball.vx*dt;ball.y+=ball.vy*dt;if(Math.hypot(ball.x-state.player.x,ball.y-(BASE-10))<ball.r+18){ball.dead=true;state.life--;message('맞았다! ♥'.repeat(Math.max(0,state.life)));if(state.life<=0){finish(false);return;}}if(ball.y>H)ball.dead=true;}state.hostile=state.hostile.filter(b=>!b.dead);
    for(const item of state.pickups){item.y+=item.vy*dt;if(Math.hypot(item.x-state.player.x,item.y-(BASE-12))<item.r+20){effect(item.type);item.dead=true;}if(item.y>H)item.dead=true;}state.pickups=state.pickups.filter(i=>!i.dead);
    if(!state.friends.length){state.score+=100*state.level;state.round++;message(`전원 격퇴! 라운드 보너스 +${100*state.level}`);makeWave();state.spawn=.9;}
    hud();}
  const keys=new Set();
  function drawBackground(){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,sky);g.addColorStop(.68,hill);g.addColorStop(1,snow);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    ctx.fillStyle=tree;ctx.beginPath();ctx.moveTo(0,286);ctx.lineTo(70,221);ctx.lineTo(145,280);ctx.lineTo(240,196);ctx.lineTo(360,273);ctx.lineTo(360,425);ctx.lineTo(0,425);ctx.fill();
    ctx.fillStyle=panel;ctx.fillRect(263,302,66,55);ctx.fillStyle=accent;ctx.beginPath();ctx.moveTo(254,303);ctx.lineTo(296,272);ctx.lineTo(339,303);ctx.fill();ctx.fillStyle='#f3dfa7';ctx.fillRect(272,319,12,15);ctx.fillRect(302,319,12,15);
    ctx.fillStyle=snow;ctx.fillRect(0,BASE,W,H-BASE);for(const f of state.snow){f.y=(f.y+f.v*dtForSnow)%H;ctx.globalAlpha=f.a;ctx.fillRect(f.x,f.y,f.r,f.r);}ctx.globalAlpha=1;
  }
  let dtForSnow=.016;
  function drawEnemy(e){ctx.save();ctx.translate(e.x,e.y);ctx.fillStyle=e.flash?'#fff':friendColor;if(theme.id==='pixel'){ctx.fillRect(-13,-12,26,27);ctx.fillStyle='#213943';ctx.fillRect(-8,-4,4,4);ctx.fillRect(4,-4,4,4);}else{ctx.beginPath();ctx.roundRect(-15,-3,30,27,8);ctx.fill();ctx.beginPath();ctx.arc(0,-14,12,0,Math.PI*2);ctx.fill();ctx.fillStyle='#28343b';ctx.fillRect(-5,-17,2,2);ctx.fillRect(4,-17,2,2);ctx.fillStyle=accent;ctx.beginPath();ctx.arc(0,-18,13,Math.PI,Math.PI*2);ctx.fill();}ctx.fillStyle='#536a67';ctx.fillRect(-14,27,11,4);ctx.fillRect(3,27,11,4);ctx.fillStyle=e.hp===2?'#78dfc2':'#ffd277';ctx.fillRect(-14,34,28*e.hp/2,3);ctx.restore();}
  function draw(){drawBackground();ctx.save();ctx.strokeStyle=accent;ctx.globalAlpha=.22;ctx.setLineDash([4,5]);ctx.beginPath();ctx.moveTo(0,BASE);ctx.lineTo(W,BASE);ctx.stroke();ctx.setLineDash([]);ctx.restore();state.friends.forEach(drawEnemy);
    ctx.save();ctx.translate(state.player.x,BASE);ctx.fillStyle=playerColor;if(theme.id==='pixel'){ctx.fillRect(-15,-27,30,31);ctx.fillStyle='#f3fff1';ctx.fillRect(-9,-44,18,20);}else{ctx.fillRect(-15,-26,30,32);ctx.fillStyle='#f1f7f2';ctx.beginPath();ctx.arc(0,-39,13,0,Math.PI*2);ctx.fill();ctx.fillStyle='#28343b';ctx.fillRect(-5,-41,2,2);ctx.fillRect(4,-41,2,2);ctx.strokeStyle='#aae3eb';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(1,-34);ctx.lineTo(4,-25);ctx.stroke();ctx.fillStyle='#bfeef0';ctx.beginPath();ctx.arc(4,-23,2.5,0,Math.PI*2);ctx.fill();}ctx.restore();
    for(const b of state.friendly){ctx.fillStyle=b.r>7?'#ffe987':ballColor;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fill();}for(const b of state.hostile){ctx.fillStyle=hazard;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fill();}for(const i of state.pickups){ctx.fillStyle=i.type==='rapid'?'#78efce':i.type==='big'?'#ffe889':'#dda7ff';ctx.beginPath();ctx.arc(i.x,i.y,i.r,0,Math.PI*2);ctx.fill();ctx.fillStyle='#172338';ctx.font='bold 12px system-ui';ctx.textAlign='center';ctx.fillText(i.type==='rapid'?'»':i.type==='big'?'●':'✣',i.x,i.y+4);}
    ctx.fillStyle='#fff';ctx.textAlign='left';ctx.font='bold 11px system-ui';ctx.fillText(`눈싸움 ${'♥'.repeat(state.life)}${'♡'.repeat(3-state.life)}`,13,22);ctx.textAlign='right';ctx.fillStyle=accent;ctx.fillText(state.effect.rapid>0?'연사 강화':state.effect.spread>0?'산탄 강화':state.effect.big>0?'큰 눈덩이':'자동 공격',W-13,22);
    if(state.noticeTime>0){ctx.textAlign='center';ctx.font='900 18px system-ui';ctx.fillStyle=accent;ctx.shadowColor='#10151b';ctx.shadowBlur=8;ctx.fillText(state.notice,W/2,92);ctx.shadowBlur=0;}}
  function loop(now){const dt=Math.min(.04,(now-prev)/1000);prev=now;dtForSnow=dt;if(state.mode==='playing')update(dt);draw();requestAnimationFrame(loop);}
  $('start').addEventListener('click',begin);
  window.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();keys.add(e.code);});window.addEventListener('keyup',e=>keys.delete(e.code));
  canvas.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){const r=canvas.getBoundingClientRect();pointer=(e.clientX-r.left)/r.width*W;}else if(canvas.dataset.drag===String(e.pointerId)){const dx=e.clientX-Number(canvas.dataset.x);state.player.x=clamp(state.player.x+dx/canvas.clientWidth*W,22,W-22);canvas.dataset.x=String(e.clientX);}});
  canvas.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'){e.preventDefault();canvas.setPointerCapture?.(e.pointerId);canvas.dataset.drag=String(e.pointerId);canvas.dataset.x=String(e.clientX);}});
  const release=e=>{if(canvas.dataset.drag===String(e.pointerId)){delete canvas.dataset.drag;delete canvas.dataset.x;}};canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);
  for(let i=0;i<68;i++)state.snow.push({x:Math.random()*W,y:Math.random()*H,v:20+Math.random()*50,r:1+Math.random()*2,a:.2+Math.random()*.45});
  updateHudIfPresent();function updateHudIfPresent(){hud();}requestAnimationFrame(loop);
})();
