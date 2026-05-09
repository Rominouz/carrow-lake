// scene1.js - Gère l'intro et les SMS
const Scene1 = {
    id: 1,
    type: "sms",
    start: function(isResume) {
        if(isResume) return;
        M().innerHTML=''; clrCh();
        setTimeout(()=>mkT('t1'),700);
        setTimeout(()=>{
            rmT('t1');
            addIn('Bonjour… ' + gs.char);
            setTimeout(()=>{
                clrCh();
                addCho('A)  Salut ?', ()=>Scene1.sr1('A'));
                addCho('B)  [Vu]', ()=>Scene1.sr1('B'));
            },900);
        },2400);
    },
    sr1: function(opt) {
        clrCh();
        if(opt==='A') addOut('Salut ?'); else addVu();
        setTimeout(()=>mkT('t2'),500);
        setTimeout(()=>{
            rmT('t2');
            addIn('Ne reste pas ici, tu n\'as pas ta place…');
            setTimeout(()=>{
                clrCh();
                addCho('A)  Qui es-tu ?', Scene1.sr2);
            },900);
        },2200);
    },
    sr2: function() {
        clrCh(); addOut('Qui es-tu ?');
        setTimeout(()=>{
            addBlk();
            setTimeout(()=>{
                addSys('Vous ne pouvez plus envoyer de messages à ce contact.');
                setTimeout(()=>{
                    clrCh();
                    addCho('→  Continuer', ()=>{
                        gs.scene = 2; // On passe à la scène 2
                        gs.narrIdx = 0;
                        sv();
                        loadScene(2); // Le moteur charge automatiquement la suite !
                    });
                },1100);
            },850);
        },700);
    }
};