window.Scene2 = {
    segs: [
        {t: "Elyos arrive à Carrow Lake. L'air est froid.", bg:0},
        {t: "L'Hôtel des Pins semble abandonné, pourtant sa clé l'attend.", bg:1},
        {t: "Au restaurant, une silhouette l'observe au loin.", bg:4}
    ],
    start: function() {
        gs.scene = 2; sv();
        startNarrMode(this.segs, () => {
            const s3 = window.Scene3;
            if(s3) s3.start();
        });
    }
};