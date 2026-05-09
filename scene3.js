const FIN1_SEGS = [
    {t:"L'adrénaline remplace la peur. Elyos refuse d'être une proie. Il enfile ses vêtements sombres à la hâte, sans allumer la lumière, et quitte la chambre 12 en silence.", bg:1, c:''},
    {t:"L'air extérieur est mordant. Le brouillard s'est épaissi, avalant les contours de l'Hôtel des pins.", bg:6, c:''},
    {t:"En allumant sa lampe torche, le faisceau peine à percer la brume. Il s'engage sur le sentier escarpé qui mène à la colline.", bg:6, c:''},
    {t:"Plus il monte, plus l'odeur de terre retournée devient suffocante. À travers les grilles en fer forgé du cimetière, il aperçoit une vieille lanterne à huile sur le sol.", bg:5, c:''},
    {t:"Juste devant un caveau dont la lourde porte en pierre a été poussée de l'intérieur.", bg:5, c:'ni'},
    {t:"Il s'approche lentement. Sa respiration fait de la fumée dans l'air froid. Il braque sa lampe vers l'intérieur, s'attendant à voir le malade du restaurant...", bg:5, c:''},
    {t:"Mais il n'y a personne.", bg:5, c:'ns'},
    {t:"Il n'y a qu'un vieux téléphone posé sur un cercueil brisé, l'écran allumé sur leur conversation.", bg:5, c:'nl'},
    {t:"Soudain, derrière lui, les lourdes grilles du cimetière claquent violemment dans la nuit.", bg:5, c:'nb'},
    {t:"Il regarde derrière lui en sursaut. Avant de se retourner et de voir que le téléphone a disparu.", bg:5, c:''},
    {t:"En allumant son propre téléphone, il se rend compte que les messages n'avaient jamais existé.", bg:5, c:'ni ns'}
];

const FIN2_SEGS = [
    {t:"La panique totale prend le dessus. Le grattement contre la porte de la salle de bain devient plus insistant, suivi du bruit sourd d'une main mouillée tapant contre le bois.", bg:1, c:'ni'},
    {t:"Il attrape son sac à dos, y jette ses clés de voiture, et se rue dans le couloir sans un regard en arrière.", bg:1, c:''},
    {t:"La réception est vide, plongée dans les ténèbres. Carrow Lake ressemble à une ville morte.", bg:1, c:''},
    {t:"Une fois dans sa voiture, il s'enferme à l'intérieur, les mains tremblantes. Le moteur démarre dans un rugissement. Il accélère à fond, fendant le brouillard.", bg:6, c:''},
    {t:"Le panneau \"Vous quittez Carrow Lake\" apparaît enfin dans ses phares. Un soulagement immense envahit sa poitrine. Il a réussi.", bg:6, c:'ns'},
    {t:"Mais alors que son rythme cardiaque commence à redescendre, son téléphone posé sur le siège passager s'allume.", bg:6, c:''},
    {t:"« Fuir la ville ne sert à rien, Elyos. Tu as emmené Carrow Lake avec toi. »", bg:6, c:'ni'},
    {t:"Une goutte d'eau glacée tombe soudainement sur sa nuque.", bg:6, c:''},
    {t:"Il lève lentement les yeux vers son rétroviseur intérieur.", bg:6, c:''},
    {t:"Sur la banquette arrière, l'œil blanc de la personne du restaurant le fixe dans l'obscurité.", bg:4, c:'nb ns'},
    {t:"Pris d'une panique viscérale, Elyos lâche un hurlement et donne un violent coup de volant. Les pneus crissent sur l'asphalte humide...", bg:6, c:''}
];

function startScene3() {
    gs.scene = 3; sv();
    AudioCore.playTick(); // Son d'ambiance horloge
    M().innerHTML = ''; clrCh();

    setTimeout(() => {
        addNarr(`Le silence dans la chambre 12 est absolu, seulement brisé par le tic-tac mécanique du vieux réveil sur la table de chevet. 02:13.<br><br>Soudain, l'écran du téléphone de ${gs.char} s'illumine dans l'obscurité.`);
    }, 1000);

    setTimeout(() => {
        addVu();
        AudioCore.stopTick(); // On arrête le tic tac quand le message arrive
        setTimeout(() => mkT('t3_1'), 1500);
        setTimeout(() => {
            rmT('t3_1');
            addIn(`Pardon pour ce silence. Il fallait que je m'assure que tu sois bien installé dans la chambre 12, ${gs.char}. Le lit est confortable ?`);
            setTimeout(() => {
                clrCh();
                addCho(`A) C'est toi le taré qui me fixait au restaurant ? Qu'est-ce que tu me veux ?!`, () => rep2A());
                addCho(`B) C'est bon, la blague a assez duré. Je fais mes valises et j'appelle les flics.`, () => rep2B());
            }, 800);
        }, 3500);
    }, 4000);
}

function rep2A() {
    clrCh(); addOut(`C'est toi le taré qui me fixait au restaurant ? Qu'est-ce que tu me veux ?!`);
    setTimeout(() => mkT('t3_2'), 1000);
    setTimeout(() => {
        rmT('t3_2');
        addIn(`Le restaurant n'était qu'une mise en bouche. Tu es venu chercher le frisson ${gs.char}, non ? Tu veux voir ce que cache vraiment Carrow Lake.`);
        setTimeout(() => {
            clrCh();
            addCho(`A) Je suis venu courir et profiter de cette ville, c'est tout. Lâche-moi.`, () => rep3A("Je suis venu courir et profiter de cette ville mystique, c'est tout. Lâche-moi."));
            addCho(`B) Et si je dis oui ? Tu vas me faire une visite guidée des fantômes locaux ?`, () => rep3A("Et si je dis oui ? Tu vas me faire une visite guidée des fantômes locaux ?"));
        }, 800);
    }, 3000);
}

function rep2B() {
    clrCh(); addOut(`C'est bon, la blague a assez duré. Je fais mes valises et j'appelle les flics.`);
    setTimeout(() => mkT('t3_2'), 1000);
    setTimeout(() => {
        rmT('t3_2');
        addIn(`Appeler les flics ? Regarde l'icône de ton réseau, ${gs.char}.`);
        setTimeout(() => {
            addNarr(`${gs.char} jette un coup d'œil en haut de son écran. "Aucun service". La croix barre le signal. Il n'y a que le Wi-Fi de l'hôtel qui le relie à cet inconnu.`);
            setTimeout(() => {
                clrCh();
                addCho(`A) Je m'en fous, je descends à la réception tout de suite.`, () => rep4A());
                addCho(`B) (Ne rien répondre, écouter dans le noir)`, () => rep3A("..."));
            }, 1500);
        }, 1500);
    }, 3000);
}

function rep3A(txt) {
    clrCh(); if(txt !== "...") addOut(txt);
    setTimeout(() => mkT('t3_3'), 1000);
    setTimeout(() => {
        rmT('t3_3');
        addIn(`Regarde par ta fenêtre. En direction de la colline. Ne bouge pas le rideau trop vite.`);
        setTimeout(() => {
            addNarr(`${gs.char} se lève, les pieds nus sur le vieux parquet qui grince. Il s'approche de la vitre embuée et écarte doucement le tissu lourd. Au loin, au sommet de la colline qui surplombe l'hôtel, une faible lumière jaune vacille entre les arbres morts. L'emplacement exact du vieux cimetière de la ville.`);
            setTimeout(() => mkT('t3_4'), 3500);
            setTimeout(() => {
                rmT('t3_4');
                addIn(`La porte du caveau familial est ouverte. La silhouette du restaurant t'y attend. Viens seul. Si tu ne viens pas à elle, c'est elle qui montera jusqu'à ta chambre.`);
                choixFinal();
            }, 5500);
        }, 1500);
    }, 3000);
}

function rep4A() {
    clrCh(); addOut(`Je m'en fous, je descends à la réception tout de suite.`);
    setTimeout(() => mkT('t3_4'), 1000);
    setTimeout(() => {
        rmT('t3_4');
        addIn(`Le vieux de la réception dort. Tout le monde dort ici depuis très longtemps. D'ailleurs, tu ferais bien de ne pas faire de bruit. Colle ton oreille contre la porte de ta salle de bain.`);
        setTimeout(() => {
            addNarr(`Le sang de ${gs.char} se glace. À travers le silence écrasant de la nuit, il entend un bruit insoutenable venant de sa propre salle de bain. Un clapotis. Le bruit d'une eau épaisse qui coule lentement du robinet. Et un frottement humide contre le carrelage, comme quelqu'un... ou quelque chose... qui se hisse hors de la baignoire.`);
            setTimeout(() => mkT('t3_5'), 4000);
            setTimeout(() => {
                rmT('t3_5');
                addIn(`Fuis, ${gs.char}. Ou rejoins-moi au cimetière sur la colline. Ton temps est compté.`);
                choixFinal();
            }, 6000);
        }, 1500);
    }, 3000);
}

function choixFinal() {
    setTimeout(() => {
        addNarr(`⚡ CHOIX DÉCISIF<br><br>Le téléphone s'éteint, plongeant à nouveau la pièce dans l'obscurité. Que ce soit la menace venant de la colline ou le bruit atroce dans la salle de bain, ${gs.char} a le souffle court. Il doit agir, maintenant.`);
        setTimeout(() => {
            clrCh();
            addCho(`A) Prendre sa lampe torche, sortir et monter au cimetière.`, () => {
                goScreen('sn', true, () => startNarr(0, FIN1_SEGS, () => endEpisode(1)));
            });
            addCho(`B) Céder à la panique, attraper ses clés et fuir Carrow Lake.`, () => {
                goScreen('sn', true, () => startNarr(0, FIN2_SEGS, () => endEpisode(2)));
            });
        }, 2000);
    }, 3000);
}

function endEpisode(fin) {
    if(fin === 1) {
        $('sso').innerHTML = `
            <div class="cf1" style="font-size:10px;letter-spacing:7px;color:#605890;margin-bottom:20px;font-family:Georgia,serif">FIN DE L'ÉPISODE</div>
            <div class="cf2" style="font-size:28px;color:#b8b0e8;margin-bottom:20px">Le Cimetière</div>
            <div class="cf3" style="font-size:13px;color:#8a80ba;line-height:2.2;max-width:280px;margin-bottom:50px">Vous avez affronté la colline... Mais le mystère reste entier.<br>Avez-vous fait le bon choix ?</div>
            <button class="cf4 cho" onclick="resetGame()" style="text-align:center;max-width:200px;margin-top:30px">← RECOMMENCER</button>
        `;
        goScreen('sso', true);
    } else {
        goScreen('sdeath', true, () => {
            AudioCore.playCrash(); // Lance le son du crash au moment où l'écran noir apparait
        });
    }
}