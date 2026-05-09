const $ = id => document.getElementById(id);
let gs = { char: null, scene: 1, narrIdx: 0 };
const SCREENS = ['sh','schar','ssms','sn','sso', 'sdeath'];

const AudioCore = {
    ctx: null, mute: false, windNode: null, tickInterval: null,
    init() { if(!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); if(this.ctx.state === 'suspended') this.ctx.resume(); },
    toggle() { this.mute = !this.mute; $('a-icon').className = this.mute ? 'ti ti-volume-off' : 'ti ti-volume'; if(this.ctx) { this.mute ? this.ctx.suspend() : this.ctx.resume(); } },
    playClick() {
        if(this.mute) return; this.init();
        const o = this.ctx.createOscillator(), g = this.ctx.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(600, this.ctx.currentTime);
        g.gain.setValueAtTime(0.1, this.ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
        o.connect(g); g.connect(this.ctx.destination); o.start(); o.stop(this.ctx.currentTime + 0.05);
    },
    playSms() {
        if(this.mute) return; this.init();
        const o = this.ctx.createOscillator(), g = this.ctx.createGain();
        o.frequency.setValueAtTime(800, this.ctx.currentTime); o.frequency.setValueAtTime(1200, this.ctx.currentTime + 0.1);
        g.gain.setValueAtTime(0, this.ctx.currentTime); g.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + 0.02); g.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);
        o.connect(g); g.connect(this.ctx.destination); o.start(); o.stop(this.ctx.currentTime + 0.4);
    },
    playWind() {
        if(this.mute || this.windNode) return; this.init();
        const bufferSize = this.ctx.sampleRate * 2, buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate), data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        this.windNode = this.ctx.createBufferSource(); this.windNode.buffer = buffer; this.windNode.loop = true;
        const filter = this.ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 400;
        const gain = this.ctx.createGain(); gain.gain.value = 0.03;
        this.windNode.connect(filter); filter.connect(gain); gain.connect(this.ctx.destination);
        this.windNode.start();
        $('fog').style.opacity = '0.2';
    },
    playTick() {
        if(this.mute) return; this.init();
        this.tickInterval = setInterval(() => {
            const o = this.ctx.createOscillator(), g = this.ctx.createGain();
            o.type = 'square'; o.frequency.setValueAtTime(1000, this.ctx.currentTime);
            g.gain.setValueAtTime(0.05, this.ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
            o.connect(g); g.connect(this.ctx.destination); o.start(); o.stop(this.ctx.currentTime + 0.05);
        }, 1000);
    },
    stopTick() { clearInterval(this.tickInterval); },
    playCrash() {
        if(this.mute) return; this.init();
        const bufferSize = this.ctx.sampleRate * 2.5, buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate), data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.3));
        const noise = this.ctx.createBufferSource(); noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.setValueAtTime(800, this.ctx.currentTime); filter.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 2);
        const gain = this.ctx.createGain(); gain.gain.setValueAtTime(0.8, this.ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 2.5);
        noise.connect(filter); filter.connect(gain); gain.connect(this.ctx.destination); noise.start();
    }
};

function sv() { try { localStorage.setItem('cl_save', JSON.stringify(gs)); } catch(e){} updateHi(); }
function ld() { try { const r = localStorage.getItem('cl_save'); if(r) gs = JSON.parse(r); } catch(e){} updateHi(); }
function updateHi() { const e = $('svhi'); if(e) e.textContent = gs.char ? 'Reprendre · ' + gs.char : 'Nouvelle partie'; }

function goScreen(id, fade = false, cb = null) {
    AudioCore.playClick();
    if(fade) {
        const b = $('blackout');
        b.style.opacity = '1';
        setTimeout(() => {
            SCREENS.forEach(s => $(s).classList.remove('active'));
            $(id).classList.add('active');
            if(cb) cb();
            setTimeout(() => { b.style.opacity = '0'; }, 100);
        }, 800);
    } else {
        SCREENS.forEach(s => $(s).classList.remove('active'));
        $(id).classList.add('active');
        if(cb) cb();
    }
}

function startPlay() {
    AudioCore.init();
    if(gs.char) {
        if(gs.scene === 1) { goScreen('ssms'); startSMS(true); }
        else if(gs.scene === 2) { goScreen('sn'); startNarr(gs.narrIdx); }
        else if(gs.scene === 3) { goScreen('ssms'); startScene3(); }
        else { goScreen('sso'); }
    } else { goScreen('schar'); }
}

function resetGame() { localStorage.removeItem('cl_save'); gs = { char: null, scene: 1, narrIdx: 0 }; updateHi(); goScreen('schar'); }
function pickChar(name) { gs.char = name; gs.scene = 1; gs.narrIdx = 0; sv(); goScreen('ssms'); startSMS(false); }

const M = () => $('smsg'), SC = () => { const m = M(); m.scrollTop = m.scrollHeight; };
function addIn(t) { AudioCore.playSms(); const d = document.createElement('div'); d.className = 'bi bin'; d.innerHTML = t.replace(/\n/g, '<br>'); M().appendChild(d); SC(); }
function addBlk() { AudioCore.playSms(); const d = document.createElement('div'); d.className = 'bbl'; d.innerHTML = '⚠ Cet utilisateur vous a bloqué(e)'; M().appendChild(d); SC(); }
function addVu() { const d = document.createElement('div'); d.className = 'bvu'; d.textContent = 'Vu'; M().appendChild(d); SC(); }
function addNarr(t) { AudioCore.playSms(); const d = document.createElement('div'); d.className = 'narr-inline'; d.innerHTML = t.replace(/\n/g, '<br>'); M().appendChild(d); SC(); }

function addOut(t) {
    AudioCore.playClick();
    const d = document.createElement('div');
    d.className = 'bi bot'; d.textContent = t;
    M().appendChild(d); SC();
}

function addStatusLabel(stId, thenVu, vuDelay) {
    const d = document.createElement('div'); d.id = stId; d.className = 'bst'; d.style.animation = 'bstIn .4s forwards';
    d.innerHTML = '<i class="ti ti-check" style="font-size:10px;margin-right:3px"></i>Remis';
    M().appendChild(d); SC();
    if (thenVu) {
        setTimeout(() => {
            const el = $(stId); if (!el) return; el.style.opacity = '0';
            setTimeout(() => {
                if (!el) return;
                el.innerHTML = '<i class="ti ti-checks" style="font-size:10px;margin-right:3px"></i>Vu';
                el.style.color = '#8070c8'; el.style.opacity = '1'; SC();
            }, 420);
        }, vuDelay || 1500);
    }
}

function mkT(id) { const d = document.createElement('div'); d.id = id; d.className = 'bi bin'; d.innerHTML = '...'; M().appendChild(d); SC(); }
function rmT(id) { const t = $(id); if(t) t.remove(); }
function clrCh() { $('sch').innerHTML = ''; }
function addCho(txt, fn) { const b = document.createElement('button'); b.className = 'cho'; b.textContent = txt; b.onclick = () => { AudioCore.playClick(); fn(); }; $('sch').appendChild(b); }

let nIdx=0, nBg=-1, nActive=false, nArr=null, nCb=null;

function startNarr(idx, customArr, onComplete){
    AudioCore.playWind();
    nIdx=idx; nActive=true; nBg=-1;
    nArr = customArr || SEGS;
    nCb = onComplete || null;
    $('snbg').innerHTML=BGS[nArr[nIdx].bg] || BGS[0]; $('snbg').style.opacity='1'; $('snbg2').style.opacity='0';
    nBg=nArr[nIdx].bg;
    updateTx();
}

function narrClick(){
    if(!nActive) return;
    AudioCore.playClick();
    nIdx++;
    if(nIdx >= nArr.length){
        nActive=false;
        if(nCb) { 
            nCb(); 
        } else {
            // Fin de la scène 2 classique -> passage Scène 3
            gs.scene=3; gs.narrIdx=0; sv();
            goScreen('ssms', true, startScene3);
        }
        return;
    }
    if(nArr === SEGS) { gs.narrIdx=nIdx; sv(); }
    const newBg = nArr[nIdx].bg;
    if(newBg !== nBg) { $('snbg').innerHTML = BGS[newBg] || BGS[0]; nBg = newBg; }
    updateTx();
}

function updateTx(){
    const seg = nArr[nIdx], tx = $('sntx');
    let t = seg.t; 
    if(gs.char && gs.char !== 'Elyos') t = t.replace(/Elyos/g, gs.char);
    tx.className = seg.c || '';
    if(t.includes('\n')){ tx.innerHTML = t.split('\n').map(l => l === '' ? '<span style="height:10px;display:block"></span>' : `<span>${l}</span>`).join(''); } 
    else { tx.textContent = t; }
    $('snpg-bar').style.width = Math.round(((nIdx + 1) / nArr.length) * 100) + '%';
}

document.addEventListener('DOMContentLoaded', ld);
