let gs={char:null,scene:1,narrIdx:0};
const $=id=>document.getElementById(id);
async function sv(){
  const data=JSON.stringify(gs);
  try{localStorage.setItem('cl5',data)}catch(e){}
  try{if(window.storage)await window.storage.set('cl5',data)}catch(e){}
}
async function ld(){
  try{const saved=localStorage.getItem('cl5');if(saved)gs=JSON.parse(saved)}catch(e){}
  try{if(window.storage){const r=await window.storage.get('cl5');if(r)gs=JSON.parse(r.value)}}catch(e){}
  hi();
  if(location.hash==='#scene3'){gs={char:'Elyos',scene:3,narrIdx:0};sv();hi();startScene(3,0)}
}
async function cl(){
  try{localStorage.removeItem('cl5')}catch(e){}
  try{if(window.storage)await window.storage.delete('cl5')}catch(e){}
  gs={char:null,scene:1,narrIdx:0}
}
function hi(){const e=$('svhi');if(e)e.textContent=gs.char?'Reprendre · '+gs.char:'Nouvelle partie'}

const SCREENS=['sh','schar','ssms','sn','s3','sso'];
function show(id,d){SCREENS.forEach(s=>{const el=$(s);if(el)el.style.display='none'});$(id).style.display=d||'block'}
function goHome(){s2StopAmbience();s3StopAll();show('sh','block');hi()}
async function handlePlay(){
  if(gs.char){
    if(gs.scene===1){show('ssms','flex');startSMS(true)}
    else if(hasScene(gs.scene)){startScene(gs.scene,gs.narrIdx)}
    else{show('sso','flex')}
  }else show('schar','flex')
}
async function handleRestart(){s2StopAmbience();s3StopAll();await cl();hi();show('schar','flex')}
function selectChar(name){gs.char=name;gs.scene=1;gs.narrIdx=0;sv();hi();show('ssms','flex');startSMS(false)}

// SMS
const M=()=>$('smsg'),SC=()=>{const m=M();m.scrollTop=m.scrollHeight};
function addIn(t){try{s3Notify()}catch(e){}const d=document.createElement('div');d.className='bi bin';d.textContent=t;M().appendChild(d);SC()}
function addOut(t){const d=document.createElement('div');d.className='bi bot';d.textContent=t;M().appendChild(d);SC()}
function addStatus(t,side){const d=document.createElement('div');d.className='bvu '+(side==='in'?'in':'out');d.textContent=t;M().appendChild(d);SC()}
function addVu(side){addStatus('Vu',side||'in')}
function addRemis(side){addStatus('REMIS',side||'out')}
function addSys(t){const d=document.createElement('div');d.className='bsy';d.textContent=t;M().appendChild(d);SC()}
function addBlk(){const d=document.createElement('div');d.className='bbl';d.innerHTML='<i class="ti ti-ban" style="font-size:13px" aria-hidden="true"></i> Cet utilisateur vous a bloqué(e)';M().appendChild(d);SC()}
function mkT(id){const d=document.createElement('div');d.id=id;d.style.cssText='display:flex;gap:4px;padding:10px 14px;align-items:center;background:#1d1d30;border-radius:16px;border-bottom-left-radius:4px;align-self:flex-start';d.innerHTML='<span style="width:6px;height:6px;border-radius:50%;background:#3c3c80;animation:dot 1s infinite;display:block"></span><span style="width:6px;height:6px;border-radius:50%;background:#3c3c80;animation:dot 1s .2s infinite;display:block"></span><span style="width:6px;height:6px;border-radius:50%;background:#3c3c80;animation:dot 1s .4s infinite;display:block"></span>';M().appendChild(d);SC()}
function rmT(id){const t=$(id);if(t)t.remove()}
function clrCh(){$('sch').innerHTML=''}
function addCho(txt,fn){const b=document.createElement('button');b.className='cho';b.textContent=txt;b.onclick=fn;$('sch').appendChild(b)}

function startSMS(resume){
  if(resume&&M().children.length)return;
  M().innerHTML='';clrCh();
  const p=$('s1presence');if(p){p.textContent='En ligne';p.classList.add('online')}
  setTimeout(()=>mkT('t1'),700);
  setTimeout(()=>{rmT('t1');addIn('Bonjour… '+gs.char);setTimeout(()=>{clrCh();addCho('A)  Salut ?',()=>sr1('A'));addCho('B)  [Vu]',()=>sr1('B'))},900)},2400);
}
function sr1(opt){
  clrCh();
  if(opt==='A')addOut('Salut ?');
  else addVu('out');
  setTimeout(()=>mkT('t2'),1150);
  setTimeout(()=>{rmT('t2');addIn('Ne reste pas ici, tu n\'as pas ta place…');setTimeout(()=>{clrCh();addCho('A)  Qui es-tu ?',sr2)},900)},2850);
}
function sr2(){
  clrCh();addOut('Qui es-tu ?');
  setTimeout(()=>addRemis('out'),350);
  setTimeout(()=>{addBlk();setTimeout(()=>{const p=$('s1presence');if(p){p.textContent='Utilisateur bloqué';p.classList.remove('online')}addSys('Vous ne pouvez plus envoyer de messages à ce contact.');setTimeout(()=>{clrCh();addCho('→  Continuer',()=>{gs.scene=2;gs.narrIdx=0;sv();show('sn','block');startNarr(0)})},1100)},850)},1150);
}

// NARRATIVE


let nIdx=0,nBg=-1,nActive=false;
function hasNarrScene(sceneNumber){return !!(window.CL_SCENES&&window.CL_SCENES[sceneNumber])}
function hasHybridScene(sceneNumber){return !!(window.CL_HYBRID_SCENES&&window.CL_HYBRID_SCENES[sceneNumber])}
function hasScene(sceneNumber){return hasNarrScene(sceneNumber)||hasHybridScene(sceneNumber)}
function startScene(sceneNumber,idx){
  if(hasHybridScene(sceneNumber)){s2StopAmbience();show('s3','block');startHybridScene(sceneNumber,idx||0);return}
  show('sn','block');startNarr(idx||0)
}
function activeScene(){return window.CL_SCENES&&window.CL_SCENES[gs.scene]?window.CL_SCENES[gs.scene]:window.CL_SCENES[2]}
function sceneSegments(){return activeScene().segments}
function sceneBackgrounds(){return activeScene().backgrounds}
function startNarr(idx){const scene=activeScene(),segs=sceneSegments(),bgs=sceneBackgrounds();if(gs.scene===2)s2StartAmbience();else s2StopAmbience();nIdx=Math.min(idx||0,segs.length-1);nActive=true;nBg=-1;$('snlb').textContent=scene.title||'SCENE';$('snbg').innerHTML=bgs[segs[nIdx].bg];$('snbg').style.opacity='1';$('snbg2').style.opacity='0';nBg=segs[nIdx].bg;setNarrSeg(false);renderPg()}
function setNarrSeg(fade){
  const tx=$('sntx'),seg=sceneSegments()[nIdx];
  const newBg=seg.bg;
  if(newBg!==nBg){swapBg(newBg);nBg=newBg}
  if(fade){tx.classList.add('hid');setTimeout(()=>{fillTx(seg,tx);tx.classList.remove('hid')},750)}
  else{tx.classList.remove('hid');fillTx(seg,tx)}
  renderPg()
}
function fillTx(seg,tx){
  let t=seg.t;
  if(gs.char&&gs.char!=='Elyos')t=t.replace(/Elyos/g,gs.char);
  const cls=(seg.c||'').split(' ').map(s=>s.trim()).filter(s=>s&&s.length>0);
  tx.className=cls.join(' ');
  tx.style.fontFamily="'Palatino Linotype',Palatino,'Book Antiqua',serif";
  if(t.includes('\n')){
    tx.innerHTML=t.split('\n').map(l=>l===''?'<span style="height:6px;display:block"></span>':`<span>${l}</span>`).join('');
  }else tx.textContent=t;
}
function swapBg(bgIdx){
  const b1=$('snbg'),b2=$('snbg2');
  b2.innerHTML=sceneBackgrounds()[bgIdx];
  b2.style.transition='none';b2.style.opacity='0';
  requestAnimationFrame(()=>requestAnimationFrame(()=>{b2.style.transition='opacity 1.4s ease';b2.style.opacity='1';b1.style.transition='opacity 1.4s ease';b1.style.opacity='0'}));
  setTimeout(()=>{b1.innerHTML=sceneBackgrounds()[bgIdx];b1.style.transition='none';b1.style.opacity='1';b2.style.opacity='0';b2.innerHTML=''},1500)
}
function renderPg(){
  const pg=$('snpg'),total=sceneSegments().length,pct=Math.round(((nIdx+1)/total)*100);
  pg.innerHTML=`<div class="narr-progress"><div style="width:${pct}%"></div></div>`;
}
function narrNext(){
  if(!nActive)return;
  nIdx++;
  if(nIdx>=sceneSegments().length){
    const nextScene=gs.scene+1;
    s2StopAmbience();
    if(hasScene(nextScene)){nActive=false;gs.scene=nextScene;gs.narrIdx=0;sv();startScene(nextScene,0);return}
    nActive=false;gs.scene=nextScene;gs.narrIdx=sceneSegments().length;sv();show('sso','flex');return
  }
  gs.narrIdx=nIdx;sv();setNarrSeg(true)
}

// SCENE 2 AMBIENCE
let s2Audio={started:false,gain:null,osc:null,timers:[]};
function s2Timer(fn,ms){const id=setTimeout(fn,ms);s2Audio.timers.push({id,type:'timeout'});return id}
function s2Interval(fn,ms){const id=setInterval(fn,ms);s2Audio.timers.push({id,type:'interval'});return id}
function s2StartAmbience(){
  if(s2Audio.started)return;
  const ctx=s3Ctx();if(!ctx)return;
  s2Audio.started=true;
  s2Audio.gain=ctx.createGain();s2Audio.gain.gain.value=0;
  const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=360;
  s2Audio.osc=ctx.createOscillator();s2Audio.osc.type='sine';s2Audio.osc.frequency.value=86;
  s2Audio.osc.connect(filter);filter.connect(s2Audio.gain);s2Audio.gain.connect(s3Audio.master);
  s2Audio.osc.start();
  s2Audio.gain.gain.setTargetAtTime(.025,ctx.currentTime,2.5);
  s2Interval(()=>{s3Tone(3200+Math.random()*700,.045,'sine',.008)},2400);
  s2Interval(()=>{s3Noise(.45,.018,520)},5200);
}
function s2StopAmbience(){
  if(!s2Audio.started)return;
  const ctx=s3Audio.ctx;
  s2Audio.timers.forEach(t=>t.type==='interval'?clearInterval(t.id):clearTimeout(t.id));
  if(s2Audio.gain&&ctx)s2Audio.gain.gain.setTargetAtTime(0,ctx.currentTime,.45);
  if(s2Audio.osc&&ctx){try{s2Audio.osc.stop(ctx.currentTime+.7)}catch(e){}}
  s2Audio={started:false,gain:null,osc:null,timers:[]};
}

// SCENE 3 HYBRID
let s3State={timers:[],narr:[],narrIdx:0,narrDone:null,waitingChoice:false,scene:null,endKey:null};
let s3Audio={ctx:null,master:null,ambientGain:null,ambientOscs:[],tickLive:false,started:false};

function s3Data(){return window.CL_HYBRID_SCENES&&window.CL_HYBRID_SCENES[3]}
function s3Txt(t){return gs.char&&gs.char!=='Elyos'?String(t).replace(/Elyos/g,gs.char):String(t)}
function s3Timer(fn,ms){const id=setTimeout(fn,ms);s3State.timers.push({id,type:'timeout'});return id}
function s3Interval(fn,ms){const id=setInterval(fn,ms);s3State.timers.push({id,type:'interval'});return id}
function s3StopTimers(){if(!s3State||!s3State.timers)return;s3State.timers.forEach(t=>t.type==='interval'?clearInterval(t.id):clearTimeout(t.id));s3State.timers=[]}
function s3StopAll(){s3StopTimers();s3StopAudio()}
function s3Mode(id){['s3chat','s3narr','s3black'].forEach(x=>{const el=$(x);if(el)el.classList.toggle('is-active',x===id)})}
function s3ClearChoices(){$('s3choices').innerHTML='';$('s3narrChoices').innerHTML=''}
function startHybridScene(sceneNumber){
  const data=s3Data();
  if(!data){show('sso','flex');return}
  s3StopAll();
  s3State={timers:[],narr:[],narrIdx:0,narrDone:null,waitingChoice:false,scene:sceneNumber,endKey:null};
  gs.scene=sceneNumber;gs.narrIdx=0;sv();
  s3StartAudio();s3SetTension(.035);
  s3RunNarrative(data.intro,()=>s3StartChat(),data.title);
}

function s3StartChat(){
  const data=s3Data();
  s3Mode('s3chat');s3ClearChoices();
  $('s3msgs').innerHTML='';
  $('s3network').textContent='Wi-Fi Hôtel';
  $('s3presence').textContent='Utilisateur bloqué';
  $('s3presence').classList.remove('online');
  s3AddOut('Qui es-tu ?');
  s3Timer(()=>{s3SetPresence('En ligne');s3Reply(data.sms.r1,()=>s3Choices([
    {text:data.choices.r1.a,fn:()=>s3ChooseR1('A')},
    {text:data.choices.r1.b,fn:()=>s3ChooseR1('B')}
  ]),{replyDelay:1450,typingDelay:650,seenDelay:360})},1800);
}

function s3SetPresence(text){const p=$('s3presence');p.style.opacity='0';s3Timer(()=>{p.textContent=text;p.classList.toggle('online',text==='En ligne');p.style.opacity='1'},300)}
function s3NetworkLost(){const n=$('s3network');n.textContent='Aucun service';s3AddSystem('Aucun service')}
function s3Scroll(){const m=$('s3msgs');m.scrollTop=m.scrollHeight}
function s3AddBubble(text,kind){
  const d=document.createElement('div');
  d.className='s3-bubble '+(kind==='out'?'s3-out':'s3-in');
  d.textContent=s3Txt(text);
  $('s3msgs').appendChild(d);s3Scroll();
}
function s3AddIn(text){s3Notify();s3AddBubble(text,'in')}
function s3AddOut(text){s3AddBubble(text,'out');setTimeout(s3AddDelivered,1000)}
function s3AddSystem(text){const d=document.createElement('div');d.className='s3-system';d.textContent=text;$('s3msgs').appendChild(d);s3Scroll()}
function s3AddDelivered(){const d=document.createElement('div');d.className='s3-seen out';d.textContent='Vu';$('s3msgs').appendChild(d);s3Scroll()}
function s3Typing(){
  const old=$('s3typing');if(old)old.remove();
  const d=document.createElement('div');d.id='s3typing';d.className='s3-typing';d.innerHTML='<span></span><span></span><span></span>';$('s3msgs').appendChild(d);s3Scroll()
}
function s3StopTyping(){const t=$('s3typing');if(t)t.remove()}
function s3Reply(text,done,opt){
  const o=Object.assign({typingDelay:1450,replyDelay:2300},opt||{});
  s3Timer(()=>s3Typing(),o.typingDelay);
  s3Timer(()=>{s3StopTyping();s3AddIn(text);if(done)done()},o.replyDelay);
}
function s3Choices(items){
  const box=$('s3choices');box.innerHTML='';
  items.forEach((item,i)=>{const b=document.createElement('button');b.className='s3-choice';b.textContent=(i===0?'A  ':'B  ')+s3Txt(item.text);b.onclick=item.fn;box.appendChild(b)});
}
function s3Continue(text,fn){
  const box=$('s3choices');box.innerHTML='';
  const b=document.createElement('button');
  b.className='s3-choice s3-continue';
  b.textContent=text||'Continuer';
  b.onclick=()=>{box.innerHTML='';fn()};
  box.appendChild(b);
  s3Timer(()=>s3Scroll(),60);
}

function s3ChooseR1(branch){
  const data=s3Data();s3ClearChoices();
  if(branch==='A'){
    s3SetTension(.075);s3AddOut(data.choices.r1.a);
    s3Reply(data.sms.r2A,()=>s3Choices([
      {text:data.choices.r2a.a,fn:()=>s3ChooseR2A(data.choices.r2a.a)},
      {text:data.choices.r2a.b,fn:()=>s3ChooseR2A(data.choices.r2a.b)}
    ]),{seenDelay:420,typingDelay:780,replyDelay:1320});
    return;
  }
  s3SetTension(.085);s3AddOut(data.choices.r1.b);
  s3Reply(data.sms.r2B,()=>{s3NetworkLost();s3Choices([
    {text:data.choices.r2b.a,fn:()=>s3ChooseR2B('A')},
    {text:data.choices.r2b.b,fn:()=>s3ChooseR2B('B')}
  ])},{seenDelay:950,typingDelay:1850,replyDelay:2900});
}
function s3ChooseR2A(text){
  const data=s3Data();
  s3ClearChoices();s3SetTension(.12);s3AddOut(text);
  s3Reply(data.sms.r3A,()=>s3Continue('Regarder par la fenêtre',s3WindowSequence),{seenDelay:420,typingDelay:760,replyDelay:1250});
}
function s3ChooseR2B(branch){
  const data=s3Data();s3ClearChoices();s3SetTension(.15);
  if(branch==='A'){
    s3AddOut(data.choices.r2b.a);
    s3Reply(data.sms.r4A,()=>s3Continue('Écouter la salle de bain',s3BathroomSequence),{seenDelay:900,typingDelay:1600,replyDelay:2600});
    return;
  }
  s3AddSystem('Elyos retient sa respiration dans le noir');
  s3PlayDripCrawl();
  s3Reply(data.sms.r3A,()=>s3Continue('Regarder par la fenêtre',s3WindowSequence),{typingDelay:2200,replyDelay:3300,seenDelay:360});
}
function s3WindowSequence(){
  const data=s3Data();s3SetTension(.17);
  s3RunNarrative(data.narratives.window,()=>{s3Mode('s3chat');s3Reply(data.sms.cemeteryThreat,()=>s3Continue('Faire un choix',s3ShowFinalChoice),{typingDelay:600,replyDelay:1300,seenDelay:360})},data.title);
}
function s3BathroomSequence(){
  const data=s3Data();s3SetTension(.2);s3PlayDripCrawl();
  s3RunNarrative(data.narratives.bathroom,()=>{s3Mode('s3chat');s3Reply(data.sms.bathroomThreat,()=>s3Continue('Faire un choix',s3ShowFinalChoice),{typingDelay:500,replyDelay:1200,seenDelay:360})},data.title);
}

function s3RunNarrative(lines,done,label){
  s3Mode('s3narr');s3ClearChoices();
  $('s3narrHint').style.display='block';
  const l=$('s3narr').querySelector('.s3-narr-label');if(l)l.textContent=label||'SCÈNE 3';
  s3State.narr=lines||[];s3State.narrIdx=0;s3State.narrDone=done;s3State.waitingChoice=false;
  s3RenderNarr(true);s3RenderPg();
}
function s3RenderNarr(first){
  const text=s3Txt(s3State.narr[s3State.narrIdx]||'');
  const el=$('s3narrText');
  const paint=()=>{el.innerHTML=text.split('\n').map(line=>line?`<span>${line}</span>`:'<span style="height:8px;display:block"></span>').join('');el.classList.remove('hid');if(/parquet|pas|s'approche|marches|sentier/i.test(text))s3PlayCreak()};
  if(first){el.classList.add('hid');s3Timer(paint,80);return}
  el.classList.add('hid');s3Timer(paint,720);
  s3RenderPg();
}
function s3RenderPg(){
  const pg=$('s3narrPg');if(!pg)return;
  const total=Math.max(1,s3State.narr.length),pct=Math.round(((s3State.narrIdx+1)/total)*100);
  pg.innerHTML=`<div class="narr-progress"><div style="width:${pct}%"></div></div>`;
}
function s3NarrNext(){
  if($('s3').style.display==='none'||s3State.waitingChoice)return;
  s3State.narrIdx++;
  if(s3State.narrIdx>=s3State.narr.length){const done=s3State.narrDone;s3State.narrDone=null;if(done)done();return}
  s3RenderNarr(false);
}
function s3ShowFinalChoice(){
  const data=s3Data();
  s3Mode('s3narr');s3State.waitingChoice=true;s3ClearChoices();
  $('s3narrHint').style.display='none';
  $('s3narrPg').innerHTML='';
  $('s3narrText').innerHTML=s3Txt(data.finalPrompt).split('\n').map(line=>line?`<span>${line}</span>`:'<span style="height:8px;display:block"></span>').join('');
  const box=$('s3narrChoices');
  data.finalChoices.forEach((c,i)=>{const b=document.createElement('button');b.className='s3-final-choice';b.textContent=(i===0?'A  ':'B  ')+s3Txt(c.text);b.onclick=()=>s3ChooseFinal(c.end);box.appendChild(b)});
}
function s3ChooseFinal(endKey){
  const data=s3Data();s3State.waitingChoice=false;s3ClearChoices();s3SetTension(.24);
  s3State.endKey=endKey;
  s3Impact(endKey);s3Mode('s3black');$('s3coming').textContent='';
  const root=$('clg');root.classList.remove('s3-shock');void root.offsetWidth;root.classList.add('s3-shock');
  s3Timer(()=>s3RunNarrative(data.finals[endKey],()=>s3EndEpisode(),data.finalLabels[endKey]),1100);
}
function s3EndEpisode(){
  const data=s3Data();s3StopAll();gs.scene=4;gs.narrIdx=0;sv();
  if(s3State.endKey==='cemetery'){show('sso','flex');return}
  s3Mode('s3black');
  $('s3coming').innerHTML=`<div class="s3-end-kicker">FIN DE L'ÉPISODE</div><div class="s3-end-quote">${data.comingSoon||'“Carrow Lake garde désormais un secret de plus.”'}</div><button class="s3-home-btn" onclick="goHome()">REVENIR À L'ÉCRAN D'ACCUEIL</button>`;
}

function s3Ctx(){
  try{
    const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;
    if(!s3Audio.ctx){s3Audio.ctx=new AC();s3Audio.master=s3Audio.ctx.createGain();s3Audio.master.gain.value=.55;s3Audio.master.connect(s3Audio.ctx.destination)}
    if(s3Audio.ctx.state==='suspended')s3Audio.ctx.resume();
    return s3Audio.ctx;
  }catch(e){return null}
}
function s3StartAudio(){s3StartAmbient();s3StartTick()}
function s3StartAmbient(){
  const ctx=s3Ctx();if(!ctx||s3Audio.started)return;
  s3Audio.started=true;s3Audio.ambientGain=ctx.createGain();s3Audio.ambientGain.gain.value=0;
  const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=130;
  s3Audio.ambientGain.connect(filter);filter.connect(s3Audio.master);
  [38,52,67].forEach((f,i)=>{const o=ctx.createOscillator();o.type=i===0?'sine':'triangle';o.frequency.value=f;const g=ctx.createGain();g.gain.value=i===0?.8:.28;o.connect(g);g.connect(s3Audio.ambientGain);o.start();s3Audio.ambientOscs.push(o)});
}
function s3SetTension(v){const ctx=s3Ctx();if(ctx&&s3Audio.ambientGain)s3Audio.ambientGain.gain.setTargetAtTime(v,ctx.currentTime,1.8)}
function s3StartTick(){if(s3Audio.tickLive)return;s3Audio.tickLive=true;s3Interval(()=>s3Tone(1850,.018,'square',.018),1000)}
function s3StopAudio(){
  const ctx=s3Audio.ctx;
  if(s3Audio.ambientGain&&ctx)s3Audio.ambientGain.gain.setTargetAtTime(0,ctx.currentTime,.35);
  s3Audio.ambientOscs.forEach(o=>{try{o.stop(ctx?ctx.currentTime+.5:0)}catch(e){}});
  s3Audio={ctx:ctx,master:s3Audio.master,ambientGain:null,ambientOscs:[],tickLive:false,started:false}
}
function s3Tone(freq,dur,type,gain){
  const ctx=s3Ctx();if(!ctx)return;
  const o=ctx.createOscillator(),g=ctx.createGain();o.type=type||'sine';o.frequency.value=freq;g.gain.value=0;
  o.connect(g);g.connect(s3Audio.master);const now=ctx.currentTime;
  g.gain.setValueAtTime(0,now);g.gain.linearRampToValueAtTime(gain||.035,now+.01);g.gain.exponentialRampToValueAtTime(.0001,now+dur);
  o.start(now);o.stop(now+dur+.03);
}
function s3Noise(dur,gain,filterFreq){
  const ctx=s3Ctx();if(!ctx)return;
  const len=Math.max(1,Math.floor(ctx.sampleRate*dur)),buf=ctx.createBuffer(1,len,ctx.sampleRate),data=buf.getChannelData(0);
  for(let i=0;i<len;i++)data[i]=(Math.random()*2-1)*(1-i/len);
  const src=ctx.createBufferSource(),g=ctx.createGain(),f=ctx.createBiquadFilter();src.buffer=buf;f.type='lowpass';f.frequency.value=filterFreq||700;g.gain.value=gain||.04;
  src.connect(f);f.connect(g);g.connect(s3Audio.master);src.start();
}
function s3Notify(){if(navigator.vibrate)navigator.vibrate(45);s3Tone(1180,.055,'triangle',.045)}
function s3PlayCreak(){s3Noise(.55,.034,420);s3Timer(()=>s3Tone(92,.38,'sawtooth',.018),120)}
function s3PlayDripCrawl(){s3Noise(.08,.025,900);s3Timer(()=>s3Noise(.09,.028,760),850);s3Timer(()=>s3Noise(.75,.055,260),1850)}
function s3Impact(kind){s3Noise(kind==='flight'?.9:.55,kind==='flight'?.14:.1,kind==='flight'?180:260);s3Tone(kind==='flight'?48:72,.45,'sine',.09)}

ld();
