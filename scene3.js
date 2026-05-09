window.Scene3 = {
    start: function() {
        gs.scene = 3; sv();
        goScreen('ssms');
        M().innerHTML = ''; clrCh();
        addNarr("Le silence dans la chambre 12 est absolu. 02:13.");
        setTimeout(() => {
            addIn("Le lit est confortable, " + gs.char + " ?");
            addCho("A) Qu'est-ce que tu me veux ?", () => this.repA());
            addCho("B) J'appelle les flics.", () => this.repB());
        }, 2000);
    },
    repA: function() {
        clrCh(); addOut("Qu'est-ce que tu me veux ?");
        addIn("Regarde par la fenêtre. Vers le cimetière.");
        this.finalChoix();
    },
    repB: function() {
        clrCh(); addOut("J'appelle les flics.");
        addIn("Regarde ton réseau. Aucun service.");
        this.finalChoix();
    },
    finalChoix: function() {
        setTimeout(() => {
            clrCh();
            addCho("A) Aller au cimetière", () => this.fin1());
            addCho("B) Fuir en voiture", () => this.fin2());
        }, 2000);
    },
    fin1: function() {
        goScreen('sso', true, () => {
            $('sso-content').innerHTML = "<h2>FIN : LE CIMETIÈRE</h2><p>Le mystère s'épaissit...</p>";
        });
    },
    fin2: function() {
        AudioCore.playCrash();
        goScreen('sdeath', true, () => {
            $('death-text').textContent = "La voiture s'encastre violemment dans un arbre. Le choc est fatal.";
        });
    }
};