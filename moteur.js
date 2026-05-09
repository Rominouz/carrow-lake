const $ = id => document.getElementById(id);
let gs = { char: null, scene: 1, narrIdx: 0 };
const SCREENS = ['sh','schar','ssms','sn','sso','sdeath'];

const AudioCore = {
    ctx: null, mute: false,
    init() { 
        if(this.ctx) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    },
    toggle() { this.mute = !this.mute; $('a-icon').className = this.mute ? 'ti ti-volume-off' : 'ti ti-volume'; },
    playSms() { if(this.mute) return; this.init(); /* Simulation simple bip */ },
    playClick() { if(this.mute) return; this.init(); },
    playCrash() { if(this.mute) return; this.init(); }
};

function sv() { localStorage.setItem('cl_save_v2', JSON.stringify(gs)); updateHi(); }
function ld() { const r = localStorage.getItem('cl_save_v2'); if(r) gs = JSON.parse(r); updateHi(); }
function updateHi() { if($('svhi')) $('svhi').textContent = gs.char ? 'Reprendre : ' + gs.char : 'Nouvelle partie'; }

function goScreen(id, fade = false, cb = null) {
    if(fade) {
        $('blackout').style.opacity = '1';
        setTimeout(() => {
            SCREENS.forEach(s => $(s).classList.remove('active'));
            if($(id)) $(id).classList.add('active');
            if(cb) cb();
            setTimeout(() => $('blackout').style.opacity = '0', 100);
        }, 800);
    } else {
        SCREENS.forEach(s => $(s).classList.remove('active'));
        if($(id)) $(id).classList.add('active');
        if(cb) cb();
    }
}

function startPlay() {
    ld();
    if(!gs.char) return goScreen('schar');
    const sceneObj = window["Scene" + gs.scene];
    if(sceneObj) sceneObj.start();
    else resetGame();
}

function resetGame() { 
    localStorage.removeItem('cl_save_v2'); 
    gs = { char: null, scene: 1, narrIdx: 0 }; 
    location.reload(); 
}

function pickChar(name) { 
    gs.char = name; sv(); 
    const s1 = window.Scene1;
    if(s1) s1.start(); 
}

// Helpers UI
const M = () => $('smsg');
const clrCh = () => $('sch').innerHTML = '';
const SC = () => { M().scrollTop = M().scrollHeight; };

function addIn(t) { AudioCore.playSms(); const d = document.createElement('div'); d.className='bi bin'; d.innerHTML=t; M().appendChild(d); SC(); }
function addOut(t) { AudioCore.playClick(); const d = document.createElement('div'); d.className='bi bot'; d.innerHTML=t; M().appendChild(d); SC(); }
function addNarr(t) { const d = document.createElement('div'); d.className='narr-inline'; d.innerHTML=t; M().appendChild(d); SC(); }
function addCho(txt, fn) { const b = document.createElement('button'); b.className='cho'; b.textContent=txt; b.onclick=fn; $('sch').appendChild(b); }
function mkT(id) { const d = document.createElement('div'); d.id=id; d.className='bi bin'; d.textContent='...'; M().appendChild(d); SC(); }
function rmT(id) { if($(id)) $(id).remove(); }

// Logique Narrative
let nArr=[], nIdx=0, nCb=null;
function startNarrMode(arr, cb) {
    nArr = arr; nIdx = 0; nCb = cb;
    goScreen('sn', true, updateNarrUI);
}
function narrClick() {
    nIdx++;
    if(nIdx >= nArr.length) return nCb ? nCb() : resetGame();
    updateNarrUI();
}
function updateNarrUI() {
    const s = nArr[nIdx];
    $('sntx').innerHTML = s.t.replace(/Elyos/g, gs.char);
    $('snbg').innerHTML = BGS[s.bg] || BGS[0];
    $('snpg-bar').style.width = ((nIdx+1)/nArr.length)*100 + '%';
}

document.addEventListener('DOMContentLoaded', ld);
