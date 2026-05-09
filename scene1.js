function startSMS(resume) {
    if(resume) return;
    M().innerHTML = ''; clrCh();
    setTimeout(() => mkT('t1'), 500);
    setTimeout(() => { rmT('t1'); addIn('Bonjour… ' + gs.char); setTimeout(() => { clrCh(); addCho('A) Salut ?', () => sr1('A')); addCho('B) [Vu]', () => sr1('B')); }, 800); }, 2000);
}

function sr1(opt) {
    clrCh();
    if (opt === 'A') {
        addOut('Salut ?');
        addStatusLabel('st1', true, 1400);
        setTimeout(() => mkT('t2'), 3200);
        setTimeout(() => { rmT('t2'); addIn('Ne reste pas ici, tu n\'as pas ta place…'); setTimeout(() => { clrCh(); addCho('A) Qui es-tu ?', sr2); }, 800); }, 5000);
    } else {
        addVu();
        setTimeout(() => mkT('t2'), 600);
        setTimeout(() => { rmT('t2'); addIn('Ne reste pas ici, tu n\'as pas ta place…'); setTimeout(() => { clrCh(); addCho('A) Qui es-tu ?', sr2); }, 800); }, 2400);
    }
}

function sr2() {
    clrCh(); addOut('Qui es-tu ?');
    addStatusLabel('st2', false);
    setTimeout(() => { addBlk(); setTimeout(() => { clrCh(); addCho('→ Continuer', () => { gs.scene = 2; gs.narrIdx = 0; sv(); goScreen('sn', true, () => startNarr(0)); }); }, 1000); }, 1800);
}