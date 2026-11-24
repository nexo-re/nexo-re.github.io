/* Crochet hero + shop engine. Everything is driven by site-config.js via template.js */
(function(){
var CFG=window.SAYORI_CONFIG||{},RT=window.SITE_RT||{},NM=CFG.businessName||'Shop',HN=CFG.helperName||'Helper',TM=RT.theme||{},ZN=RT.zone||{left:.245,right:.775,sideBottom:.44};
var FREE=CFG.freeShippingAbove||0,T0=document.title;
var SRC=RT.heroSrc;
var H3=RT.hero3d||null,m3=H3?H3.el:null,m3In=null,m3e=0,done3=null; // optional 3D hero (hero3d.js)
var bgc=document.getElementById('bg'),bgx=bgc.getContext('2d'),cv=document.getElementById('c'),ctx=cv.getContext('2d');
var img=new Image();img.onload=init;img.src=SRC;
var w,h,COLS,ROWS,sw,rh,cells,M=110,TOP=100,sc=1,S=1,tx=0,ty=0,cur=0,tgt=0,dpr=1,ds=1;
var col=[200,120,150],ball=[200,120,150];
var list=[],cum=[],lens=[],rowS=[],Ttot=0,auto=false,last=0;
var I=.2,gcur=0,FILL=TM.logoFill||'#b01e1e',LOGO=RT.logo,LG={k:1,x0:0,y0:0,hh:0,R:30},lg=document.createElement('canvas'),lgx=lg.getContext('2d');

var CH=RT.charms;
var THR=[.06,.22,.38,.54,.70],PAIRS=[[0,1],[3,4]],cs=[],cim=[],LAY=[],Bm=0,GR=1800;
CH.forEach(function(c,k){var im=new Image();im.src=c.src;cim[k]=im;c.hw=(c.bodyR-c.bodyL)/2;c.bcx=(c.bodyL+c.bodyR)/2-c.px;c.bcy=(c.bodyTop+c.h)/2;
  cs[k]={o:0,v:0,th:0,w:0,drop:false,landed:false,ready:false}});

function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function sm(t){t=clamp(t,0,1);return t*t*(3-2*t)}
function lerp(a,b,t){return a+(b-a)*t}
var STITCH=RT.stitch||15,AUTO_SECS=9; // STITCH = source px per stitch (bigger = fewer stitches = faster). AUTO_SECS = how long "tap to watch" takes
function calcCL(){return Math.round(clamp(innerHeight*1.45,960,1700))} // total scroll distance of the crochet
function init(){
  w=img.width;h=img.height;COLS=Math.round(w/STITCH);sw=w/COLS;ROWS=Math.round(h/sw);rh=h/ROWS;
  var o=document.createElement('canvas');o.width=COLS;o.height=ROWS;var x=o.getContext('2d');
  x.imageSmoothingQuality='high';x.drawImage(img,0,0,COLS,ROWS);
  var d=x.getImageData(0,0,COLS,ROWS).data;cells=[];
  for(var r=0;r<ROWS;r++){cells[r]=[];for(var c=0;c<COLS;c++){var i=(r*COLS+c)*4;cells[r][c]=[d[i],d[i+1],d[i+2],d[i+3]]}}
  var prev=null;
  for(var r=0;r<ROWS;r++){
    var dir=r%2===0?1:-1,arr=[];
    for(var c=0;c<COLS;c++)if(cells[r][c][3]>60)arr.push(c);
    if(dir<0)arr.reverse();
    rowS[r]=list.length;
    arr.forEach(function(c){
      var len=1;
      if(prev){var dist=Math.abs(c-prev.c)-1;if(dist>0)len+=Math.min(2.5,dist*.12);if(prev.r!==r)len+=.5}
      var L={r:r,c:c,dir:dir,x:M+(c+.5)*sw,y:TOP+h-(r+.5)*rh,col:cells[r][c]};
      list.push(L);cum.push(Ttot);lens.push(len);Ttot+=len;prev=L});
  }
  CL=calcCL();document.body.style.height=(CL+innerHeight)+'px';buildShop();
  resize();var lw=innerWidth,lh=innerHeight;addEventListener('resize',function(){if(innerWidth===lw&&Math.abs(innerHeight-lh)<160)return;lw=innerWidth;lh=innerHeight;resize()});addEventListener('scroll',onS,{passive:true});
  onS();requestAnimationFrame(loop);
  var hh=location.hash;
  if(hh==='#shop'||hh==='#anya'){skipToShop(1);if(hh==='#anya')setTimeout(function(){toggleChat(true)},600)}
}
// jump straight to the shop (used by the Skip button and by links like /#shop from other pages)
function skipToShop(instant){
  if(sbOn)openSB(false);
  auto=false;tgt=1;gcur=1;var y=CL+shA;
  sTgt=shA;sCur=shA;lockMin=y;pv=instant?1:Math.max(pv,.5);pvel=0;lastP=-1;lastOff=-1;
  scrollTo(0,y)}
function maxScroll(){return CL}
function setAuto(v){
  if(v){if(tgt>=.9995){tgt=0;gcur=0}else gcur=tgt;auto=true}
  else{auto=false;scrollTo(0,tgt*maxScroll())}}
function resize(){CL=calcCL();dpr=Math.min(innerWidth<800||innerWidth>1500?1.5:2,devicePixelRatio||1);var cw=cv.clientWidth,ch=cv.clientHeight;
  cv.width=cw*dpr;cv.height=ch*dpr;
  Bm=.16*cv.height;var top=Bm+6*dpr;
  sc=Math.min((cv.width-8*dpr)/w,(cv.height-top-6*dpr)/h);
  tx=(cv.width-w*sc)/2-M*sc;ty=top-TOP*sc;layoutCharms();layoutLogo();drawBg();layoutShop();buildDeco()}
function layoutCharms(){
  var hMax=Math.max.apply(null,CH.map(function(c){return c.h})),wMax=Math.max.apply(null,CH.map(function(c){return 2*c.hw}));
  var dX0=(cv.width-w*sc)/2,dTop=ty+TOP*sc,dW=w*sc,dH=h*sc,headL=dX0+ZN.left*dW,headR=dX0+ZN.right*dW;
  var cMid=Math.min(Bm/(.62*hMax),(headR-headL)*.9/(2*wMax*1.08)),armsTop=dTop+ZN.sideBottom*dH-10*dpr;
  var RWl=headL-6*dpr,RWr=cv.width-headR-6*dpr;
  var cSide=Math.min(RWl/(2*wMax*1.08),RWr/(2*wMax*1.08),armsTop/(.85*hMax),cMid*1.5);
  GR=cv.height*3;LAY=[];
  for(var k=0;k<CH.length;k++){
    var c=CH[k],L={},mid=k===2,ri=k-3;
    if(k<2){L.s=cSide;L.x=RWl*(k==0?.25:.75);L.lo=0;L.hi=headL-4*dpr}
    else if(mid){L.s=cMid;L.x=cv.width/2;L.lo=headL;L.hi=headR}
    else{L.s=cSide;L.x=headR+6*dpr+RWr*(ri==0?.25:.75);L.lo=headR+4*dpr;L.hi=cv.width}
    if(mid){L.bot=Bm;L.pv=L.bot-c.h*L.s;L.cord=0}
    else{L.bot=Math.min(dTop+.3*dH,armsTop);L.pv=-6*dpr;L.cord=L.bot-c.h*L.s-L.pv} // long cord from above the screen edge
    L.off=L.bot+40*dpr;LAY[k]=L}}
function onS(){if(lockMin&&scrollY<lockMin-1){scrollTo(0,lockMin);return}if(!lockMin&&pv<.999&&scrollY>CL+shA+1){scrollTo(0,CL+shA);sTgt=shA;return}sTgt=Math.max(0,scrollY-CL);if(auto)return;var m=maxScroll();tgt=m>0?clamp(scrollY/m,0,1):0}
function rgb(c,f){return 'rgb('+[0,1,2].map(function(i){return Math.round(clamp(f(c[i]),0,255))}).join(',')+')'}
function sh(c,k){return rgb(c,function(v){return k>=1?v+(255-v)*(k-1):v*k})}
function hi(c,k){return rgb(c,function(v){return v+(255-v)*k+16})}
function line(a,b,c,d){ctx.beginPath();ctx.moveTo(a,b);ctx.lineTo(c,d);ctx.stroke()}
function strand(x1,y1,x2,y2,wd,c,al){
  ctx.save();ctx.globalAlpha=al;ctx.lineCap='round';
  ctx.strokeStyle=sh(c,.42);ctx.lineWidth=wd;line(x1,y1,x2,y2);
  ctx.strokeStyle=sh(c,.92);ctx.lineWidth=wd*.8;line(x1,y1,x2,y2);
  var dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L,nx=-uy,ny=ux;
  ctx.strokeStyle=sh(c,.5);ctx.lineWidth=Math.max(.7,wd*.13);ctx.lineCap='butt';ctx.globalAlpha=al*.55;
  ctx.beginPath();for(var t=wd*.3;t<L-wd*.2;t+=wd*.5){var px=x1+ux*t,py=y1+uy*t;
    ctx.moveTo(px-nx*wd*.36-ux*wd*.2,py-ny*wd*.36-uy*wd*.2);ctx.lineTo(px+nx*wd*.36+ux*wd*.2,py+ny*wd*.36+uy*wd*.2)}ctx.stroke();
  ctx.globalAlpha=al*.8;ctx.strokeStyle=hi(c,.35);ctx.lineWidth=Math.max(.8,wd*.22);ctx.lineCap='round';
  line(x1-nx*wd*.15,y1-ny*wd*.15,x2-nx*wd*.15,y2-ny*wd*.15);ctx.restore()}
// twisted yarn along any path (build() must call beginPath + path commands)
function rope(build,wd,c,al){
  ctx.save();ctx.globalAlpha=al;ctx.lineCap='round';ctx.lineJoin='round';
  ctx.strokeStyle=sh(c,.4);ctx.lineWidth=wd;build();ctx.stroke();
  ctx.strokeStyle=sh(c,.95);ctx.lineWidth=wd*.78;build();ctx.stroke();
  ctx.globalAlpha=al*.5;ctx.lineCap='butt';ctx.setLineDash([wd*.2,wd*.5]);ctx.strokeStyle=sh(c,.5);build();ctx.stroke();ctx.setLineDash([]);
  ctx.globalAlpha=al*.7;ctx.lineCap='round';ctx.strokeStyle=hi(c,.35);ctx.lineWidth=Math.max(.5,wd*.2);build();ctx.stroke();ctx.restore()}
// V stitch: legs grow upward from the loop below
function stitch(x,y,c,g1,g2,al,bk){
  var wd=sw*.5,top=y+rh*.12,bot=y+rh*.98,cx=x+sw*.5;
  ctx.save();ctx.globalAlpha=al*bk;ctx.fillStyle=sh(c,.3);ctx.fillRect(x+sw*.1,y+rh*.05,sw*.8,rh*.9);ctx.restore();
  var lx=x+sw*.18,rx=x+sw*.82;
  if(g1>0)strand(cx,bot,lerp(cx,lx,g1),lerp(bot,top,g1),wd,c,al);
  if(g2>0)strand(cx,bot,lerp(cx,rx,g2),lerp(bot,top,g2),wd,c,al)}
function slice(r,c0,c1,al){var y=h-(r+1)*rh;ctx.save();ctx.globalAlpha=al;ctx.drawImage(img,c0*sw,y,(c1-c0)*sw,rh+.6,M+c0*sw,TOP+y,(c1-c0)*sw,rh+.6);ctx.restore()}

// ---- hook choreography: one single-crochet stitch ----
function pose(i,p,trav,ts){
  var L=list[i],pv=i>0?list[i-1]:null,dir=L.dir,cx=L.x,cy=L.y;
  var pcx=pv?pv.x:cx-dir*sw*2,pcy=pv?pv.y:cy,pdir=pv?pv.dir:dir;
  var Pa=[pcx,pcy-rh*.4],Pn=[cx,cy-rh*.4],Q=[cx,cy+rh*.45];
  var S0=[cx-dir*sw*.5,cy-rh*1.05],S1=[cx,cy+rh*.6],S2=[cx,cy-rh*1.2],S3=[cx+dir*sw*.5,cy-rh*1.05],P3=[pcx+pdir*sw*.5,pcy-rh*1.05];
  var x,y,th,e;
  if(trav<1){e=sm(trav);x=lerp(P3[0],S0[0],e);y=lerp(P3[1],S0[1],e)-Math.sin(Math.PI*trav)*rh*1.2;th=.52}
  else if(p<.18){e=sm(p/.18);x=lerp(S0[0],S1[0],e);y=lerp(S0[1],S1[1],e);th=.52-.31*e}
  else if(p<.34){x=S1[0];y=S1[1];th=.21+.35*Math.sin(Math.PI*(p-.18)/.16)}
  else if(p<.56){e=sm((p-.34)/.22);x=lerp(S1[0],S2[0],e);y=lerp(S1[1],S2[1],e);th=.21+.31*e}
  else if(p<.7){x=S2[0];y=S2[1];th=.52+.3*Math.sin(Math.PI*(p-.56)/.14)}
  else if(p<.9){e=sm((p-.7)/.2);x=lerp(S2[0],S3[0],e);y=lerp(S2[1],S3[1],e);th=.52}
  else{x=S3[0];y=S3[1];th=.52}
  x+=Math.sin(ts*.013)*.3;y+=Math.cos(ts*.017)*.3;
  var posA=p<.18?9:p<.34?lerp(9,12,(p-.18)/.16):p<.56?lerp(12,18,sm((p-.34)/.22)):18;
  var fade=p<.7?1:Math.max(0,1-(p-.7)/.2),rings=[];
  rings.push({t:posA,s:1,a:fade,ax:Pa[0],ay:Pa[1]});
  if(p>=.2&&trav>=1)rings.push({t:p<.56?5:lerp(5,12,sm((p-.56)/.12)),s:p<.3?.25+.75*sm((p-.2)/.1):1,a:fade,ax:p>=.34?Q[0]:null,ay:Q[1]});
  if(p>=.58)rings.push({t:p<.85?5:lerp(5,9,sm((p-.85)/.15)),s:p<.68?.25+.75*sm((p-.58)/.1):1,a:1,ax:p>=.7?Pn[0]:null,ay:Pn[1]});
  var endT=p<.2?posA:p<.3?lerp(posA,5,sm((p-.2)/.1)):p<.85?5:lerp(5,9,sm((p-.85)/.15));
  return {x:x,y:y,th:th,rings:rings,endT:endT}}

function hookPath(){ctx.beginPath();ctx.moveTo(0,.5);ctx.lineTo(3,-2);ctx.lineTo(42,-2);ctx.lineTo(42,2);ctx.lineTo(10,2);ctx.lineTo(7.2,.9);ctx.lineTo(4.4,.9);ctx.lineTo(3,2.3);ctx.lineTo(.6,1.6);ctx.closePath()}
function handlePath(){ctx.beginPath();ctx.moveTo(42,-3.2);ctx.lineTo(90,-5.4);ctx.quadraticCurveTo(96,0,90,5.4);ctx.lineTo(42,3.2);ctx.closePath()}
function drawHook(){
  ctx.save();ctx.translate(2.5,3.5);ctx.fillStyle='rgba(60,10,35,.2)';hookPath();ctx.fill();handlePath();ctx.fill();ctx.restore();
  var g=ctx.createLinearGradient(0,-2,0,2.3);g.addColorStop(0,'#f6f8fb');g.addColorStop(.5,'#c4cdd5');g.addColorStop(1,'#8892a0');
  hookPath();ctx.fillStyle=g;ctx.fill();ctx.strokeStyle='#6b7480';ctx.lineWidth=.45;ctx.lineJoin='round';ctx.stroke();
  var g2=ctx.createLinearGradient(0,-5.4,0,5.4);g2.addColorStop(0,'#5fd0c8');g2.addColorStop(.45,'#23958f');g2.addColorStop(1,'#126460');
  handlePath();ctx.fillStyle=g2;ctx.fill();ctx.strokeStyle='#0d4a47';ctx.lineWidth=.5;ctx.stroke();
  ctx.beginPath();ctx.ellipse(66,0,11,6.8,0,0,7);var g3=ctx.createLinearGradient(0,-7,0,7);g3.addColorStop(0,'#7be0d8');g3.addColorStop(1,'#168079');ctx.fillStyle=g3;ctx.fill();ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=.8;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(46,-2.2);ctx.lineTo(88,-3.8);ctx.stroke()}


// ---- charms: pendulums that drop in from above as Anya is crocheted ----
function LB(k){return LAY[k].cord+CH[k].bcy*LAY[k].s}
function bodyX(k){var c=CH[k],a=cs[k],L=LAY[k];return L.x+L.s*c.bcx*Math.cos(a.th)-LB(k)*Math.sin(a.th)}
function charms(dt,ts){
  if(!LAY.length)return;
  var n=Math.max(1,Math.ceil(dt*480)),h2=dt/n,KS=GR*8,CSd=2*.35*Math.sqrt(KS),t=ts/1000;
  for(var s=0;s<n;s++){
    for(var k=0;k<CH.length;k++){
      var a=cs[k],c=CH[k],L=LAY[k],Lb=LB(k),oacc=0,want=cur>=THR[k]&&cur>0;
      if(!a.ready){a.ready=true;a.o=L.off}
      if(want){
        if(!a.drop){a.drop=true;a.v=0;a.o=L.off;a.th=(Math.random()-.5)*.3;a.w=(Math.random()-.5)*1.2}
        var acc=-GR;if(a.o<0)acc+=-KS*a.o-CSd*a.v;
        a.v+=acc*h2;a.o+=a.v*h2;oacc=acc;
        if(!a.landed&&a.o<=0){a.landed=true;var dk=Math.random()<.5?-1:1;a.w+=dk*(.4+Math.random()*.2)*Math.sqrt(GR/Lb)}
      }else{a.landed=false;a.drop=false;a.o+=(L.off-a.o)*Math.min(1,h2*7);a.v=0}
      var geff=a.drop?clamp(GR+oacc,0,4*GR):GR;
      var al=-(geff/Lb)*Math.sin(a.th)-.42*a.w+.12*Math.sin(t*.9+k*1.7);
      a.w+=al*h2;a.th+=a.w*h2;
      if(a.landed){ // walls keep charms off Anya and out of other groups
        var x=bodyX(k),hw=c.hw*L.s,r=LB(k),pen=0;
        if(x-hw<L.lo)pen=L.lo-(x-hw);else if(x+hw>L.hi)pen=L.hi-(x+hw);
        if(pen!==0){a.th-=pen/r;var vx=-r*a.w;if((pen>0&&vx<0)||(pen<0&&vx>0))a.w=.4*a.w*-1}
      }
    }
    for(var g=0;g<PAIRS.length;g++){ // neighbours clink instead of overlapping
      var k=PAIRS[g][0],A=cs[k],B=cs[k+1];if(!A.landed||!B.landed)continue;
      var ca=CH[k],cb=CH[k+1],la=LAY[k],lb=LAY[k+1],pen=ca.hw*la.s+cb.hw*lb.s+2*dpr-(bodyX(k+1)-bodyX(k));
      if(pen>0){
        var ra=LB(k),rb=LB(k+1);
        A.th+=pen/2/ra;B.th-=pen/2/rb;
        var va=-ra*A.w,vb=-rb*B.w;
        if(va-vb>0){var m=(va+vb)/2,d=(va-vb)/2,e=.5;va=m-e*d;vb=m+e*d;A.w=-va/ra;B.w=-vb/rb}
      }
    }
  }
  ctx.setTransform(1,0,0,1,0,0);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
  for(var k=0;k<CH.length&&!shopMode;k++){
    var a=cs[k],c=CH[k],L=LAY[k],im=cim[k];if(!im.complete||a.o>=L.off-1)continue;
    ctx.save();ctx.translate(L.x,L.pv-a.o);ctx.rotate(a.th);
    if(L.cord>0){ctx.strokeStyle='#8a8a92';ctx.lineWidth=Math.max(1.2*dpr,2.4*L.s);ctx.lineCap='round';ctx.beginPath();ctx.moveTo(0,-40*dpr);ctx.lineTo(0,L.cord+1);ctx.stroke()}
    ctx.shadowColor='rgba(255,255,255,.45)';ctx.shadowBlur=3*dpr;ctx.drawImage(im,-c.px*L.s,L.cord,c.w*L.s,c.h*L.s);ctx.restore();
  }
}

// ---- Sayori logo: outline draws in, colour fills, then yields to Anya ----
function layoutLogo(){
  var rc=cv.getBoundingClientRect(),k=Math.min(cv.width*.7/LOGO.w,cv.width*.34/LOGO.h,innerHeight*dpr*.3/LOGO.h);
  LG.k=k;LG.hh=LOGO.h*k;LG.x0=(cv.width-LOGO.w*k)/2;LG.y0=(innerHeight/2-rc.top)*dpr-LG.hh/2;LG.R=cv.width*.05;
  lg.width=cv.width;lg.height=cv.height;LG.key=''}
// paints letter n of the logo (text) or the whole logo picture (img) into context c
function paintLogo(c){c.drawImage(LOGO.img,0,0,LOGO.w,LOGO.h)}
function drawLogo(done,i,p,live){
  var O=clamp((gcur-.01)/.09,0,1),F=clamp((gcur-.09)/.09,0,1);
  if(O<=0||!LG.k)return;
  var k=LG.k,key=F.toFixed(3)+(live?(done?'d':list[i].r+':'+(i>>2)):'n'),rb=key!==LG.key;LG.key=key;
  if(rb){lgx.setTransform(1,0,0,1,0,0);lgx.globalCompositeOperation='source-over';lgx.globalAlpha=1;lgx.clearRect(0,0,lg.width,lg.height)}
  if(F>0){
    if(rb){lgx.setTransform(k,0,0,k,LG.x0,LG.y0);lgx.fillStyle=FILL;
    lgx.globalAlpha=sm(clamp(F*1.6,0,1));paintLogo(lgx);
    lgx.globalAlpha=1;
    if(live){ // parts of the logo near the crocheted area lose their fill and stay as outlines
      var SO=6000,by0=(LG.y0-LG.R*2-ty)/S-TOP,by1=(LG.y0+LG.hh+LG.R*2-ty)/S-TOP;
      var sub=function(a,b){var sy=Math.max(a,by0),ey=Math.min(b,by1);if(ey>sy)lgx.drawImage(img,0,sy,w,ey-sy,M,TOP+sy,w,ey-sy)};
      lgx.globalCompositeOperation='destination-out';lgx.shadowColor='#000';lgx.shadowBlur=LG.R;lgx.shadowOffsetX=SO;
      lgx.setTransform(S,0,0,S,tx-SO,ty);
      for(var ps=0;ps<3;ps++){
        if(done)sub(0,h);
        else{
          var r=list[i].r,yb=h-r*rh;sub(yb,h);
          if(h-(r+1)*rh<by1&&yb>by0)for(var j=rowS[r];j<i;j++){var q=list[j],y=h-(r+1)*rh;lgx.drawImage(img,q.c*sw,y,sw,rh+.6,M+q.c*sw,TOP+y,sw,rh+.6)}
        }
      }
      lgx.shadowColor='rgba(0,0,0,0)';lgx.shadowBlur=0;lgx.shadowOffsetX=0;lgx.globalCompositeOperation='source-over';
    }
    }ctx.drawImage(lg,0,0);
  }
  // the logo fades in as a faint ghost, then fills
  ctx.save();ctx.setTransform(k,0,0,k,LG.x0,LG.y0);ctx.globalAlpha=.4*O*(1-F);paintLogo(ctx);ctx.restore()}

// ---- background: black with pink crochet borders ----
function drawBg(){
  var W=bgc.width=Math.round(innerWidth*dpr),H=bgc.height=Math.round(innerHeight*dpr),x=bgx;
  x.setTransform(1,0,0,1,0,0);
  var g=x.createRadialGradient(W/2,H*.55,W*.05,W/2,H*.55,Math.max(W,H)*.75);g.addColorStop(0,'#212121');g.addColorStop(1,'#0F0F0F');x.fillStyle=g;x.fillRect(0,0,W,H);}


// ---- products come from SayoriStore (products.csv) ----
var PRODUCTS=[],PBY={},curCat='all',CATS=[['all','All']],shopReady=false,pending=null,pdKey='';
var BOT={greeting:"Hi! I'm "+HN+", "+NM+"'s little helper. Ask me about our products, prices or shipping.",
 chips:['Show me your products','Cheapest item?','Shipping info'],
 faq:[
  {k:['ship','deliver'],a:(FREE?'Free shipping above '+rs(FREE)+'. ':'')+'Every product shows its own shipping time.'}],
 fallback:"I'm still learning about "+NM+". Try asking about prices, shipping or a product name."};
var pdEl=document.getElementById('pd'),pdOpen=false;
if(window.SayoriStore)SayoriStore.onChange(function(l){if(!shopReady){pending=l;return}setProducts(l)});
var pv=0,pvel=0,DUR=3.2,hdr=document.getElementById('hd'),creamEl=document.getElementById('cream'),lockMin=0,hid=0,slR=[],lastP=-1,lastOff=-1,CL=0,sCur=0,sTgt=0,shopMode=false,shA=900,shCs=0,shSafe={l:0,t:0,r:0,b:0},shAR={x:0,y:0,w:1,h:1,t:0},shBot={w:62,h:92,x:0,y:0},shFW=1,shFH=1,
 shEl=document.getElementById('shop'),shIn=document.getElementById('shopIn'),shGrid=document.getElementById('grid'),
 fxc=document.getElementById('fx'),fxg=fxc.getContext('2d'),botEl=document.getElementById('bot'),tipEl=document.getElementById('tip'),
 chatEl=document.getElementById('chat'),shCards=[],shSlots=[],chatOpen=false;
function smr(t){t=clamp(t,0,1);return t*t*t*(t*(6*t-15)+10)}

function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function rs(n){return (CFG.currency||'\u20b9')+Number(n).toLocaleString(CFG.locale||'en-IN')}
var TRUCK='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 3h15v13H1zM16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2"/><circle cx="18.5" cy="18.5" r="2"/></svg>';
function openPD(i,keep){
  var p=PRODUCTS[i];if(!p)return;pdKey=p.k;document.title=p.n+' | '+NM+' handmade crochet plushie';
  var d=p.o?Math.round((1-p.p/p.o)*100):0,im=p.imgs&&p.imgs.length?p.imgs:[],th='';
  if(im.length>1)im.forEach(function(u,n){th+='<button type="button" class="'+(n?'':'on')+'" data-src="'+esc(u)+'" aria-label="Photo '+(n+1)+'"><img src="'+esc(u)+'" alt="" loading="lazy"></button>'});
  document.getElementById('pdi').innerHTML='<button class="pdb" type="button" id="pdBack"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>Back to store</button>'+
  '<div class="pdg"><div class="pdm'+(im.length?'':' noimg')+'">'+(im.length?'<img id="pdMain" src="'+esc(im[0])+'" alt="'+esc(p.n)+'">':'')+'</div>'+(th?'<div class="pdt" id="pdt">'+th+'</div>':'')+'</div>'+
  '<div class="pdx"><h1>'+esc(p.n)+'</h1>'+
  '<div class="pdp"><b>'+rs(p.p)+'</b>'+(p.o?'<s>'+rs(p.o)+'</s><em>'+d+'% off</em>':'')+'</div>'+
  (p.d?'<p class="pdn">'+esc(p.d)+'</p>':'')+(p.soldOut?'<p class="pdl">Sold out</p>':p.low?'<p class="pdl">Only '+p.low+' left</p>':'')+
  '<button class="pda" type="button" id="pdAdd"'+(p.soldOut?' disabled':'')+'>'+(p.soldOut?'Sold out':'+ Add to Bag')+'</button>'+
  (p.ship?'<div class="pdsh"><span>'+TRUCK.replace('width="16" height="16"','width="26" height="26"')+'</span><div><b>'+esc(p.ship)+'</b><small>Handmade and packed with care</small></div></div>':'')+
  '<details class="pdd"><summary>Product Details</summary><dl><dt>Category</dt><dd>'+esc(p.cl)+'</dd><dt>Made</dt><dd>'+esc(CFG.cardLine||'Handmade')+'</dd><dt>Availability</dt><dd>'+(p.soldOut?'Sold out':p.low?'Only '+p.low+' left':'In stock')+'</dd>'+(p.ship?'<dt>Shipping</dt><dd>'+esc(p.ship.replace(/^Ships in /,''))+'</dd>':'')+(FREE?'<dt>Free shipping</dt><dd>Above '+rs(FREE)+'</dd>':'')+'</dl></details>'+
  '</div>';
  document.getElementById('pdBack').onclick=function(){closePD(true)};
  var ad=document.getElementById('pdAdd');
  ad.onclick=function(){var b=this,c=shCards[PRODUCTS.indexOf(PBY[pdKey])];if(c){var a=c.querySelector('.ad');if(a)a.click()}b.textContent='Added to bag';b.classList.add('on');setTimeout(function(){b.textContent='+ Add to Bag';b.classList.remove('on')},1200)};
  var tt=document.getElementById('pdt');
  if(tt)tt.onclick=function(e){var b=e.target.closest('button');if(!b)return;var m=document.getElementById('pdMain');m.src=b.getAttribute('data-src');m.parentNode.classList.remove('noimg');[].forEach.call(tt.children,function(x){x.classList.toggle('on',x===b)})};
  if(!keep)pdEl.scrollTop=0;
  pdEl.classList.add('on');pdEl.setAttribute('aria-hidden','false');
  if(!pdOpen){pdOpen=true;try{history.pushState({pd:1},'')}catch(e){}}}
function closePD(back){
  if(!pdOpen)return;pdOpen=false;pdKey='';document.title=T0;pdEl.classList.remove('on');pdEl.setAttribute('aria-hidden','true');
  if(back){try{if(history.state&&history.state.pd)history.back()}catch(e){}}}
pdEl.addEventListener('error',function(e){var t=e.target;if(t&&t.tagName==='IMG'&&t.id==='pdMain')t.parentNode.classList.add('noimg')},true);
addEventListener('popstate',function(){if(pdOpen)closePD(false)});
addEventListener('keydown',function(e){if(e.key==='Escape')closePD(true)});
// ---- crochet border + yarn decorations that stitch in while Anya is crocheted ----
var dkS=document.getElementById('deco'),dkI=[],dkLast=-1,hintEl=document.getElementById('hint');
hintEl.onclick=function(){if(gcur>=.9995)scrollTo({top:CL+shA,behavior:'smooth'});else setAuto(true)};
hintEl.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();hintEl.onclick()}};
var skipEl=document.getElementById('skip');
skipEl.onclick=function(){skipToShop(0)};
function hintFrame(){
  var atStart=gcur<.006&&!auto,atEnd=gcur>=.9995&&sCur<1&&!auto;
  hintEl.classList.toggle('on',atStart||atEnd);hintEl.setAttribute('aria-hidden',(atStart||atEnd)?'false':'true');
  skipEl.classList.toggle('on',gcur>.012&&pv<.05&&sCur<2)}
function buildDeco(){
  var W=document.documentElement.clientWidth,H=innerHeight,u=Math.min(W/390,H/844),PK=TM.PK||'#f2a0b4',PKD=TM.PKD||'#c0687f',PKL=TM.PKL||'#ffd6e0',CR=TM.CR||'#f1e2cf',CRD=TM.CRD||'#c9b296',
  defs='',body='',n=0;dkI=[];
  function X(x,h){return h==='R'?W-(390-x)*u:x*u}function Y(y,v){return v==='B'?H-(844-y)*u:y*u}
  function mp(d,h,v){var i=0;return d.replace(/[A-Za-z]|-?\d*\.?\d+/g,function(t){if(/[A-Za-z]/.test(t))return t;return (i++%2===0?X(+t,h):Y(+t,v)).toFixed(1)})}
  function rope(d,sw,al){return '<path d="'+d+'" fill="none" stroke="'+PKD+'" stroke-width="'+(sw+2)+'" stroke-linecap="round" stroke-linejoin="round"/><path d="'+d+'" fill="none" stroke="'+PK+'" stroke-width="'+sw+'" stroke-linecap="round" stroke-linejoin="round"/><path d="'+d+'" fill="none" stroke="'+PKL+'" stroke-width="'+(sw*.7)+'" stroke-dasharray="'+(sw*.14)+' '+(sw*.55)+'" opacity=".5" stroke-linejoin="round"/>'}
  function strand(d,h,v,a,b,sw){var id=n++,pd=mp(d,h,v);
    defs+='<mask id="m'+id+'" maskUnits="userSpaceOnUse" x="-60" y="-60" width="'+(W+120)+'" height="'+(H+120)+'"><path d="'+pd+'" fill="none" stroke="#fff" stroke-width="'+(sw*u*3)+'" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1"/></mask>';
    body+='<g id="dk'+id+'" mask="url(#m'+id+')" style="opacity:0">'+rope(pd,sw*u)+'</g>';dkI.push({t:'s',a:a,b:b,id:id})}
  function pop(inner,cx,cy,a,b){var id=n++;body+='<g id="dk'+id+'" style="opacity:0">'+inner+'</g>';dkI.push({t:'p',a:a,b:b,id:id,cx:cx,cy:cy})}
  function flower(x,h,y,v,r,fill,line,a,b,al){var cx=X(x,h),cy=Y(y,v),R=r*u,g='';
    for(var i=0;i<5;i++){var an=i*1.2566-1.5708;g+='<circle cx="'+(cx+Math.cos(an)*R*.55).toFixed(1)+'" cy="'+(cy+Math.sin(an)*R*.55).toFixed(1)+'" r="'+(R*.5).toFixed(1)+'" fill="'+fill+'" stroke="'+line+'" stroke-width="'+Math.max(.8,R*.07)+'"/>'}
    g+='<circle cx="'+cx+'" cy="'+cy+'" r="'+(R*.2).toFixed(1)+'" fill="#0F0F0F" opacity=".85"/><circle cx="'+cx+'" cy="'+cy+'" r="'+(R*.32).toFixed(1)+'" fill="none" stroke="'+line+'" stroke-width="'+Math.max(.8,R*.08)+'" stroke-dasharray="'+(R*.1)+' '+(R*.16)+'"/>';
    pop('<g opacity="'+(al||1)+'">'+g+'</g>',cx,cy,a,b)}
  function heart(x,h,y,v,r,fill,line,a,b,al,rot){var cx=X(x,h),cy=Y(y,v),R=r*u;
    pop('<g opacity="'+(al||1)+'" transform="translate('+cx+' '+cy+') rotate('+(rot||0)+') scale('+R+')"><path d="M0 .9C-1.3-.1-.8-1 0-.35C.8-1 1.3-.1 0 .9Z" fill="'+fill+'" stroke="'+line+'" stroke-width="'+(.09)+'" stroke-linejoin="round"/><path d="M0 .62C-.9-.05-.6-.62 0-.2C.6-.62.9-.05 0 .62Z" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".05" stroke-dasharray=".07 .12"/><circle cx="0" cy="-.05" r=".14" fill="#0F0F0F" opacity=".8"/></g>',cx,cy,a,b)}
  function spark(x,h,y,v,r,fill,a,b,al){var cx=X(x,h),cy=Y(y,v),R=r*u;
    pop('<path d="M'+cx+' '+(cy-R)+'Q'+cx+' '+cy+' '+(cx+R)+' '+cy+'Q'+cx+' '+cy+' '+cx+' '+(cy+R)+'Q'+cx+' '+cy+' '+(cx-R)+' '+cy+'Q'+cx+' '+cy+' '+cx+' '+(cy-R)+'Z" fill="'+fill+'" opacity="'+(al||1)+'"/>',cx,cy,a,b)}
  function dot(x,h,y,v,r,a,b){var cx=X(x,h),cy=Y(y,v);pop('<circle cx="'+cx+'" cy="'+cy+'" r="'+(r*u)+'" fill="'+PK+'" opacity=".85"/>',cx,cy,a,b)}
  function ball(x,h,y,v,r,a,b,tilt){var cx=X(x,h),cy=Y(y,v),R=r*u,id='bc'+(n++),g='';
    defs+='<clipPath id="'+id+'"><circle cx="'+cx+'" cy="'+cy+'" r="'+R+'"/></clipPath>';
    g+='<circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="'+PK+'"/><g clip-path="url(#'+id+')" transform="rotate('+tilt+' '+cx+' '+cy+')" fill="none" stroke-linecap="round">';
    for(var i=-5;i<=5;i++){var o=i*R*.26;g+='<path d="M'+(cx-R)+' '+(cy+o-R*.5)+'Q'+cx+' '+(cy+o+R*.45)+' '+(cx+R)+' '+(cy+o-R*.5)+'" stroke="'+(i%2?PKD:PKL)+'" stroke-width="'+(R*.1)+'" opacity="'+(i%2?.55:.45)+'"/>'}
    for(var j=-3;j<=3;j++){g+='<path d="M'+(cx+j*R*.3)+' '+(cy-R)+'Q'+(cx+j*R*.55)+' '+cy+' '+(cx+j*R*.3)+' '+(cy+R)+'" stroke="'+PKD+'" stroke-width="'+(R*.05)+'" opacity=".4"/>'}
    g+='</g><circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="none" stroke="'+PKD+'" stroke-width="'+(R*.05)+'"/>';
    pop(g,cx,cy,a,b)}
  // faint ghost flowers/hearts
  var G='#262628',GL='#2f2f31';
  flower(281,'L',18,'T',22,G,GL,.4,.6,.7);flower(30,'L',145,'T',22,G,GL,.42,.62,.7);flower(10,'L',258,'T',14,G,GL,.5,.7,.7);
  flower(21,'L',733,'T',22,G,GL,.55,.75,.7);flower(367,'L',624,'T',26,G,GL,.6,.8,.7);heart(86,'L',642,'T',14,G,GL,.62,.8,.7);
  // yarn balls + strands
  ball(14,'L',20,'T',54,.22,.32,-20);
  strand('M 44 50 C 72 54 80 64 66 82 C 52 100 10 108 -8 128','L','T',.3,.46,6);
  strand('M 400 -6 C 380 22 376 52 352 70 C 334 86 318 66 330 48 C 342 32 366 38 366 60 C 366 84 376 110 400 130','R','T',.38,.56,6);
  strand('M -8 344 C 30 350 46 372 32 402 C 24 420 8 430 -8 438','L','T',.46,.6,6);
  strand('M -8 541 C 22 560 26 590 14 620 C 6 640 -2 660 -8 676','L','T',.62,.76,6);
  strand('M 400 337 C 366 350 362 380 366 410 C 370 450 326 480 326 514 C 328 535 370 540 400 548','R','T',.5,.66,6);
  strand('M 352 730 C 336 760 304 784 270 780 C 246 776 236 764 228 770','R','T',.62,.74,6);
  ball(374,'R',724,'T',42,.5,.6,25);
  // crochet hearts and flowers
  heart(353,'R',408,'T',24,PK,PKD,.4,.5,1,0);heart(38,'L',429,'T',20,PK,PKD,.46,.56,1,-8);
  flower(364,'R',150,'T',18,PK,PKD,.36,.46);flower(347,'R',569,'T',22,PK,PKD,.56,.66);
  flower(26,'L',513,'T',14,CR,CRD,.52,.62);flower(370,'R',505,'T',12,CR,CRD,.6,.7);
  // dots + sparkles
  dot(309,'L',69,'T',4,.3,.4);dot(15,'L',191,'T',5,.33,.43);dot(76,'L',373,'T',4,.5,.6);dot(51,'L',482,'T',4,.55,.65);dot(40,'L',685,'T',4,.62,.72);dot(107,'L',760,'T',3.5,.66,.76);
  spark(94,'L',25,'T',11,PK,.34,.44);spark(344,'L',87,'T',9,'#555',.4,.5,.8);spark(374,'L',209,'T',12,PK,.45,.55);spark(313,'L',390,'T',9,'#555',.52,.62,.8);
  spark(99,'L',549,'T',11,PK,.58,.68);spark(308,'L',612,'T',9,'#555',.6,.7,.8);spark(333,'L',697,'T',10,PK,.68,.78);spark(82,'L',742,'T',12,PK,.7,.8);
  // scalloped crochet border at the bottom + bow
  var by=H-46*u,bm='mb'+(n++),sc='';
  for(var x=-6*u;x<W+24*u;x+=24*u){sc+='<circle cx="'+(x+12*u).toFixed(1)+'" cy="'+(by+4*u).toFixed(1)+'" r="'+(13*u).toFixed(1)+'" fill="'+PK+'" stroke="'+PKD+'" stroke-width="'+(1.4*u).toFixed(1)+'"/>'}
  var ribs='';for(var x2=0;x2<W;x2+=7*u){ribs+='M'+x2.toFixed(1)+' '+(by+16*u).toFixed(1)+'v'+(5*u).toFixed(1)+'M'+x2.toFixed(1)+' '+(by+25*u).toFixed(1)+'v'+(5*u).toFixed(1)+'M'+x2.toFixed(1)+' '+(by+34*u).toFixed(1)+'v'+(5*u).toFixed(1)}
  defs+='<mask id="'+bm+'" maskUnits="userSpaceOnUse" x="0" y="'+(by-20*u)+'" width="'+W+'" height="'+(H-by+40*u)+'"><rect id="'+bm+'r" x="'+(W/2)+'" y="'+(by-20*u)+'" width="0" height="'+(H-by+40*u)+'" fill="#fff"/></mask>';
  body+='<g id="dkB" mask="url(#'+bm+')" style="opacity:0"><rect x="0" y="'+(by+14*u)+'" width="'+W+'" height="'+(H-by)+'" fill="#18181a"/><path d="'+ribs+'" stroke="#2a2a2e" stroke-width="'+(1.6*u)+'" stroke-linecap="round" fill="none"/><rect x="0" y="'+(by+4*u)+'" width="'+W+'" height="'+(11*u)+'" fill="'+PK+'"/>'+sc+'<rect x="0" y="'+(by+4*u)+'" width="'+W+'" height="'+(11*u)+'" fill="'+PK+'"/><path d="M0 '+(by+9.5*u)+'H'+W+'" stroke="'+PKL+'" stroke-width="'+(2*u)+'" stroke-dasharray="'+(2*u)+' '+(6*u)+'" opacity=".55"/><path d="M0 '+(by+15*u)+'H'+W+'" stroke="'+PKD+'" stroke-width="'+(1.5*u)+'"/></g>';
  dkI.push({t:'b',a:.2,b:.34,id:'B',m:bm+'r',W:W});
  var bx=W/2,byy=by-4*u,k=u,bw=function(d){return rope(d,7*k)};
  var bow=bw('M '+bx+' '+byy+' C '+(bx-30*k)+' '+(byy-34*k)+' '+(bx-56*k)+' '+(byy-16*k)+' '+(bx-44*k)+' '+(byy+6*k)+' C '+(bx-34*k)+' '+(byy+20*k)+' '+(bx-12*k)+' '+(byy+8*k)+' '+bx+' '+byy)+
    bw('M '+bx+' '+byy+' C '+(bx+30*k)+' '+(byy-34*k)+' '+(bx+56*k)+' '+(byy-16*k)+' '+(bx+44*k)+' '+(byy+6*k)+' C '+(bx+34*k)+' '+(byy+20*k)+' '+(bx+12*k)+' '+(byy+8*k)+' '+bx+' '+byy)+
    bw('M '+bx+' '+byy+' C '+(bx-8*k)+' '+(byy+20*k)+' '+(bx-18*k)+' '+(byy+34*k)+' '+(bx-22*k)+' '+(byy+42*k))+bw('M '+bx+' '+byy+' C '+(bx+8*k)+' '+(byy+20*k)+' '+(bx+18*k)+' '+(byy+34*k)+' '+(bx+22*k)+' '+(byy+42*k))+
    '<circle cx="'+bx+'" cy="'+byy+'" r="'+(8*k)+'" fill="'+PK+'" stroke="'+PKD+'" stroke-width="'+(1.6*k)+'"/>';
  pop(bow,bx,byy,.32,.42);
  dkS.setAttribute('viewBox','0 0 '+W+' '+H);dkS.innerHTML='<defs>'+defs+'</defs>'+body;
  dkI.forEach(function(o){o.el=document.getElementById('dk'+o.id);if(o.t==='s')o.mp=document.getElementById('m'+o.id).firstChild;if(o.t==='b')o.mr=document.getElementById(o.m)});
  dkLast=-1;decoFrame()}
function decoFrame(){
  if(gcur===dkLast)return;dkLast=gcur;
  
  for(var i=0;i<dkI.length;i++){var o=dkI[i],t=sm((gcur-o.a)/(o.b-o.a));
    if(t<=0){if(o.on!==0){o.el.style.opacity=0;o.on=0}continue}o.on=1;o.el.style.opacity=1;
    if(o.t==='s')o.mp.setAttribute('stroke-dashoffset',(1-t).toFixed(3));
    else if(o.t==='b'){var w=o.W*t;o.mr.setAttribute('x',(o.W-w)/2);o.mr.setAttribute('width',w)}
    else{var s2=.55+.45*t;o.el.setAttribute('transform','translate('+o.cx+' '+o.cy+') scale('+s2.toFixed(3)+') translate('+(-o.cx)+' '+(-o.cy)+')');o.el.style.opacity=t}}}
var glG=[];
function buildShop(){
  var cb=document.getElementById('cats');
  cb.addEventListener('click',function(e){var b=e.target.closest('button');if(b)setCat(b.getAttribute('data-c'))});
  shGrid.addEventListener('click',function(e){if(e.target.closest('.ad'))return;var c=e.target.closest('.card');if(c)openPD(shCards.indexOf(c))});
  shGrid.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.classList&&e.target.classList.contains('card'))openPD(shCards.indexOf(e.target))});
  shGrid.addEventListener('error',function(e){var t=e.target;if(t&&t.tagName==='IMG'&&t.classList.contains('ph')){var m=t.parentNode;m.classList.add('noimg');var c=m.parentNode;if(c)c.classList.remove('gl','landed')}},true);
  botEl.firstChild.src=SRC;
  botEl.onclick=function(){toggleChat(!chatOpen)};
  document.getElementById('ch-x').onclick=function(){toggleChat(false)};
  document.getElementById('ch-s').onclick=send;
  document.getElementById('ch-in').onkeydown=function(e){if(e.key==='Enter')send()};
  initSearch();initCart();
  shopReady=true;if(pending){var l=pending;pending=null;setProducts(l)}}
function setProducts(list){
  PRODUCTS=list;PBY={};list.forEach(function(p){PBY[p.k]=p});
  if(curCat!=='all'&&!list.some(function(p){return p.c===curCat}))curCat='all';
  var openKey=pdOpen?pdKey:null;
  renderShop();
  if(openKey){var j=PRODUCTS.indexOf(PBY[openKey]);if(j>-1)openPD(j,true);else{closePD(true);toast('That item is no longer available')}}
  if(window.refreshBag)window.refreshBag()}
function buildCats(){
  var seen={},arr=[['all','All']];PRODUCTS.forEach(function(p){if(!seen[p.c]){seen[p.c]=1;arr.push([p.c,p.cl])}});CATS=arr;
  var s='';CATS.forEach(function(k){var n=k[0]==='all'?PRODUCTS.length:PRODUCTS.filter(function(p){return p.c===k[0]}).length;s+='<button type="button" data-c="'+esc(k[0])+'" class="'+(k[0]===curCat?'on':'')+'">'+esc(k[1])+' <i>'+n+'</i></button>'});
  document.getElementById('cats').innerHTML=s;document.getElementById('cats').style.display=CATS.length>2?'':'none'}
function renderShop(){
  var s='';
  PRODUCTS.forEach(function(p,i){
    var gl=i<CH.length?[i]:null,sl='';p.chs=gl;
    if(gl&&p.img)sl='<div class="sl"><img class="ci" alt="" src="'+CH[i].src+'"></div>';
    else p.chs=null;
    var tag=p.soldOut?'Sold out':p.b;
    s+='<article class="card'+(p.chs?' gl':'')+(p.soldOut?' so':'')+'" tabindex="0" data-k="'+esc(p.k)+'" aria-label="'+esc(p.n)+'"><div class="cm'+(p.img?'':' noimg')+'">'+
      (p.img?'<img class="ph" src="'+esc(p.img)+'" alt="'+esc(p.n)+'"'+(i<4?'':' loading="lazy"')+' decoding="async">':'')+
      (tag?'<span class="bg">'+esc(tag)+'</span>':'')+sl+'</div>'+
      '<div class="cbd"><h3>'+esc(p.n)+'</h3><p class="cd'+((p.low||p.soldOut)?' lo':'')+'">'+(p.soldOut?'Sold out':p.low?'Only '+p.low+' left':esc(CFG.cardLine||''))+'</p>'+
      (p.ship?'<p class="cs">'+TRUCK+esc(p.ship)+'</p>':'')+
      '<div class="cft"><div class="pr"><b>'+rs(p.p)+'</b>'+(p.o?'<s>'+rs(p.o)+'</s>':'')+'</div>'+
      (p.soldOut?'<button class="ad" type="button" disabled>Sold out</button>':'<button class="ad" type="button" data-k="'+esc(p.k)+'">+ Add to Bag</button>')+'</div></div></article>'});
  shGrid.innerHTML=s;shCards=[].slice.call(shGrid.children);
  shSlots=[];glG.forEach(function(g){clearTimeout(g.t)});glG=[];
  shCards.forEach(function(c,i){var p=PRODUCTS[i];if(!p.chs)return;
    [].slice.call(c.querySelectorAll('.sl')).forEach(function(e,n){shSlots[p.chs[n]]=e});
    var g={card:c,ks:p.chs,on:false,t:0};if(pv>.99){g.on=true;c.classList.add('landed')}glG.push(g)});
  buildCats();applyFilter();lastP=-1;lastOff=-1;layoutShop()}
var curQ='',sbOn=false,sTm=0;
function kwOf(p){return (p.n+' '+p.cl).toLowerCase()}
function match(p){if(curCat!=='all'&&p.c!==curCat)return false;if(!curQ)return true;var k=kwOf(p);return curQ.split(/\s+/).every(function(t){return k.indexOf(t)>-1})}
function applyFilter(){
  var vis=0;shCards.forEach(function(el,i){var m=match(PRODUCTS[i]);if(m)vis++;el.style.display=m?'':'none'});
  var nr=document.getElementById('nores');nr.hidden=vis>0;nr.textContent=PRODUCTS.length?'No cuties found. Try another word.':'New pieces are coming soon. Please check back shortly.';
  [].forEach.call(document.querySelectorAll('#cats button'),function(b){b.classList.toggle('on',b.getAttribute('data-c')===curCat)})}
function setCat(c){
  curCat=c;applyFilter();layoutShop();
  if(pv>.98)scrollTo(0,lockMin||CL+shA)}
function openSB(v){
  sbOn=v;document.getElementById('sbar').classList.toggle('on',v);
  if(v){closePD(true);setTimeout(function(){document.getElementById('sIn').focus()},120)}
  else{document.getElementById('sIn').blur()}}
function resetF(){curQ='';document.getElementById('sIn').value='';openSB(false);setCat('all')}
function initSearch(){
  var inp=document.getElementById('sIn');
  document.getElementById('sBtn').onclick=function(){openSB(!sbOn)};
  document.getElementById('sX').onclick=function(){if(inp.value){inp.value='';curQ='';setCat(curCat)}openSB(false)};
  inp.addEventListener('input',function(){clearTimeout(sTm);sTm=setTimeout(function(){curQ=inp.value.trim().toLowerCase();setCat(curCat)},110)});
  inp.addEventListener('keydown',function(e){if(e.key==='Enter')inp.blur();if(e.key==='Escape')openSB(false)})}
// 3D hero lives under the crochet canvas until the shop opens, then inside #bot so it glides with it
function m3Place(){if(m3&&!m3In){m3.style.left=shAR.x+'px';m3.style.top=shAR.y+'px';m3.style.width=shAR.w+'px';m3.style.height=shAR.h+'px'}}
function m3Dock(inBot){
  if(!m3||m3In===inBot)return;m3In=inBot;botEl.classList.add('h3');
  if(inBot){m3.classList.add('bt');m3.style.left=m3.style.top=m3.style.width=m3.style.height='';botEl.appendChild(m3)}
  else{m3.classList.remove('bt');document.body.insertBefore(m3,document.querySelector('.stage'));m3Place()}}
function gT(k,p){return clamp((p-.04-.07*k)/.34,0,1)}
function layoutShop(){
  var W=innerWidth,H=innerHeight;shFW=document.documentElement.clientWidth;shFH=H;
  fxc.width=Math.round(shFW*dpr);fxc.height=Math.round(H*dpr);
  var rc=cv.getBoundingClientRect();
  shAR={x:rc.left+(tx+M*sc)/dpr,y:rc.top+(ty+TOP*sc)/dpr,w:w*sc/dpr,h:h*sc/dpr,t:rc.top};
  shSafe={l:0,t:0,r:shFW,b:H};
  if(H3){H3.size(shAR.w,shAR.h,dpr);m3Place()}
  shIn.style.transform='none';shCards.forEach(function(c){c.style.transform='none'});
  for(var k=0;k<CH.length;k++){var sl=shSlots[k];if(!sl)continue;var r=sl.getBoundingClientRect();slR[k]={l:r.left,t:r.top,w:r.width,h:r.height};
    var c=CH[k],bw2=c.bodyR-c.bodyL,bh2=c.h-c.bodyTop,s1=Math.min(.62*r.width/bw2,.55*r.height/bh2),sy1=Math.max(0,c.h-.88*r.height/s1),ci=sl.firstChild;
    ci.style.width=c.w*s1+'px';ci.style.height=c.h*s1+'px';ci.style.left=(r.width/2-c.bcx*s1-c.px*s1)+'px';ci.style.top=(-sy1*s1)+'px'}
  var bh=clamp(H*.13,84,118),bw=bh*w/h;
  shBot={w:bw,h:bh,x:shFW-12-bw/2,y:H-24-bh/2};
  botEl.style.width=shAR.w+'px';botEl.style.height=shAR.h+'px';
  chatEl.style.bottom=(24+bh+10)+'px';tipEl.style.bottom=(24+bh+4)+'px';
  shCs=Math.max(0,shIn.offsetHeight-H);shA=Math.round(H*.5);if(lockMin)lockMin=CL+shA;lastP=-1;lastOff=-1;
  document.body.style.height=(CL+shA+shCs+H)+'px'}
function shopFrame(dt,ts){
  if(H3){m3Dock(shopMode);H3.frame(ts,m3e)}
  var p=pv,off=pv>.999?clamp(sCur-shA,0,shCs):0,t=ts/1000;
  cv.style.opacity=shopMode?1-sm(p/.3):1;
  if(pv<.9&&(curCat!=='all'||curQ||sbOn))resetF();
  if(!shopMode){m3e=0;if(H3)H3.spin(0);if(botEl.style.display==='block'){botEl.style.display='none';shEl.style.visibility='hidden';tipEl.style.opacity=0;hdr.classList.remove('on');creamEl.style.opacity=0;fxg.setTransform(1,0,0,1,0,0);fxg.clearRect(0,0,fxc.width,fxc.height);lastP=-1;if(chatOpen)toggleChat(false)}return}
  botEl.style.display='block';shEl.style.visibility='visible';
  if(off!==lastOff){lastOff=off;shIn.style.transform='translate3d(0,'+(-off)+'px,0)'}
  tipEl.style.opacity=(p>.98&&!chatOpen)?1:0;
  if(p===lastP)return;lastP=p;
  creamEl.style.opacity=sm(p/.35);hdr.classList.toggle('on',p>.3);shEl.style.pointerEvents=p>.6?'auto':'none';
  for(var i=0;i<shCards.length;i++){var q=sm((p-.03-.04*Math.min(i,9))/.2);shCards[i].style.opacity=q;shCards[i].style.transform=q<1?'translateY('+(14*(1-q))+'px) scale('+(.95+.05*q)+')':'none'}
  var e=smr(p/.85);
  botEl.style.transform='translate('+(lerp(shAR.x+shAR.w/2,shBot.x,e)+Math.sin(Math.PI*e)*-shFW*.12-shAR.w/2)+'px,'+(lerp(shAR.y+shAR.h/2,shBot.y,e)-shAR.h/2)+'px) rotate('+(Math.sin(e*Math.PI*2)*.14)+'rad) scale('+lerp(1,shBot.h/shAR.h,e)+')';
  m3e=e;if(H3)H3.spin(e*Math.PI*2); // one full 360 turn over the glide
  botEl.classList.toggle('on',p>.97);
  fxg.setTransform(dpr,0,0,dpr,0,0);fxg.clearRect(0,0,shFW,shFH);fxg.imageSmoothingEnabled=true;fxg.imageSmoothingQuality='high';
  for(var k=0;k<CH.length;k++){
    var c=CH[k],a=cs[k],L=LAY[k],im=cim[k],R=slR[k],sl=shSlots[k];if(!im.complete||!R||!sl||R.w<2)continue;
    var ee=gT(k,p);sl.firstChild.style.visibility=ee>=1?'visible':'hidden';if(ee>=1)continue;
    var e2=sm(ee),r={left:R.l,top:R.t,width:R.w,height:R.h,right:R.l+R.w,bottom:R.t+R.h},
        s0=L.s/dpr,px0=(shAR.x-(tx+M*sc)/dpr)+L.x/dpr,py0=shAR.t+(L.pv-a.o)/dpr,cd0=L.cord/dpr,
        bw2=c.bodyR-c.bodyL,bh2=c.h-c.bodyTop,s1=Math.min(.62*r.width/bw2,.55*r.height/bh2),
        sy1=Math.max(0,c.h-.88*r.height/s1),px1=r.left+r.width/2-c.bcx*s1,py1=r.top,
        X=lerp(px0,px1,e2)+Math.sin(Math.PI*e2)*(k%2?-1:1)*(40+14*k),Y=lerp(py0,py1,e2)-Math.sin(Math.PI*e2)*30,
        s=lerp(s0,s1,e2),sy=sy1*sm((ee-.25)/.6),cd=cd0*(1-sm(ee/.45)),
        th=a.th*(1-sm(ee*1.6))+(.06*Math.sin(t*1.7+k*1.3)+.2*Math.sin(ee*9+k)*(1-ee))*sm(ee*3),
        f=sm(clamp((ee-.55)/.45,0,1)),
        x0=lerp(0,Math.max(r.left,shSafe.l),f),x1=lerp(shFW,Math.min(r.right,shSafe.r),f),
        y0=lerp(lerp(shAR.t,0,sm(Math.min(1,ee*6))),Math.max(r.top,shSafe.t),f),y1=lerp(shFH,Math.min(r.bottom,shSafe.b),f);
    if(x1<=x0||y1<=y0)continue;
    fxg.save();fxg.beginPath();fxg.rect(x0,y0,x1-x0,y1-y0);fxg.clip();fxg.translate(X,Y);fxg.rotate(th);
    var gl=1-sm(ee*1.8);
    if(L.cord>0&&gl>.01){fxg.globalAlpha=gl;fxg.strokeStyle='#8a8a92';fxg.lineWidth=Math.max(1.2,2.4*s0);fxg.lineCap='round';fxg.beginPath();fxg.moveTo(0,-40);fxg.lineTo(0,cd+1);fxg.stroke();fxg.globalAlpha=1}
    var kk=im.naturalWidth/c.w||1;fxg.drawImage(im,0,sy*kk,c.w*kk,(c.h-sy)*kk,-c.px*s,cd,c.w*s,(c.h-sy)*s);fxg.restore()}
  glG.forEach(function(g){var all=g.ks.every(function(k){return gT(k,p)>=1});
    if(all&&!g.on){g.on=true;clearTimeout(g.t);g.t=setTimeout(function(){g.card.classList.add('landed')},650)}
    else if(!all&&g.on){g.on=false;clearTimeout(g.t);g.card.classList.remove('landed')}})}
function toast(m){var tg=document.getElementById('tg');tg.textContent=m;tg.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(function(){tg.classList.remove('on')},2400)}
function initCart(){
  var $=function(i){return document.getElementById(i)},bag=[],cc=$('cc'),bk=$('bk'),opener=null,ready=false;
  try{bag=JSON.parse(localStorage.getItem('sy_bag3')||'[]')}catch(e){bag=[]}
  if(!Array.isArray(bag))bag=[];
  var tot=function(){return bag.reduce(function(a,b){var p=PBY[b.k];return a+(p?p.p*b.q:0)},0)};
  function clean(){var n=bag.length;
    bag=bag.filter(function(b){var p=PBY[b.k];return p&&!p.soldOut&&b.q>0});
    bag.forEach(function(b){var s=PBY[b.k].stock;if(s!==null&&b.q>s)b.q=s});
    return n!==bag.length}
  function thumb(p){return '<span class="th">'+(p.img?'<img alt="" src="'+esc(p.img)+'">':'')+'</span>'}
  function draw(){
    var n=0,h='',t=tot();
    bag.forEach(function(b){var p=PBY[b.k];if(!p)return;n+=b.q;var max=p.stock!==null&&b.q>=p.stock;
      h+='<div class="it">'+thumb(p)+'<div class="ii"><h4>'+esc(p.n)+'</h4><small>'+rs(p.p)+'</small><div class="qc"><button type="button" data-q="-1" data-k="'+esc(b.k)+'" aria-label="Decrease quantity">\u2212</button><span>'+b.q+'</span><button type="button" data-q="1" data-k="'+esc(b.k)+'" aria-label="Increase quantity"'+(max?' disabled':'')+'>+</button><button type="button" class="rm" data-q="0" data-k="'+esc(b.k)+'">Remove</button></div></div><div class="it2">'+rs(p.p*b.q)+'</div></div>'});
    $('items').innerHTML=h||'<div class="e0"><p>Your bag is currently empty.</p></div>';
    $('cf').style.display=bag.length?'flex':'none';$('tot').textContent=rs(t);
    $('ship').textContent=!FREE?'':t>=FREE?'You get free shipping':'Add '+rs(FREE-t)+' more for free shipping';
    cc.textContent=n;cc.classList.add('pop');setTimeout(function(){cc.classList.remove('pop')},180);
    try{localStorage.setItem('sy_bag3',JSON.stringify(bag))}catch(e){}}
  window.refreshBag=function(){var changed=clean();draw();if(changed&&ready)toast('Your bag was updated')};
  function show(id,v){var el=$(id);if(v&&!el.classList.contains('on'))opener=document.activeElement;el.classList.toggle('on',v);el.setAttribute('aria-hidden',v?'false':'true');
    var any=document.querySelector('.dr.on');bk.classList.toggle('on',!!any);
    if(v){var f=el.querySelector('[data-close],.x,input');if(f)setTimeout(function(){try{f.focus({preventScroll:true})}catch(e){}},80)}
    else if(!any&&opener){try{opener.focus({preventScroll:true})}catch(e){}opener=null}}
  function closeAll(){['menu','cart','coDr','ctDr'].forEach(function(i){show(i,false)})}
  shGrid.addEventListener('click',function(e){var b=e.target.closest('.ad');if(!b||b.disabled)return;var k=b.getAttribute('data-k'),p=PBY[k];if(!p)return;
    var f=bag.filter(function(x){return x.k===k})[0];
    if(f){if(p.stock!==null&&f.q>=p.stock){toast('Only '+p.stock+' available');return}f.q++}else bag.push({k:k,q:1});
    draw();b.textContent='Added to bag';b.classList.add('on');setTimeout(function(){b.textContent='+ Add to Bag';b.classList.remove('on')},1200);toast('Added to your bag')});
  $('items').addEventListener('click',function(e){var b=e.target.closest('[data-q]');if(!b)return;var k=b.getAttribute('data-k'),q=+b.getAttribute('data-q'),f=bag.filter(function(x){return x.k===k})[0];if(!f)return;
    f.q=q===0?0:f.q+q;bag=bag.filter(function(x){return x.q>0});draw()});
  $('cartBtn').onclick=function(){show('menu',false);show('cart',true)};
  $('mb').onclick=function(){show('cart',false);show('menu',true)};
  bk.onclick=closeAll;
  addEventListener('keydown',function(e){if(e.key==='Escape')closeAll()});
  [].forEach.call(document.querySelectorAll('[data-close]'),function(b){b.onclick=closeAll});
  [].forEach.call(document.querySelectorAll('[data-go]'),function(a){a.onclick=function(e){if(e&&e.preventDefault)e.preventDefault();closeAll();var g=a.getAttribute('data-go');if(g==='anya'){if(pv<.98)skipToShop(0);setTimeout(function(){toggleChat(true)},pv<.98?500:0)}else{if(pv<.98)skipToShop(0);else scrollTo(0,lockMin||CL+shA)}}});
  $('wa').onclick=function(){if(!bag.length)return;var l=["Hi "+NM+"! I'd like to order:",''];
    bag.forEach(function(b,k){var p=PBY[b.k];if(p)l.push((k+1)+'. '+p.n+' x '+b.q+' - '+rs(p.p*b.q))});l.push('','Total: '+rs(tot()));
    window.open('https://wa.me/'+(CFG.whatsapp||'')+'?text='+encodeURIComponent(l.join('\n')),'_blank','noopener')};
  window.SiteUI={show:show,toast:toast,closeAll:closeAll,
    getBag:function(){return bag.map(function(b){var p=PBY[b.k];return p?{k:b.k,n:p.n,p:p.p,q:b.q}:null}).filter(Boolean)},
    clearBag:function(){bag=[];draw()}};
  ready=true;draw()}
// ---- chat ----
function say(t,who){var m=document.getElementById('ch-m'),d=document.createElement('div');d.className='m '+who;d.textContent=t;
  m.appendChild(d);m.scrollTop=m.scrollHeight}
function toggleChat(v){chatOpen=v;chatEl.style.display=v?'flex':'none';
  if(v&&!chatEl.getAttribute('data-i')){chatEl.setAttribute('data-i',1);say(BOT.greeting,'a');
    var c=document.getElementById('ch-c');BOT.chips.forEach(function(x){var b=document.createElement('button');b.type='button';b.textContent=x;b.onclick=function(){ask(x)};c.appendChild(b)})}
  if(v)setTimeout(function(){var i=document.getElementById('ch-in');if(i&&!matchMedia('(hover:none)').matches)i.focus()},60)}
function reply(q){
  var s=q.toLowerCase(),tk=s.split(/\W+/),pr=PRODUCTS.filter(function(p){return tk.indexOf(p.n.split(' ')[0].toLowerCase())>-1})[0];
  if(pr)return{a:pr.n+' is '+rs(pr.p)+(pr.o?' (was '+rs(pr.o)+')':'')+(pr.soldOut?' but it is sold out right now.':pr.low?' and only '+pr.low+' left!':'.')};
  for(var i=0;i<BOT.faq.length;i++)if(BOT.faq[i].k.some(function(k){return s.indexOf(k)>-1}))return{a:BOT.faq[i].a};
  if(/cheap|price|cost|budget/.test(s)&&PRODUCTS.length){var c=PRODUCTS.filter(function(p){return !p.soldOut}).sort(function(a,b){return a.p-b.p}).slice(0,3);return{a:'Our cheapest: '+c.map(function(p){return p.n+' '+rs(p.p)}).join(', ')+'.'}}
  for(var j=1;j<CATS.length;j++){var lab=CATS[j][1].toLowerCase(),root=lab.replace(/s$/,'');if(s.indexOf(lab)>-1||s.indexOf(root)>-1)return{a:'Here are our '+CATS[j][1].toLowerCase()+'. I have filtered the shop for you.',cat:CATS[j][0]}}
  if(/charm|show|product|have/.test(s)&&PRODUCTS.length)return{a:'We have '+PRODUCTS.length+' cuties, from '+rs(Math.min.apply(null,PRODUCTS.map(function(p){return p.p})))+'. Scroll to see them all.'};
  return{a:BOT.fallback}}
function ask(q){say(q,'u');setTimeout(function(){var r=reply(q);say(r.a,'a');if(r.cat&&pv>.9){setCat(r.cat);toggleChat(false)}},500)}
function send(){var i=document.getElementById('ch-in'),q=i.value.trim();if(!q)return;i.value='';ask(q)}

function loop(ts){
  var dt=Math.min(.05,(ts-last)/1000||0);last=ts;
  if(auto){tgt=Math.min(1,tgt+(tgt<I?dt*I/1.3:dt*(1-I)/AUTO_SECS));gcur=tgt;if(tgt>=1){setAuto(false);setTimeout(function(){if(!lockMin||scrollY<CL+shA-2)scrollTo({top:CL+shA,behavior:'smooth'})},900)}}
  else{
    if(sCur>.5)gcur=1; // crochet stays finished while the shop is open
    else{gcur+=(tgt-gcur)*.1;if(Math.abs(tgt-gcur)<.00002)gcur=tgt}
    if(gcur>=.9995||sCur>0){sCur+=(sTgt-sCur)*(1-Math.exp(-dt*(sCur>shA?18:7)));if(Math.abs(sTgt-sCur)<.3)sCur=sTgt}
    if(!lockMin&&shA>0&&pv>=.999)lockMin=CL+shA}
  cur=clamp((gcur-I)/(1-I),0,1);decoFrame();hintFrame();
  var pt=shA>0?clamp(sCur/shA,0,1):0,vt=clamp((pt-pv)*3,-1/DUR,1/DUR);pvel+=(vt-pvel)*(1-Math.exp(-dt*5));pv+=pvel*dt;
  if((pvel>=0&&pv>=pt&&pt>=pv-1e-9&&pv>pt)||(pvel<0&&pv<pt)||(Math.abs(pt-pv)<.0008&&Math.abs(pvel)<.05)){pv=pt;pvel=0}pv=clamp(pv,0,1);
  shopMode=sCur>.0005||pv>.0005;
  if(H3)H3.vis(shopMode||cur>=.9995);
  if(shopMode&&pv>.35){if(!hid){hid=1;ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,cv.width,cv.height)}shopFrame(dt,ts);requestAnimationFrame(loop);return}hid=0;var live=cur>0,done=cur>=.9995||shopMode,i=0,p=0,trav=1,P=null,working=!done&&cur>.0015;
  if(!done){
    var u=cur*Ttot,lo=0,hi2=list.length-1;
    while(lo<hi2){var mid=(lo+hi2+1)>>1;if(cum[mid]<=u)lo=mid;else hi2=mid-1}
    i=lo;var tt=u-cum[i],tr=lens[i]-1;
    if(tt<tr){trav=tt/tr;p=0}else p=clamp(tt-tr,0,1);
    P=pose(i,p,trav,ts);ds+=(list[i].dir-ds)*.12}
  // camera: zoom in on the hook while working, pull back at the start and end
  S=sc;
  ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,cv.width,cv.height);drawLogo(done,i,p,live);ctx.setTransform(S,0,0,S,tx,ty);
  ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
  var hx=0,hy=0,ux=0,uy=-1;
  if(live){
  if(done){if(!shopMode){if(H3){if(done3===null)done3=ts;var f3=1-clamp((ts-done3)/500,0,1);if(f3>0){ctx.globalAlpha=f3;ctx.drawImage(img,M,TOP);ctx.globalAlpha=1}}else ctx.drawImage(img,M,TOP)}}
  else{done3=null;
    var L=list[i],r=L.r,yb=h-r*rh;
    if(r>0)ctx.drawImage(img,0,yb,w,h-yb,M,TOP+yb,w,h-yb);
    for(var j=rowS[r];j<i;j++){
      var q=list[j],age=(i-j)+p-.9,sa=clamp((age-1)/3.5,0,1);
      if(sa>0)slice(r,q.c-.03,q.c+1.03,sa);
      if(sa<1)stitch(M+q.c*sw,TOP+h-(r+1)*rh,q.col,1,1,1-sa,1)}
    stitch(M+L.c*sw,TOP+h-(r+1)*rh,L.col,sm((p-.45)/.3),sm((p-.62)/.3),1,clamp((p-.4)/.3,0,1));
    col=col.map(function(v,k){return v+(L.col[k]*.8+45-v)*.12});
    hx=P.x;hy=P.y;
    var a0=-ds*Math.sin(P.th),b0=-Math.cos(P.th),ln=Math.hypot(a0,b0);ux=a0/ln;uy=b0/ln}
  // yarn ball fixed to the screen corner, thread leads to the hook
  ball=ball.map(function(v,k){return v+(col[k]-v)*.12});
  var radS=(36-24*cur)*sc,bsx=radS*1.35+cv.width*.02,bsy=cv.height-radS*1.4-cv.height*.02;
  var rad=radS/S,bx=(bsx-tx)/S,by=(bsy-ty)/S,kk=rad/30;
  if(!done){
    var Ex=hx+ux*P.endT,Ey=hy+uy*P.endT,sway=Math.sin(ts/450)*3;
    var p0x=bx+rad*.5,p0y=by-rad*.6;
    rope(function(){ctx.beginPath();ctx.moveTo(p0x,p0y);ctx.bezierCurveTo(bx+rad*1.2,by-Math.max(40/S*sc,(by-Ey)*.4),Ex+ux*50+sway,Ey+uy*50,Ex,Ey)},4,ball,1);
    var ang=Math.atan2(uy,ux);
    // trailing strands from loops to the fabric
    P.rings.forEach(function(g){
      if(g.ax===null||g.a<=.01)return;
      var rx=hx+ux*g.t,ry=hy+uy*g.t,mx=(rx+g.ax)/2,my=(ry+g.ay)/2+2+Math.hypot(rx-g.ax,ry-g.ay)*.12;
      rope(function(){ctx.beginPath();ctx.moveTo(rx,ry);ctx.quadraticCurveTo(mx,my,g.ax,g.ay)},3.2*g.s*.6+1.3,col,g.a)});
    ctx.save();ctx.translate(hx,hy);ctx.rotate(ang);
    P.rings.forEach(function(g){if(g.a>.01)rope(function(){ctx.beginPath();ctx.ellipse(g.t,0,1.7*g.s,3.5*g.s,0,Math.PI/2,Math.PI*1.5)},2.9*Math.max(.5,g.s),col,g.a)});
    drawHook();
    P.rings.forEach(function(g){if(g.a>.01)rope(function(){ctx.beginPath();ctx.ellipse(g.t,0,1.7*g.s,3.5*g.s,0,-Math.PI/2,Math.PI/2)},2.9*Math.max(.5,g.s),col,g.a)});
    ctx.restore()}
  // ball
  ctx.save();ctx.beginPath();ctx.arc(bx,by,rad,0,7);ctx.clip();ctx.fillStyle=sh(ball,.9);ctx.fillRect(bx-rad,by-rad,rad*2,rad*2);
  ctx.strokeStyle=sh(ball,.5);ctx.lineWidth=1.6*kk;ctx.globalAlpha=.55;
  for(var n=0;n<9;n++){ctx.beginPath();ctx.ellipse(bx,by,rad*1.05,rad*(.25+.09*n),n*.55+cur*40,0,7);ctx.stroke()}
  ctx.globalAlpha=.4;ctx.strokeStyle=hi(ball,.4);for(var n=0;n<6;n++){ctx.beginPath();ctx.ellipse(bx-1,by-1,rad*1.0,rad*(.3+.12*n),n*.9+1+cur*40,0,7);ctx.stroke()}
  ctx.globalAlpha=1;var gr=ctx.createRadialGradient(bx-rad*.4,by-rad*.45,rad*.1,bx,by,rad);gr.addColorStop(0,'rgba(255,255,255,.3)');gr.addColorStop(.6,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,.4)');
  ctx.fillStyle=gr;ctx.fillRect(bx-rad,by-rad,rad*2,rad*2);ctx.restore();
  }
  bgc.style.opacity=sm((gcur-.12)/.1);
  charms(dt,ts);shopFrame(dt,ts);
  requestAnimationFrame(loop)}
})();
