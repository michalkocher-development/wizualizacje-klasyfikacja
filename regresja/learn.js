/* Jak uczy się regresja logistyczna: spadek gradientu krok po kroku. Dane syntetyczne, brak zależności. */
(function(g){'use strict';
function rng(s){let a=s>>>0||1;return()=>{a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296}}
const R=rng(11);function randn(){let u=0,v=0;while(!u)u=R();while(!v)v=R();return Math.sqrt(-2*Math.log(u))*Math.cos(6.2832*v)}
const X=[],y=[];for(let i=0;i<45;i++){X.push([-1.3+randn()*.95,-.9+randn()*.95]);y.push(0)}
for(let i=0;i<45;i++){X.push([1.3+randn()*.95,.9+randn()*.95]);y.push(1)}
const sig=z=>1/(1+Math.exp(-z));
const P0={w1:-1.6,w2:1.2,b:1.8};
function prob(p,x){return sig(p.w1*x[0]+p.w2*x[1]+p.b)}
function loss(p){let s=0;for(let i=0;i<X.length;i++){const q=Math.min(1-1e-9,Math.max(1e-9,prob(p,X[i])));s-=y[i]?Math.log(q):Math.log(1-q)}return s/X.length}
function step(p,lr){let g1=0,g2=0,gb=0;for(let i=0;i<X.length;i++){const e=prob(p,X[i])-y[i];g1+=e*X[i][0];g2+=e*X[i][1];gb+=e}
 const n=X.length;return{w1:p.w1-lr*g1/n,w2:p.w2-lr*g2/n,b:p.b-lr*gb/n}}
function acc(p){let k=0;for(let i=0;i<X.length;i++)if((prob(p,X[i])>=.5)==!!y[i])k++;return k/X.length}
const V={x0:-4.2,x1:4.2,y0:-3.6,y1:3.6},COL=['#2b6fd6','#e4572e'];
function fit(cv){const d=devicePixelRatio||1,r=cv.getBoundingClientRect();cv.width=r.width*d;cv.height=r.height*d;const c=cv.getContext('2d');c.setTransform(d,0,0,d,0,0);return{c,w:r.width,h:r.height}}
/* rysunek: tło = prawdopodobieństwo, linia p=0,5, punkty (opcjonalnie rozmiar = błąd, strzałki) */
function scatter(cv,p,o){o=o||{};const{c,w,h}=fit(cv),sx=v=>(v-V.x0)/(V.x1-V.x0)*w,sy=v=>h-(v-V.y0)/(V.y1-V.y0)*h;c.clearRect(0,0,w,h);
 const G=60,oc=document.createElement('canvas');oc.width=oc.height=G;const oc2=oc.getContext('2d'),im=oc2.createImageData(G,G);
 for(let i=0;i<G;i++)for(let j=0;j<G;j++){const x=V.x0+(i+.5)/G*(V.x1-V.x0),yy=V.y0+(j+.5)/G*(V.y1-V.y0),q=prob(p,[x,yy]),k=((G-1-j)*G+i)*4,t=Math.abs(q-.5)*2,col=q>.5?[228,87,46]:[43,111,214];
  im.data[k]=col[0];im.data[k+1]=col[1];im.data[k+2]=col[2];im.data[k+3]=Math.round(255*t*.45)}
 oc2.putImageData(im,0,0);c.imageSmoothingEnabled=true;c.drawImage(oc,0,0,w,h);
 const n=Math.hypot(p.w1,p.w2)||1e-9;
 if(o.arrows)for(let i=0;i<X.length;i++){const e=Math.abs(prob(p,X[i])-y[i]);if(e<.25)continue;const d=(p.w1*X[i][0]+p.w2*X[i][1]+p.b)/n,px=X[i][0]-p.w1/n*d,py=X[i][1]-p.w2/n*d;
  c.strokeStyle='#1f2a4d';c.globalAlpha=Math.min(.7,e*.8);c.lineWidth=1.6;c.beginPath();c.moveTo(sx(X[i][0]),sy(X[i][1]));c.lineTo(sx(px),sy(py));c.stroke();c.globalAlpha=1}
 // linia decyzyjna
 c.strokeStyle='#1f2a4d';c.lineWidth=3.5;c.beginPath();let a=false;
 if(Math.abs(p.w2)>1e-6){const f=x=>-(p.w1*x+p.b)/p.w2;c.moveTo(sx(V.x0),sy(f(V.x0)));c.lineTo(sx(V.x1),sy(f(V.x1)))}else{const x=-p.b/p.w1;c.moveTo(sx(x),0);c.lineTo(sx(x),h)}c.stroke();
 for(let i=0;i<X.length;i++){const e=Math.abs(prob(p,X[i])-y[i]),r=o.size?4.5+13*e:6.5;c.beginPath();c.arc(sx(X[i][0]),sy(X[i][1]),r,0,6.2832);c.fillStyle=COL[y[i]];c.fill();c.lineWidth=2;c.strokeStyle='#fff';c.stroke()}
 return{sx,sy}}
function curve(cv,hist,max){const{c,w,h}=fit(cv),L=38,B=h-26,T=14,R=w-10;c.clearRect(0,0,w,h);c.fillStyle='#1f2a4d';c.font='600 12px Inter,sans-serif';c.textAlign='right';
 const ymax=Math.max(.8,hist[0]||0);[0,ymax/2,ymax].forEach(v=>{c.fillText(v.toFixed(1).replace('.',','),L-5,B-v/ymax*(B-T)+4);c.strokeStyle='#1f2a4d1a';c.beginPath();c.moveTo(L,B-v/ymax*(B-T));c.lineTo(R,B-v/ymax*(B-T));c.stroke()});
 c.textAlign='center';c.fillText('czas uczenia',(L+R)/2,h-6);
 c.strokeStyle='#e4572e';c.lineWidth=3;c.beginPath();hist.forEach((v,i)=>{const X=L+i/max*(R-L),Y=B-Math.min(v,ymax)/ymax*(B-T);i?c.lineTo(X,Y):c.moveTo(X,Y)});c.stroke();
 if(hist.length){const i=hist.length-1,X=L+i/max*(R-L),Y=B-Math.min(hist[i],ymax)/ymax*(B-T);c.fillStyle='#ffd89d';c.strokeStyle='#1f2a4d';c.lineWidth=2;c.beginPath();c.arc(X,Y,6,0,6.2832);c.fill();c.stroke()}}
g.LN={X,y,P0,prob,loss,step,acc,scatter,curve,fit,V,COL,sig};
})(window);
