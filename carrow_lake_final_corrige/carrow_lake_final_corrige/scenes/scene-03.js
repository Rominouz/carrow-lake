window.CL_HYBRID_SCENES=window.CL_HYBRID_SCENES||{};

window.CL_HYBRID_SCENES[3]={
  title:'SCÈNE 3 — CHAMBRE 12',
  intro:[
    `Le silence dans la chambre 12 est absolu, seulement brisé par le tic-tac mécanique du vieux réveil sur la table de chevet. 02:13. Soudain, l'écran du téléphone d'Elyos s'illumine dans l'obscurité.`,
    `Sur l'application de messagerie, la mention "Utilisateur bloqué" qui figeait la conversation depuis son arrivée vient de disparaître mystérieusement.\n\nSous son dernier message envoyé des heures plus tôt, une petite mention glaciale vient d'apparaître : Vu.`,
    `L'inconnu est en ligne.`
  ],
  sms:{
    r1:`Pardon pour ce silence. Il fallait que je m'assure que tu sois bien installé dans la chambre 12, Elyos. Le lit est confortable ?`,
    r2A:`Le restaurant n'était qu'une mise en bouche. Tu es venu chercher le frisson Elyos, non ? Tu veux voir ce que cache vraiment Carrow Lake, Elyos.`,
    r3A:`Regarde par ta fenêtre. En direction de la colline. Ne bouge pas le rideau trop vite.`,
    cemeteryThreat:`La porte du caveau familial est ouverte. La silhouette du restaurant t'y attend. Viens seul. Si tu ne viens pas à elle, c'est elle qui montera jusqu'à ta chambre.`,
    r2B:`Appeler les flics ? Regarde l'icône de ton réseau, Elyos.`,
    r4A:`Le vieux de la réception dort. Tout le monde dort ici depuis très longtemps. D'ailleurs, tu ferais bien de ne pas faire de bruit. Colle ton oreille contre la porte de ta salle de bain.`,
    bathroomThreat:`Fuis, Elyos. Ou rejoins-moi au cimetière sur la colline. Ton temps est compté.`
  },
  choices:{
    r1:{
      a:`C'est toi le taré qui me fixait au restaurant ? Qu'est-ce que tu me veux ?!`,
      b:`C'est bon, la blague a assez duré. Je fais mes valises et j'appelle les flics.`
    },
    r2a:{
      a:`Je suis venu courir et profiter de cette ville mystique, c'est tout. Lâche-moi.`,
      b:`Et si je dis oui ? Tu vas me faire une visite guidée des fantômes locaux ?`
    },
    r2b:{
      a:`Je m'en fous, je descends à la réception tout de suite.`,
      b:`Ne rien répondre. Retenir sa respiration dans le noir et écouter.`
    }
  },
  narratives:{
    window:[
      `Elyos se lève, les pieds nus sur le vieux parquet qui grince. Il s'approche de la vitre embuée et écarte doucement le tissu lourd.`,
      `Au loin, au sommet de la colline qui surplombe l'hôtel, une faible lumière jaune vacille entre les arbres morts.\n\nL'emplacement exact du vieux cimetière de la ville.`
    ],
    bathroom:[
      `Le sang d'Elyos se glace. À travers le silence écrasant de la nuit, il entend un bruit insoutenable venant de sa propre salle de bain.`,
      `Un clapotis.\n\nLe bruit d'une eau épaisse qui coule lentement du robinet.`,
      `Et un frottement humide contre le carrelage, comme quelqu'un... ou quelque chose... qui se hisse hors de la baignoire.`
    ]
  },
  finalPrompt:`Le téléphone s'éteint, plongeant à nouveau la pièce dans l'obscurité.\n\nQue ce soit la menace venant de la colline ou le bruit atroce dans la salle de bain, Elyos a le souffle court. Son cœur cogne douloureusement dans sa poitrine.\n\nIl doit agir, maintenant.`,
  finalChoices:[
    {end:'cemetery',text:`Prendre sa lampe torche, sortir de l'hôtel et monter au cimetière pour découvrir qui se cache derrière tout ça.`},
    {end:'flight',text:`Céder à la panique, attraper ses clés de voiture, et fuir Carrow Lake sur-le-champ.`}
  ],
  finalLabels:{
    cemetery:'FIN 1 — LE CIMETIÈRE',
    flight:'FIN 2 — LA FUITE'
  },
  finals:{
    cemetery:[
      `L'adrénaline remplace la peur. Elyos refuse d'être une proie. Il enfile ses vêtements sombres et ses chaussures de trail à la hâte, sans allumer la lumière. Il quitte la chambre 12 en silence.`,
      `L'air extérieur est mordant. Le brouillard s'est épaissi, avalant les contours de l'Hôtel des pins. En allumant sa lampe torche, le faisceau lumineux peine à percer la brume. Elyos s'engage sur le sentier escarpé qui mène à la colline.`,
      `Ses pas écrasent les feuilles mortes. Plus il monte, plus l'odeur de la terre retournée devient suffocante. À travers les grilles en fer forgé du cimetière, il aperçoit la source de la lumière : une vieille lanterne à huile posée sur le sol.`,
      `Juste devant un caveau dont la lourde porte en pierre a été poussée de l'intérieur.`,
      `Elyos s'approche lentement. Sa respiration fait de la fumée dans l'air froid. Lorsqu'il braque sa lampe vers l'intérieur du caveau, il s'attend à voir le malade du restaurant.\n\nMais il n'y a personne.`,
      `Il n'y a qu'un vieux téléphone posé sur un cercueil brisé, l'écran allumé sur leur conversation.`,
      `Et soudain, derrière lui, les lourdes grilles du cimetière claquent violemment dans la nuit.`,
      `Il regarde derrière lui en sursaut. Avant de se retourner et de voir que le téléphone avait disparu.\n\nEn allumant son téléphone, il se rendit compte que les messages n'avaient jamais existé.`
    ],
    flight:[
      `La panique totale prend le dessus. Elyos n'est plus rationnel. Le grattement contre la porte de sa salle de bain devient plus insistant, suivi du bruit sourd d'une main mouillée tapant contre le bois.`,
      `Il attrape son sac à dos, y jette ses clés de voiture, et se rue dans le couloir sans un regard en arrière. Il dévale les marches de l'Hôtel des pins. La réception est vide, plongée dans les ténèbres. Carrow Lake ressemble à une ville morte.`,
      `Une fois dans sa voiture sur le parking, il s'enferme à l'intérieur, les mains tremblantes. Le moteur démarre dans un rugissement. Il accélère à fond, quittant le parking, fendant le brouillard.`,
      `Il roule à toute vitesse sur la route sinueuse menant hors de la vallée. Le panneau "Vous quittez Carrow Lake" apparaît enfin dans ses phares. Un soulagement immense envahit sa poitrine. Il a réussi.`,
      `Mais alors que son rythme cardiaque commence à redescendre, son téléphone posé sur le siège passager s'allume.\n\nInconnu : "Fuir la ville ne sert à rien, Elyos. Tu as emmené Carrow Lake avec toi."`,
      `Une goutte d'eau glacée tombe soudainement sur la nuque d'Elyos.\n\nIl lève lentement les yeux vers son rétroviseur intérieur.`,
      `Sur la banquette arrière, l'œil blanc de la personne du restaurant le fixe dans l'obscurité.`,
      `Pris d'une panique viscérale, Elyos lâche un hurlement et donne un violent coup de volant. Les pneus crissent sur l'asphalte humide, incapables de trouver de l'adhérence.`,
      `La voiture dévie brusquement de sa trajectoire, quitte la route à pleine vitesse et vient s'encastrer avec une violence inouïe dans le tronc massif d'un arbre.`,
      `Le fracas effroyable de la tôle froissée déchire le silence de la nuit, suivi du tintement des bris de glace.`,
      `Le choc est fatal. Le silence retombe lourdement sur la forêt, seulement troublé par le clignotant de la voiture en ruine, et le bruit lent d'une respiration humide à l'arrière de l'habitacle.`
    ]
  },
  comingSoon:'“Carrow Lake garde désormais un secret de plus.”'
};
