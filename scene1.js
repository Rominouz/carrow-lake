window.Scene1 = {
    start: function() {
        gs.scene = 1; sv();
        goScreen('ssms');
        M().innerHTML = ''; clrCh();
        setTimeout(() => {
            addIn("Bonjour... " + gs.char);
            addCho("A) Salut ?", () => this.rep1());
        }, 1000);
    },
    rep1: function() {
        clrCh(); addOut("Salut ?");
        setTimeout(() => {
            addIn("Tu n'as pas ta place ici.");
            addCho("A) Qui es-tu ?", () => this.rep2());
        }, 1500);
    },
    rep2: function() {
        clrCh(); addOut("Qui es-tu ?");
        setTimeout(() => {
            addIn("⚠ Utilisateur bloqué");
            setTimeout(() => {
                const s2 = window.Scene2;
                if(s2) s2.start();
            }, 2000);
        }, 1000);
    }
};