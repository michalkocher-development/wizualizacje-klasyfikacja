/* Boosting na półksiężycach: A = wagi punktów (AdaBoost), B = reszty (gradient boosting / XGBoost). */
(function(g){'use strict';
const S=SKN,ds=S.makeDataset('moons',3),X=ds.X,Y=ds.y,N=X.length,C=S.COLORS,MODE=g.MODE;
const sig=z=>1/(1+Math.exp(-z)),V={x0:-1.6,x1:2.6,y0:-1.15,y1:1.6,pad:16},B0=[V.x0,V.x1,V.y0,V.y1],LR=1,LAM=1;
const RGB=[S.hexToRgb(C[0]),S.hexToRgb(C[1])];
/* ---- model ---- */
function Model(){this.trees=[];this.F=X.map(()=>0);this.w=X.map(()=>1/N)}
Model.prototype.prob=function(f){return MODE==='A'?sig(2*f):sig(f)};
Model.prototype.wrong=function(i,F){F=F||this.F;return(this.prob(F[i])>=.5)!==!!Y[i]};
Model.prototype.nWrong=function(){if(!this.trees.length)return null;let k=0;for(let i=0;i<N;i++)if(this.wrong(i))k++;return k};
/* znaczenie punktu: A = waga, B = |reszta| */
Model.prototype.imp=function(i,F,w){F=F||this.F;w=w||this.w;return MODE==='A'?w[i]*N:Math.abs(Y[i]-sig(F[i]))*2};
function grow(idx,depth,b,sc){if(depth===0||idx.length<2)return sc.leaf(idx,b);let best=null;
 for(const f of[0,1]){const o=idx.slice().sort((a,c)=>X[a][f]-X[c][f]);sc.reset(idx);
  for(let k=0;k<o.length-1;k++){sc.move(o[k]);const v=X[o[k]][f],v2=X[o[k+1]][f];if(v===v2)continue;const s=sc.score();if(!best||s<best.s)best={f,t:(v+v2)/2,s}}}
 if(!best||best.s>=sc.base(idx)-1e-12)return sc.leaf(idx,b);
 const L=idx.filter(i=>X[i][best.f]<=best.t),R=idx.filter(i=>X[i][best.f]>best.t),bl=b.slice(),br=b.slice();bl[2*best.f+1]=best.t;br[2*best.f]=best.t;
 return{f:best.f,t:best.t,b,L:grow(L,depth-1,bl,sc),R:grow(R,depth-1,br,sc)}}
/* A: ważone gini */
function scorerA(w){let tot,l,r;const gini=c=>{const n=c[0]+c[1];return n?n*(1-(c[0]/n)**2-(c[1]/n)**2):0};
 return{reset(idx){tot=[0,0];idx.forEach(i=>tot[Y[i]]+=w[i]);l=[0,0];r=tot.slice()},move(i){l[Y[i]]+=w[i];r[Y[i]]-=w[i]},score(){return gini(l)+gini(r)},
  base(idx){const c=[0,0];idx.forEach(i=>c[Y[i]]+=w[i]);return gini(c)},leaf(idx,b){const c=[0,0];idx.forEach(i=>c[Y[i]]+=w[i]);return{b,cls:c[1]>c[0]?1:0,n:idx.length}}}}
/* B: reszty, błąd kwadratowy; liście = poprawka */
function scorerB(gr,h){let G,H,gl,hl,n,nl,Q,ql;
 return{reset(idx){G=0;H=0;Q=0;idx.forEach(i=>{G+=gr[i];H+=h[i];Q+=gr[i]*gr[i]});gl=0;hl=0;ql=0;n=idx.length;nl=0},move(i){gl+=gr[i];hl+=h[i];ql+=gr[i]*gr[i];nl++},
  score(){return(ql-gl*gl/nl)+((Q-ql)-(G-gl)**2/(n-nl))},base(idx){let s=0,q=0;idx.forEach(i=>{s+=gr[i];q+=gr[i]*gr[i]});return q-s*s/idx.length},
  leaf(idx,b){let s=0,hh=0;idx.forEach(i=>{s+=gr[i];hh+=h[i]});return{b,v:LR*s/(hh+LAM),n:idx.length}}}}
Model.prototype.train=function(depth){const all=[...Array(N).keys()];
 if(MODE==='A'){const w=this.w,tr=grow(all,depth,B0,scorerA(w));let err=0;for(let i=0;i<N;i++)if(predCls(tr,X[i])!==Y[i])err+=w[i];
  err=Math.min(.499,Math.max(1e-3,err));tr.alpha=.5*Math.log((1-err)/err);tr.err=err;return tr}
 const gr=[],h=[];for(let i=0;i<N;i++){const p=sig(this.F[i]);gr.push(Y[i]-p);h.push(Math.max(p*(1-p),1e-6))}return grow(all,depth,B0,scorerB(gr,h))};
function leafOf(tr,x){while(tr.L)tr=x[tr.f]<=tr.t?tr.L:tr.R;return tr}
function predCls(tr,x){return leafOf(tr,x).cls}
function tval(tr,x){const l=leafOf(tr,x);return MODE==='A'?tr.alpha*(l.cls?1:-1):l.v}
Model.prototype.add=function(tr){this.trees.push(tr);for(let i=0;i<N;i++)this.F[i]+=tval(tr,X[i]);
 if(MODE==='A'){let s=0;for(let i=0;i<N;i++){const ok=predCls(tr,X[i])===Y[i];this.w[i]*=Math.exp(ok?-tr.alpha:tr.alpha);s+=this.w[i]}for(let i=0;i<N;i++)this.w[i]/=s}};
function Fat(trees,x){let f=0;for(const t of trees)f+=tval(t,x);return f}
function splits(tr,out){out=out||[];const q=[tr];while(q.length){const n=q.shift();if(n.L){out.push(n);q.push(n.L,n.R)}}return out}
function leaves(tr,out){out=out||[];if(!tr.L){out.push(tr);return out}leaves(tr.L,out);leaves(tr.R,out);return out}
/* ---- rysowanie ---- */
function fit(cv){const d=devicePixelRatio||1,r=cv.getBoundingClientRect();cv.width=Math.max(1,r.width*d);cv.height=Math.max(1,r.height*d);const c=cv.getContext('2d');c.setTransform(d,0,0,d,0,0);return{c,w:r.width,h:r.height}}
function map(w,h,pad){pad=pad===undefined?V.pad:pad;return{sx:v=>pad+(v-V.x0)/(V.x1-V.x0)*(w-2*pad),sy:v=>h-pad-(v-V.y0)/(V.y1-V.y0)*(h-2*pad),
 ix:px=>V.x0+(px-pad)/(w-2*pad)*(V.x1-V.x0),iy:py=>V.y0+(h-pad-py)/(h-2*pad)*(V.y1-V.y0)}}
function bg(c,w,h,pfn,pad){const m=map(w,h,pad),G=Math.max(2,Math.round(w/4)),H=Math.max(2,Math.round(h/4)),oc=document.createElement('canvas');oc.width=G;oc.height=H;const o=oc.getContext('2d'),im=o.createImageData(G,H);
 for(let j=0;j<H;j++)for(let i=0;i<G;i++){const p=pfn([m.ix((i+.5)*w/G),m.iy((j+.5)*h/H)]),k=(j*G+i)*4,col=p>=.5?RGB[1]:RGB[0];
  im.data[k]=col[0];im.data[k+1]=col[1];im.data[k+2]=col[2];im.data[k+3]=Math.round(255*(.06+.5*Math.abs(p-.5)*2))}
 o.putImageData(im,0,0);c.fillStyle='#f5f7fd';c.fillRect(0,0,w,h);c.imageSmoothingEnabled=false;c.drawImage(oc,0,0,w,h);c.imageSmoothingEnabled=true}
function ease(k){k=Math.max(0,Math.min(1,k));return k<.5?2*k*k:1-(-2*k+2)**2/2}
const fmt=v=>(v>=0?'+':'−')+Math.abs(v).toFixed(2).replace('.',',');
g.ENG={S,ds,X,Y,N,C,RGB,MODE,V,B0,sig,Model,leafOf,tval,Fat,splits,leaves,fit,map,bg,ease,fmt};
})(window);
