const E=ENG,$=E.S.$,MODE=E.MODE;let m,anim=null,queue=0,hist=[];
const depth=()=>+$('dp').value;
const rad=v=>MODE==='A'?Math.min(24,3.5+6.5*Math.sqrt(v)):3.5+13*v;
function init(){m=new E.Model();anim=null;queue=0;hist=[];draw()}
/* stan wyświetlania podczas animacji */
function view(){const now=performance.now();
 if(!anim)return{F:m.F,w:m.w,trees:m.trees,ov:null};
 const a=anim,k=now-a.t0,{T1,T2,T3}=a;
 if(k<T3)return{F:a.F0,w:a.w0,trees:a.prev,ov:{tr:a.tr,k,T1,T2,lab:Math.min(1,Math.max(0,(k-T1)/(T2-T1)))}};
 const e=E.ease((k-T3)/(a.T4-T3)),F=a.F0.map((f,i)=>f+e*(m.F[i]-f)),w=a.w0.map((x,i)=>x+e*(m.w[i]-x));
 return{F,w,trees:a.prev,extra:{tr:a.tr,e},ov:{tr:a.tr,k,T1,T2,lab:1,fade:1-e}}}
function drawSplits(c,w,h,tr,k,T1,alpha){const mp=E.map(w,h),sp=E.splits(tr),dt=T1/Math.max(1,sp.length);c.save();c.globalAlpha=alpha;
 sp.forEach((n,j)=>{const kk=E.ease((k-j*dt)/dt);if(kk<=0)return;const b=n.b,f=n.f,from=b[2*f],t=from+(n.t-from)*kk;
  c.strokeStyle='#7b5cf0';c.lineWidth=kk<1?4:3.2;c.setLineDash(kk<1?[]:[10,7]);c.beginPath();
  if(f===0){c.moveTo(mp.sx(t),mp.sy(b[2]));c.lineTo(mp.sx(t),mp.sy(b[3]))}else{c.moveTo(mp.sx(b[0]),mp.sy(t));c.lineTo(mp.sx(b[1]),mp.sy(t))}c.stroke()});c.restore()}
function drawLeaves(c,w,h,tr,a){if(a<=0)return;const mp=E.map(w,h);c.save();c.globalAlpha=a;
 E.leaves(tr).forEach(l=>{const x0=mp.sx(l.b[0]),x1=mp.sx(l.b[1]),y0=mp.sy(l.b[3]),y1=mp.sy(l.b[2]);let col,txt;
  if(MODE==='A'){col=E.RGB[l.cls];txt='głos: '+(l.cls?'niebieska':'czerwona')}else{col=E.RGB[l.v>=0?1:0];txt=E.fmt(l.v)}
  c.fillStyle='rgba('+col.join(',')+',.16)';c.fillRect(x0,y0,x1-x0,y1-y0);
  if(x1-x0>70&&y1-y0>30){const cx=(x0+x1)/2,cy=(y0+y1)/2;c.font='700 16px Inter,sans-serif';const tw=c.measureText(txt).width+14;c.fillStyle='#fff';c.beginPath();c.roundRect(cx-tw/2,cy-13,tw,26,8);c.fill();
   c.fillStyle=E.C[MODE==='A'?l.cls:(l.v>=0?1:0)];c.textAlign='center';c.fillText(txt,cx,cy+6)}});c.restore()}
function draw(){const v=view(),{c,w,h}=E.fit($('c')),mp=E.map(w,h);
 const pf=x=>{let f=E.Fat(v.trees,x);if(v.extra)f+=v.extra.e*E.tval(v.extra.tr,x);return m.prob(f)};
 if(m.trees.length||anim)E.bg(c,w,h,pf);else{c.fillStyle='#f5f7fd';c.fillRect(0,0,w,h)}
 if(v.ov)drawLeaves(c,w,h,v.ov.tr,v.ov.lab*(v.ov.fade===undefined?1:v.ov.fade));
 const has=m.trees.length>0||(anim&&anim.prev.length>0)||(v.extra&&v.extra.e>0),o=[...Array(E.N).keys()].map(i=>[i,m.imp(i,v.F,v.w)]).sort((a,b)=>b[1]-a[1]);
 for(const[i,im]of o){const r=rad(im),x=mp.sx(E.X[i][0]),y=mp.sy(E.X[i][1]);c.beginPath();c.arc(x,y,r,0,6.2832);c.fillStyle=E.C[E.Y[i]];c.fill();
  const wr=has&&m.wrong(i,v.F);c.lineWidth=wr?3:1.6;c.strokeStyle=wr?'#1f2a4d':'#fff';c.stroke()}
 if(v.ov)drawSplits(c,w,h,v.ov.tr,v.ov.k,v.ov.T1,v.ov.fade===undefined?1:v.ov.fade);
 {const t=MODE==='A'?'wielkość = waga punktu · obwódka = model się myli':'wielkość = reszta (ile brakuje do dobrej odpowiedzi) · obwódka = model się myli';
  c.font='700 14px Inter,sans-serif';const tw=c.measureText(t).width+18;c.fillStyle='#ffffffe0';c.beginPath();c.roundRect(w-tw-10,h-34,tw,26,8);c.fill();c.fillStyle='#5d6a8e';c.textAlign='left';c.fillText(t,w-tw-1,h-16)}
 thumbs();errChart();head()}
function thumbs(){const{c,w,h}=E.fit($('th'));c.fillStyle='#f5f7fd';c.fillRect(0,0,w,h);c.fillStyle='#5d6a8e';c.font='700 14px Inter,sans-serif';c.textAlign='left';
 const pre=anim&&performance.now()-anim.t0<anim.T3,list=pre?anim.prev:m.trees,n=list.length;c.fillText(n?'Model = suma drzew':'Model = (jeszcze brak drzew)',12,20);if(!n)return;
 const sz=h-46,gap=26,maxN=Math.floor((w-24+gap)/(sz+gap)),start=Math.max(0,n-maxN);let x=12;
 if(start>0){c.fillStyle='#5d6a8e';c.font='700 18px Inter,sans-serif';c.fillText('… ',x,32+sz/2);x+=24}
 for(let k=start;k<n;k++){const tr=list[k],lv=E.leaves(tr),mp=E.map(sz,sz,0);c.save();c.translate(x,30);c.beginPath();c.roundRect(0,0,sz,sz,8);c.clip();c.fillStyle='#fff';c.fillRect(0,0,sz,sz);
  const vmax=MODE==='A'?1:Math.max(...lv.map(l=>Math.abs(l.v)),1e-6);
  lv.forEach(l=>{const col=E.RGB[MODE==='A'?l.cls:(l.v>=0?1:0)],a=MODE==='A'?.45:.15+.5*Math.abs(l.v)/vmax;c.fillStyle='rgba('+col.join(',')+','+a+')';
   c.fillRect(mp.sx(l.b[0]),mp.sy(l.b[3]),mp.sx(l.b[1])-mp.sx(l.b[0]),mp.sy(l.b[2])-mp.sy(l.b[3]))});
  E.splits(tr).forEach(s=>{c.strokeStyle='#1f2a4d';c.lineWidth=1.5;c.beginPath();if(s.f===0){c.moveTo(mp.sx(s.t),mp.sy(s.b[2]));c.lineTo(mp.sx(s.t),mp.sy(s.b[3]))}else{c.moveTo(mp.sx(s.b[0]),mp.sy(s.t));c.lineTo(mp.sx(s.b[1]),mp.sy(s.t))}c.stroke()});
  c.restore();c.fillStyle='#5d6a8e';c.font='600 12px Inter,sans-serif';c.textAlign='center';c.fillText(MODE==='A'?'×'+tr.alpha.toFixed(1).replace('.',','):'nr '+(k+1),x+sz/2,h-3);
  if(k<n-1){c.font='700 20px Inter,sans-serif';c.fillText('+',x+sz+gap/2,30+sz/2+7)}x+=sz+gap}}
function errChart(){const{c,w,h}=E.fit($('er'));c.fillStyle='#f5f7fd';c.fillRect(0,0,w,h);c.fillStyle='#5d6a8e';c.font='700 14px Inter,sans-serif';c.textAlign='left';c.fillText('Błędne punkty',12,20);
 const hs=anim&&performance.now()-anim.t0<anim.T3?hist.slice(0,-1):hist;if(!hs.length)return;const L=12,R=w-12,T=34,B=h-26,mx=Math.max(...hs,1),n=Math.max(hs.length,8),bw=(R-L)/n;
 hs.forEach((v,i)=>{const bh=v/mx*(B-T);c.fillStyle=i===hs.length-1?'#1f3b8a':'#9db6ea';c.fillRect(L+i*bw+2,B-bh,bw-4,bh);if(bw>18){c.fillStyle='#1f2a4d';c.font='600 12px Inter,sans-serif';c.textAlign='center';c.fillText(v,L+i*bw+bw/2,B-bh-4)}});
 c.fillStyle='#7b87a8';c.font='500 12px Inter,sans-serif';c.textAlign='center';c.fillText('po kolejnych drzewach',(L+R)/2,h-8)}
function head(){const pre=anim&&performance.now()-anim.t0<anim.T3,nw=pre?(anim.prev.length?hist[hist.length-2]:null):m.nWrong();$('head').innerHTML='Drzew: <b>'+(pre?anim.prev.length:m.trees.length)+'</b>'+(nw!==null?' · błędnych: <b>'+nw+'</b>':'')+'<small>'+(MODE==='A'?'drzewo uczy się gini na ważonych punktach':'drzewo uczy się przewidywać reszty')+'</small>';
 $('go').disabled=!!anim;$('five').disabled=!!anim;$('dv').textContent=depth()}
function step(fast){const tr=m.train(depth()),F0=m.F.slice(),w0=m.w.slice(),prev=m.trees.slice();m.add(tr);hist.push(m.nWrong());
 const ns=Math.max(1,E.splits(tr).length),sp=fast?120:320,T1=ns*sp,T2=T1+(fast?120:450),T3=T2+(fast?150:900),T4=T3+(fast?250:800);
 anim={tr,F0,w0,prev,t0:performance.now(),T1,T2,T3,T4};
 (function fr(){draw();if(performance.now()-anim.t0<T4)requestAnimationFrame(fr);else{anim=null;draw();if(queue>0){queue--;step(true)}}})()}
$('go').onclick=()=>{if(!anim)step(false)};$('five').onclick=()=>{if(!anim){queue=4;step(true)}};$('rst').onclick=init;$('dp').oninput=draw;
E.S.onResize(draw);init();
