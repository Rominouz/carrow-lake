window.CL_STORY_SCENES=window.CL_STORY_SCENES||{};

window.CL_STORY_SCENES[5]={
  title:'SCÈNE 5 — LA CHASSE',
  sceneTag:'SCÈNE 5',
  nextScene:6,
  phoneTime:'00:00',
  startBackground:'overlook',
  backgrounds:{
    fallback:'./assets/scenes/04/scene-04-forest.webp',
    overlook:'./assets/scenes/05/scene-05-overlook.webp',
    forestRoad:'./assets/scenes/05/scene-05-forest-road.webp',
    blackStream:'./assets/scenes/05/scene-05-black-stream.webp',
    northgate:'./assets/scenes/05/scene-05-northgate-fence.webp',
    brambles:'./assets/scenes/05/scene-05-brambles.webp',
    giantTree:'./assets/scenes/05/scene-05-giant-tree.webp',
    whiteRoom:'./assets/scenes/05/scene-05-white-room.webp'
  },
  progress:{
    start:'scene5_hunt'
  },
  flow:{
    start:'intro',
    defaultBackground:'overlook',
    nodes:{
      intro:{
        type:'narrative',
        bg:'overlook',
        audio:'siren',
        progress:'scene5_hunt',
        lines:[
          `La sirène continue de hurler au-dessus de Carrow Lake.

Son cri métallique traverse la vallée, se brise contre les montagnes, puis revient mourir dans les arbres comme une plainte immense.`,
          `Elyos reste figé sur la corniche.

En contrebas, la ville entière s’est allumée d’un rouge sang. Les rues. Les fenêtres. Les lampadaires. Même les reflets sur le lac.

Tout brille de cette même lueur malade.`,
          `Puis le bruit commence.

D’abord faible. Un grondement sourd, presque confondu avec le vent.

Puis plus net.

Des pas. Des dizaines. Des centaines. Tous parfaitement synchronisés.`,
          `Depuis les rues de Carrow Lake, la population entière avance vers la forêt.

Pas un cri. Pas une discussion. Pas une hésitation.

Hommes, femmes, vieillards, adolescents… tous marchent dans la même direction, le visage tourné vers les hauteurs.

Vers lui.`,
          `Le brouillard ne bouge pas comme un vrai brouillard.

Il rampe.

Il se glisse entre les troncs. Il monte le long des pierres. Il semble chercher les chevilles d’Elyos.`,
          `Sur l’écran, l’heure reste bloquée sur 00:00, exactement comme le téléphone trouvé dans le sac de Lou.

Ce n’est pas minuit.

C’est la même anomalie qui les suit depuis la scène précédente.

Le téléphone d’Elyos vibre soudain dans sa main.`
        ],
        next:'sms_lou'
      },
      sms_lou:{
        type:'sms',
        sender:'La Vraie Lou (?)',
        bg:'overlook',
        audio:'hunt',
        messages:[
          {side:'in',text:`Ne descends surtout pas.
La ville monte vers la forêt.

Rejoins l’arbre géant près de la Route forestière interdite.
Celui dont les racines traversent le goudron.

Cours droit vers l’est.
Ne suis pas les lumières rouges.
Ne suis pas les voix.

Et surtout, ne rejoins pas la marche.`}
        ],
        choices:[
          {key:'A',text:`Comment je suis censé savoir que tu es la vraie Lou ?`,out:`Comment je suis censé savoir que tu es la vraie Lou ?`,reply:`Tu ne peux pas le savoir maintenant.

Mais au cimetière, je portais une robe à fleurs. Je pleurais devant la tombe de mon frère. Je t’ai donné rendez-vous pour marcher.

Celle que tu as suivie ce matin n’était pas moi.

Cours, Elyos.`,next:'gps'},
          {key:'B',text:`J’arrive. Mais si tu me mens, je suis mort.`,out:`J’arrive. Mais si tu me mens, je suis mort.`,reply:`Si je voulais ta mort, je te dirais de descendre en ville.

Cours vers l’arbre.
Je t’expliquerai tout là-bas.`,next:'gps'},
          {key:'C',text:`Pourquoi toute la ville marche vers moi ?`,out:`Pourquoi toute la ville marche vers moi ?`,reply:`Parce que la Chasse a commencé.

Et quand la Chasse commence, Carrow Lake ne pense plus.
Carrow Lake obéit.

Cours.`,next:'gps'}
        ]
      },
      gps:{
        type:'narrative',
        bg:'overlook',
        audio:'hunt',
        lines:[
          `Elyos ouvre son application GPS d’un geste tremblant.

Pendant une seconde, la carte apparaît normalement : le lac, la corniche, la forêt, la Route forestière interdite.`,
          `Puis l’écran grésille.

Le point bleu représentant Elyos se met à tourner sur lui-même. Les rues de Carrow Lake s’étirent comme des veines rouges, puis se replient autour de lui.`,
          `Un message apparaît.

ACCÈS GPS BLOQUÉ.

Puis un autre.

ITINÉRAIRE MODIFIÉ PAR UTILISATEUR INCONNU.`,
          `Tous les chemins affichés ramènent désormais vers le centre-ville.

Vers l’Hôpital/Clinique.

Vers les pas.`,
          `Le téléphone vibre encore.

Cette fois, ce n’est plus Lou.`
        ],
        next:'sms_map'
      },
      sms_map:{
        type:'sms',
        sender:'Inconnu',
        bg:'overlook',
        audio:'hunt',
        messages:[{side:'in',text:`Tu vois, Elyos ?

La carte ne bug pas.

Elle te montre simplement le seul endroit où tu as encore le droit d’aller.`}],
        continueText:'Regarder la carte',
        next:'phone_points'
      },
      phone_points:{
        type:'narrative',
        bg:'overlook',
        audio:'hunt',
        lines:[
          `L’écran du téléphone se met à trembler entre les doigts d’Elyos.

Sur la carte, son point bleu clignote. Autour de lui, des dizaines de petits points rouges apparaissent un à un.`,
          `D’abord en bas de la ville. Puis dans les rues. Puis sur les chemins. Puis dans la forêt.

Ils montent.

Tous.

Lentement.`,
          `Derrière lui, quelque part dans le brouillard, une branche craque.

Puis une autre.

Puis une autre.

Pas devant. Pas seulement derrière. Autour.`
        ],
        next:'sms_steps'
      },
      sms_steps:{
        type:'sms',
        sender:'Inconnu',
        bg:'overlook',
        audio:'hunt',
        messages:[{side:'in',text:`Ils ne courent pas.

Ils n’en ont pas besoin.

Ils savent que la forêt te fatiguera avant eux.`}],
        continueText:'Lever les yeux',
        next:'hunt_closes'
      },
      hunt_closes:{
        type:'narrative',
        bg:'overlook',
        audio:'hunt',
        lines:[
          `Elyos relève les yeux.

Au loin, entre les troncs, il aperçoit les premières silhouettes. Elles avancent dans le brouillard rougeâtre.`,
          `Elles ne parlent pas. Elles ne respirent presque pas.

Mais toutes ont la tête tournée vers lui.

Exactement vers lui.`,
          `Comme si quelqu’un leur avait indiqué sa position à chaque battement de cœur.`
        ],
        next:'sms_chamber'
      },
      sms_chamber:{
        type:'sms',
        sender:'Inconnu',
        bg:'overlook',
        audio:'hunt',
        messages:[{side:'in',text:`Ne lutte pas.

La foule protège ceux qui arrêtent de résister.

Elle te portera jusqu’à la chambre.
Elle fermera la porte.
Et tu n’auras plus jamais peur du noir.

Parce qu’il ne restera plus que ça.`}],
        continueText:'Refuser',
        next:'route_choice_narr'
      },
      route_choice_narr:{
        type:'narrative',
        bg:'overlook',
        audio:'hunt',
        lines:[
          `Sur la carte, tous les itinéraires disparaissent sauf un.

Une ligne rouge se trace toute seule depuis sa position. Elle descend vers la ville, traverse le vieux centre, puis s’arrête sur un bâtiment isolé près de la rivière.`,
          `HÔPITAL / CLINIQUE.

La ligne pulse lentement, comme une veine ouverte.`,
          `Derrière lui, les pas se rapprochent.

Un murmure monte dans la brume.

“Elyos…”

“Elyos…”

“Elyos…”`
        ],
        next:'sms_choose'
      },
      sms_choose:{
        type:'sms',
        sender:'Inconnu',
        bg:'overlook',
        audio:'hunt',
        messages:[{side:'in',text:`Choisis vite.

La ville n’aime pas attendre.`}],
        choices:[
          {key:'A',text:`S’arracher à la peur et s’enfoncer droit dans la forêt, loin de la population.`,out:`Je cours vers l’est.`,next:'three_passages'},
          {key:'B',text:`Rejoindre la foule pour demander de l’aide en urgence.`,out:`Je vais vers eux. Il doit y avoir quelqu’un de vivant là-dedans.`,next:'white_room'}
        ]
      },
      white_room:{
        type:'narrative',
        bg:'whiteRoom',
        audio:'whiteRoom',
        progress:'scene5_white_room',
        lines:[
          `Elyos serre les dents.

La peur le pousse à chercher quelque chose d’humain. Une voix. Un visage. Un secours.`,
          `Il descend la pente en trébuchant jusqu’à rejoindre la première route forestière.

La foule arrive lentement. Elle sort du brouillard comme une seule masse.`,
          `"Attendez ! J’ai besoin d’aide !"

Personne ne répond. Les habitants continuent d’avancer, les yeux ouverts mais vides.`,
          `Plusieurs mains se referment sur lui.

Des doigts glacés agrippent ses bras, son cou, son sac. Il se débat, mais ils sont trop nombreux.`,
          `La foule le traîne jusqu’à Carrow Lake.

Les portes de l’Hôpital/Clinique s’ouvrent dans un grincement long et affreux.`,
          `Elyos se réveille dans une chambre blanche.

Un lit métallique. Un lavabo fendu. Une fenêtre trop haute, protégée par des barreaux. Une porte sans poignée.`,
          `Son téléphone n’a plus de réseau.

L’heure indique 00:00.`,
          `Le premier jour, il hurle.

Le deuxième, il économise sa voix.

Le troisième, l’eau du lavabo cesse de couler.

Le quatrième, il comprend que personne ne viendra.`,
          `Au bout d’un temps impossible à mesurer, Elyos parvient à se hisser jusqu’à la fenêtre.

Dehors, Carrow Lake est visible entre les barreaux. Les rues sont vides. Aucune voiture. Aucun habitant. Aucune lumière normale.

Seulement les lampadaires rouges.`,
          `Son téléphone vibre une dernière fois.

Inconnu : “Tu as rejoint la marche.

Maintenant, attends qu’elle revienne.”`
        ],
        next:'white_room_end'
      },
      white_room_end:{
        type:'ending',
        bg:'whiteRoom',
        audio:'whiteRoom',
        title:'FIN RATÉE — LA CHAMBRE BLANCHE',
        quote:'Carrow Lake n’a pas besoin de tuer vite. Elle sait attendre.'
      },
      three_passages:{
        type:'narrative',
        bg:'forestRoad',
        audio:'hunt',
        lines:[
          `Elyos arrache son regard de l’écran.

Son téléphone ne répond plus. Plus de carte. Plus de réseau. Plus de messages.

Seulement un écran noir, glacé, qui reflète son visage pâle.`,
          `Derrière lui, les pas de la population continuent de monter.

Lents. Réguliers. Inévitables.`,
          `Devant lui, trois passages se dessinent dans l’obscurité.

À gauche, une vieille route forestière disparaît sous le brouillard.

Au centre, un ruisseau noir serpente entre les arbres.

À droite, de longues clôtures rouillées s’enfoncent vers les bâtiments abandonnés de Northgate.`
        ],
        next:'path_choice'
      },
      path_choice:{
        type:'choice',
        bg:'forestRoad',
        audio:'hunt',
        prompt:'La Chasse approche. Quel passage Elyos prend-il ?',
        choices:[
          {key:'A',text:'Suivre la route froide presque invisible sous le brouillard.',next:'cold_road'},
          {key:'B',text:'Suivre le ruisseau noir entre les arbres.',next:'black_stream'},
          {key:'C',text:'Longer les anciennes clôtures rouillées de Northgate.',next:'northgate_fence'}
        ]
      },
      cold_road:{
        type:'narrative',
        bg:'forestRoad',
        audio:'forestRoad',
        progress:'scene5_cold_road',
        lines:[
          `Elyos s’engage sur la vieille route forestière.

Le sol dur sous ses chaussures devrait le rassurer. Au moins, ici, il peut courir.`,
          `Mais l’asphalte est gelé par endroits, alors que l’air n’est pas assez froid pour ça.

Dans la boue, sur les bords de la route, il voit des dizaines d’empreintes. Toutes identiques.`,
          `Même taille. Même profondeur. Même distance entre chaque pas.

Comme si une foule entière avançait avec un seul corps.`,
          `Les traces ne viennent pas de la ville.

Elles vont vers la ville.

Puis reviennent vers la forêt.

Encore. Et encore.`,
          `Plus loin sur la route, une silhouette apparaît.

Immobile.

Elle porte une robe à fleurs.`,
          `Lou ?

La silhouette tourne lentement la tête. Trop lentement. Le visage est caché par des cheveux blonds trempés.

Non.

Ce n’est pas elle.`,
          `Puis les pas de la foule résonnent à nouveau, beaucoup plus proches.

Elyos quitte la route et s’enfonce entre les arbres.`
        ],
        next:'convergence'
      },
      black_stream:{
        type:'narrative',
        bg:'blackStream',
        audio:'blackStream',
        progress:'scene5_black_stream',
        lines:[
          `Elyos choisit le ruisseau.

Le bruit de l’eau l’aide à ne pas écouter les murmures derrière lui.`,
          `Le ruisseau coule entre les pierres noires.

Mais quelque chose cloche.

L’eau ne descend pas vers le lac. Elle remonte la pente.`,
          `Des feuilles mortes flottent à la surface.

Elles tournent en cercles parfaits, sans jamais être emportées.`,
          `Entre deux racines, Elyos trouve un téléphone couvert de mousse.

Sur l’écran mort, quelqu’un a gravé :

NE SUIS PAS LES VOIX.
NE SUIS PAS LES VISAGES.
TROUVE L’ARBRE.`,
          `Un craquement retentit de l’autre côté du ruisseau.

Entre les troncs, plusieurs habitants avancent en silence. Ils ne courent pas. Ils savent qu’il les a vus.`,
          `L’un d’eux sourit.

Pas avec joie.

Avec patience.`,
          `Elyos bondit par-dessus le ruisseau et s’enfonce dans une pente de fougères noires.

Derrière lui, l’eau se met à bouillonner comme si quelque chose remontait du fond.`
        ],
        next:'convergence'
      },
      northgate_fence:{
        type:'narrative',
        bg:'northgate',
        audio:'northgate',
        progress:'scene5_northgate',
        lines:[
          `Elyos longe les anciennes clôtures rouillées.

Le métal grince doucement dans le vent, même lorsqu’il n’y a pas de vent.`,
          `Derrière la clôture, on distingue des bâtiments bas noyés dans le brouillard.

Des fenêtres brisées. Des murs gris. Des couloirs sans lumière.`,
          `Un haut-parleur rouillé fixé à un poteau se met soudain à cracher un souffle grave.`,
          `“La battue est obligatoire.”

Grésillement.

“Toute personne isolée doit être remise aux autorités.”

Grésillement.

“Ne laissez pas le fugitif atteindre la Route forestière interdite.”`,
          `Le fugitif.

Le psychopathe.

Donc la Chasse n’est pas pour lui. Pas au départ.`,
          `Un choc métallique retentit derrière le grillage.

Dans une fenêtre brisée, une silhouette blanche disparaît aussitôt. Il ne voit qu’un détail.

Un œil.

Ouvert. Fixe.`,
          `Le haut-parleur crache une dernière phrase, plus basse que les autres :

“Il sait imiter les voix maintenant.”

Elyos quitte la clôture et coupe droit dans la forêt.`
        ],
        next:'convergence'
      },
      convergence:{
        type:'narrative',
        bg:'brambles',
        audio:'hunt',
        lines:[
          `Peu importe le passage choisi, Elyos finit par arriver devant une clairière étroite.

La forêt s’ouvre à peine.`,
          `Devant lui, deux chemins permettent de continuer vers l’est.

À gauche, un passage boueux. Large. Silencieux. Sans ronces. Sans branches. Sans obstacle.

Il paraît presque trop simple.`,
          `À droite, un mur de ronces noires bloque presque entièrement le passage.

Les épines brillent dans la lumière tremblante de sa lampe.

Derrière lui, les pas de la foule se rapprochent.`
        ],
        next:'ground_choice'
      },
      ground_choice:{
        type:'choice',
        bg:'brambles',
        audio:'hunt',
        prompt:'Elyos n’a plus que quelques secondes.',
        choices:[
          {key:'A',text:'Prendre le chemin boueux, plus rapide et moins douloureux.',next:'mud_fail'},
          {key:'B',text:'Forcer le passage dans les ronces malgré la douleur.',next:'brambles_survive'}
        ]
      },
      mud_fail:{
        type:'narrative',
        bg:'brambles',
        audio:'hunt',
        lines:[
          `Elyos choisit le chemin boueux.

Il pose un pied dessus. Le sol s’enfonce légèrement.

Un deuxième pas. Puis un troisième.`,
          `La boue monte jusqu’à ses chevilles.

Il tente d’accélérer.

Erreur.`,
          `Le sol cède sous lui.

Sa jambe droite s’enfonce brutalement jusqu’au genou. Il tire. La boue aspire sa chaussure avec un bruit humide.`,
          `Ce n’est pas de la boue normale.

C’est froid. Dense. Vivant.

Chaque mouvement le fait descendre davantage.`,
          `Derrière lui, les pas de la foule arrivent au bord du chemin.

Elyos hurle.

“Aidez-moi !”`,
          `La population s’arrête.

Des dizaines de silhouettes le regardent sans expression.

Aucune ne bouge.`,
          `Son téléphone flotte un instant à la surface, couvert de terre.

L’écran s’allume.

Inconnu : “Continuer tout droit ne veut pas dire choisir le chemin le plus facile.”`,
          `Juste avant que la boue ne recouvre ses yeux, il voit la foule reprendre sa marche, comme si elle venait simplement de contourner un arbre tombé.

Puis la clairière redevient lisse.`
        ],
        next:'mud_end'
      },
      mud_end:{
        type:'ending',
        bg:'brambles',
        audio:'hunt',
        title:'FIN RATÉE — LE SOL QUI AVALE',
        quote:'La forêt garde ce que la ville lui donne.'
      },
      brambles_survive:{
        type:'narrative',
        bg:'brambles',
        audio:'brambles',
        progress:'scene5_brambles',
        lines:[
          `Elyos serre les dents.

Il se jette dans les ronces.`,
          `La douleur est immédiate.

Les épines accrochent son sweat, griffent ses bras, lui lacèrent les mains.`,
          `Le passage est si étroit qu’il doit avancer de côté, protéger son visage avec ses avant-bras, pousser les branches avec ses épaules.`,
          `Derrière lui, les pas de la foule ralentissent.

Les habitants ne prennent pas le passage. Ils restent devant les ronces, immobiles.

Comme si quelque chose les en empêchait.`,
          `Elyos comprend alors que la douleur est peut-être le prix à payer pour rester vivant.`,
          `Après plusieurs mètres interminables, Elyos tombe de l’autre côté du mur végétal.

Il roule dans les feuilles mortes, haletant, tremblant, couvert d’égratignures.`
        ],
        next:'giant_tree_arrival'
      },
      giant_tree_arrival:{
        type:'narrative',
        bg:'giantTree',
        audio:'giantTree',
        lines:[
          `Et là, il le voit.

L’arbre.`,
          `Immense.

Plus grand que tous les autres. Son tronc est si large qu’il faudrait plusieurs hommes pour l’entourer.`,
          `Ses racines traversent le sol, déchirent l’asphalte d’une vieille route abandonnée, et disparaissent sous un panneau métallique penché :

ROUTE FORESTIÈRE INTERDITE`,
          `Une silhouette se tient au pied de l’arbre.

Blonde. Mince. Immobile.

Elle porte une robe sombre couverte d’un manteau trop grand.

Et sur son visage, de petites lunettes rondes crème et or brillent faiblement.`,
          `Lou.

La vraie.

Ou une autre.`
        ],
        next:'lou_reaction'
      },
      lou_reaction:{
        type:'choice',
        bg:'giantTree',
        audio:'giantTree',
        prompt:'Comment Elyos réagit-il en voyant Lou ?',
        choices:[
          {key:'A',text:'Rester à distance et braquer la lampe sur elle.',next:'reply_2a'},
          {key:'B',text:'Lui crier de prouver immédiatement qu’elle est la vraie.',next:'reply_2b'},
          {key:'C',text:'Courir vers elle, trop épuisé pour réfléchir.',next:'reply_2c'},
          {key:'D',text:'Ne rien dire et observer ses yeux, ses mains, sa respiration.',next:'reply_2d'}
        ]
      },
      reply_2a:{type:'dialogue',bg:'giantTree',audio:'giantTree',progress:'scene5_true_lou',lines:[{speaker:'LOU',text:`Garde la lumière si ça te rassure.

Mais baisse-la un peu.
Si la Chasse voit le faisceau, elle saura exactement où tu es.`}],next:'lou_common'},
      reply_2b:{type:'dialogue',bg:'giantTree',audio:'giantTree',progress:'scene5_true_lou',lines:[{speaker:'LOU',text:`Au cimetière, tu cherchais quelqu’un qui te harcelait.

Je t’ai dit que les vivants ne venaient jamais ici la nuit.
Je t’ai donné rendez-vous devant le Café du Port.

Et ce matin, je suis arrivée en retard.
Tu n’étais déjà plus là.`}],next:'lou_common'},
      reply_2c:{type:'dialogue',bg:'giantTree',audio:'giantTree',progress:'scene5_true_lou',lines:[{speaker:'LOU',text:`Elyos, stop !

Ne t’approche pas trop vite.

Je comprends que tu sois terrifié, mais après ce que tu as vu, tu dois vérifier chaque visage.

Même le mien.`}],next:'lou_common'},
      reply_2d:{type:'dialogue',bg:'giantTree',audio:'giantTree',progress:'scene5_true_lou',lines:[{speaker:'NARRATIF',text:`Elyos ne répond pas.

Il observe.

Lou respire vraiment. De petites fumées blanches sortent de sa bouche à chaque expiration. Ses mains tremblent. Ses lunettes sont légèrement embuées.

Et surtout, ses yeux sont bleus.

Humains. Terrifiés.`}],next:'lou_common'},
      lou_common:{
        type:'dialogue',
        bg:'giantTree',
        audio:'giantTree',
        lines:[
          {speaker:'ELYOS',text:`Celle de ce matin avait ton visage.

Ta voix.

Tes lunettes.

Elle savait où aller.`},
          {speaker:'LOU',text:`Elle savait parce qu’elle m’a suivie avant toi.

Je devais te retrouver au départ de la marche, près du Café du Port. Mais la sirène de Northgate a sonné avant l’heure.

Quand je suis arrivée, tu avais disparu.

Et quelqu’un d’autre portait déjà mon visage dans la forêt.`}
        ],
        next:'trust_choice'
      },
      trust_choice:{
        type:'choice',
        bg:'giantTree',
        audio:'giantTree',
        prompt:'Que répond Elyos ?',
        choices:[
          {key:'A',text:'Je te crois. Mais je garde mes distances.',next:'reply_5a'},
          {key:'B',text:'Je ne te crois pas encore. Mais j’ai besoin de réponses.',next:'reply_5b'},
          {key:'C',text:'Désolé… je pensais vraiment que c’était toi.',next:'reply_5c'},
          {key:'D',text:'Donc depuis ce matin, quelque chose joue avec moi ?',next:'reply_5d'}
        ]
      },
      reply_5a:{type:'dialogue',bg:'giantTree',audio:'giantTree',lines:[{speaker:'LOU',text:`Garde-les.

À Carrow Lake, faire confiance trop vite, c’est mourir poliment.`}],next:'heal'},
      reply_5b:{type:'dialogue',bg:'giantTree',audio:'giantTree',lines:[{speaker:'LOU',text:`Alors ne crois pas.

Écoute.
Observe.
Et décide après.

C’est déjà plus intelligent que la moitié des gens qui entrent dans cette forêt.`}],next:'heal'},
      reply_5c:{type:'dialogue',bg:'giantTree',audio:'giantTree',lines:[{speaker:'LOU',text:`Tu n’as pas à t’excuser.

Si une chose prend mon visage, c’est qu’elle sait que tu aurais voulu me faire confiance.

C’est ça qui la rend dangereuse.`}],next:'heal'},
      reply_5d:{type:'dialogue',bg:'giantTree',audio:'giantTree',lines:[{speaker:'LOU',text:`Oui.

Et pas seulement avec toi.

Avec la ville entière.`}],next:'heal'},
      heal:{
        type:'narrative',
        bg:'giantTree',
        audio:'giantTree',
        lines:[
          `Lou attrape doucement le poignet d’Elyos.

Il se crispe.

Elle ne force pas.`,
          `"Je vais juste retirer les épines."

Il hésite, puis la laisse faire.

Ses doigts sont froids, mais humains.`,
          `Autour d’eux, la forêt grince.

Au loin, la marche de la population continue. Plus lente maintenant. Plus prudente.

Comme si la foule n’osait pas approcher de l’arbre géant.`
        ],
        next:'question_lou'
      },
      question_lou:{
        type:'choice',
        bg:'giantTree',
        audio:'giantTree',
        prompt:'Quelle question Elyos pose-t-il pendant que Lou le soigne ?',
        choices:[
          {key:'A',text:'Pourquoi toute la ville participe à cette Chasse ?',next:'reply_6a'},
          {key:'B',text:'Qui est l’homme qui m’envoie des messages ?',next:'reply_6b'},
          {key:'C',text:'Pourquoi la Route forestière est interdite ?',next:'reply_6c'},
          {key:'D',text:'Qu’est-ce qui s’est passé la dernière fois ?',next:'reply_6d'},
          {key:'E',text:'Pourquoi la fausse Lou voulait m’entraîner dans la forêt ?',next:'reply_6e'}
        ]
      },
      reply_6a:{type:'dialogue',bg:'giantTree',audio:'giantTree',lines:[{speaker:'LOU',text:`Officiellement, c’est une battue.

Un homme dangereux s’est enfui ce matin.

La ville entière a reçu l’ordre de le retrouver avant qu’il atteigne la Route forestière interdite.

Mais ici, quand la sirène rouge sonne, les gens ne cherchent plus seulement.

Ils obéissent.`}],next:'map_reveal'},
      reply_6b:{type:'dialogue',bg:'giantTree',audio:'giantTree',lines:[{speaker:'LOU',text:`Je ne connais pas son vrai nom.

Personne ne le prononce plus.

On l’appelle seulement l’Inconnu.

Il a déjà utilisé des téléphones pour attirer des gens dehors. Pour les isoler. Les déplacer. Les faire disparaître.`}],next:'map_reveal'},
      reply_6c:{type:'dialogue',bg:'giantTree',audio:'giantTree',lines:[{speaker:'LOU',text:`Parce qu’elle mène vers Northgate.

L’ancien laboratoire.

Avant, c’était un centre de recherche.
Puis un lieu d’internement.
Puis un endroit qu’on a préféré rayer des cartes.

La forêt a repris la route. Mais certaines choses savent encore l’emprunter.`}],next:'map_reveal'},
      reply_6d:{type:'dialogue',bg:'giantTree',audio:'giantTree',lines:[{speaker:'LOU',text:`La dernière fois qu’il s’est échappé, Carrow Lake a vécu sa nuit la plus sombre.

Des familles entières sont sorties de chez elles en même temps.
Des enfants ont été retrouvés au bord du lac, incapables de parler.
L’hôpital a été fermé pendant trois semaines.

Et le lendemain matin, toutes les horloges de la ville indiquaient 00:00.

Comme ton téléphone.`}],next:'map_reveal'},
      reply_6e:{type:'dialogue',bg:'giantTree',audio:'giantTree',lines:[{speaker:'LOU',text:`Je pense qu’elle ne voulait pas te tuer tout de suite.

Elle voulait te pousser à choisir.

La grotte. Le sac. La fuite. La confiance. La peur.

Certaines choses ici ne chassent pas seulement les corps.

Elles étudient les réactions.`}],next:'map_reveal'},
      map_reveal:{
        type:'dialogue',
        bg:'giantTree',
        audio:'giantTree',
        lines:[
          {speaker:'LOU',text:`Écoute-moi bien. Peu importe par où tu es passé, il faut que tu comprennes toute la carte.

Il y a dix couloirs dans cette forêt.`},
          {speaker:'LOU',text:`Sur la route froide, les traces montrent que la foule marche comme un seul corps.

Dans le fossé, les rubans rouges marquent les zones de battue.

Près du ruisseau, l’eau remonte vers la forêt.

Sous le petit pont, quelqu’un a gravé l’heure de la fuite : 06:17.`},
          {speaker:'LOU',text:`Dans les maisons près des bois, les repas sont encore sur les tables.

Dans les jardins, les traces sur les vitres montrent que certains ont essayé de résister.

Dans les fougères, la forêt observe. Elle ne dort jamais vraiment.`},
          {speaker:'LOU',text:`Dans la ravine, la fausse Lou est passée avant toi.

Près de Northgate, les haut-parleurs donnent encore des ordres, même si plus personne ne devrait les contrôler.

Et à l’ancienne scierie, une affiche dit de ne jamais répondre au téléphone quand la sirène sonne.`},
          {speaker:'LOU',text:`Tu as répondu.`}
        ],
        next:'reveal_choice'
      },
      reveal_choice:{
        type:'choice',
        bg:'giantTree',
        audio:'giantTree',
        prompt:'Elyos réagit à la révélation.',
        choices:[
          {key:'A',text:'Donc tout ce que j’ai fait depuis hier était prévu ?',next:'reply_7a'},
          {key:'B',text:'Pourquoi moi ? Je ne viens même pas d’ici.',next:'reply_7b'},
          {key:'C',text:'On doit quitter Carrow Lake maintenant.',next:'reply_7c'},
          {key:'D',text:'Non. Si cet homme existe vraiment, il faut le trouver avant eux.',next:'reply_7d'}
        ]
      },
      reply_7a:{type:'dialogue',bg:'giantTree',audio:'giantTree',lines:[{speaker:'LOU',text:`Pas prévu.

Orienté.

C’est différent.

Il ne peut pas contrôler toutes tes décisions.

Alors il crée des chemins où chaque décision te rapproche quand même de lui.`}],next:'crowd_waits'},
      reply_7b:{type:'dialogue',bg:'giantTree',audio:'giantTree',lines:[{speaker:'LOU',text:`Justement.

Tu es étranger.

Tu n’as pas grandi avec nos règles. Tu ne sais pas quelles portes ne jamais ouvrir, quels noms ne jamais lire, quelles lumières ne jamais suivre.

Pour lui, tu es facile à déplacer.`}],next:'crowd_waits'},
      reply_7c:{type:'dialogue',bg:'giantTree',audio:'giantTree',lines:[{speaker:'LOU',text:`Quitter la ville ne suffit pas.

Tu l’as vu avec ton GPS.

Carrow Lake ne commence pas au panneau d’entrée.

Elle commence quand tu acceptes de jouer à son jeu.`}],next:'crowd_waits'},
      reply_7d:{type:'dialogue',bg:'giantTree',audio:'giantTree',lines:[{speaker:'LOU',text:`C’est peut-être exactement ce qu’il veut.

Mais si la ville le retrouve avant nous, elle ne cherchera pas à comprendre.

Elle l’enfermera. Elle mentira. Et tout recommencera.`}],next:'crowd_waits'},
      crowd_waits:{
        type:'narrative',
        bg:'giantTree',
        audio:'hunt',
        lines:[
          `Un craquement retentit derrière les ronces.

Puis un deuxième.

Elyos se retourne.`,
          `Entre les branches, des dizaines de silhouettes apparaissent.

La population est là.

Elle ne traverse toujours pas. Elle attend.`,
          `Tous les habitants regardent l’arbre géant.

Pas Lou.

Pas Elyos.

L’arbre.`,
          `Le téléphone d’Elyos vibre encore.

L’écran s’allume tout seul.`
        ],
        next:'sms_doubt'
      },
      sms_doubt:{
        type:'sms',
        sender:'Inconnu',
        bg:'giantTree',
        audio:'hunt',
        messages:[{side:'in',text:`Tu l’as retrouvée.

Bien.

Maintenant, demande-lui pourquoi elle connaît aussi bien les chemins interdits.`}],
        choices:[
          {key:'A',text:'Montrer immédiatement le message à Lou.',out:'Regarde ça.',send:false,next:'reply_8a'},
          {key:'B',text:'Cacher le téléphone et demander directement à Lou pourquoi elle connaît ces chemins.',out:'Pourquoi tu connais ces chemins ?',send:false,next:'reply_8b'},
          {key:'C',text:'Ne rien dire pour voir si Lou réagit toute seule.',out:'...',send:false,next:'reply_8c'}
        ]
      },
      reply_8a:{type:'dialogue',bg:'giantTree',audio:'giantTree',lines:[{speaker:'LOU',text:`Il veut que tu doutes de moi.

Mais il n’a pas complètement tort.`}],next:'brother'},
      reply_8b:{type:'dialogue',bg:'giantTree',audio:'giantTree',lines:[{speaker:'LOU',text:`Parce que mon frère est mort ici.

Et parce que je n’ai jamais cru à la version officielle.`}],next:'brother'},
      reply_8c:{type:'dialogue',bg:'giantTree',audio:'giantTree',lines:[{speaker:'LOU',text:`Il t’a encore écrit, pas vrai ?

Alors il a dû te dire de douter de moi.`}],next:'brother'},
      brother:{
        type:'dialogue',
        bg:'giantTree',
        audio:'giantTree',
        lines:[
          {speaker:'LOU',text:`Mon frère faisait partie des disparus de la première Chasse.

La ville a dit qu’il s’était perdu. Qu’il avait paniqué. Qu’il était tombé dans le ravin.`},
          {speaker:'LOU',text:`Mais au cimetière, son cercueil était presque vide.

Il n’y avait que sa veste.

Et son téléphone.`},
          {speaker:'LOU',text:`Son dernier message disait :

“Je suis arrivé à l’arbre. Lou, ne fais confiance à personne qui parle avec ta voix.”`}
        ],
        next:'old_tree'
      },
      old_tree:{
        type:'narrative',
        bg:'giantTree',
        audio:'giantTree',
        lines:[
          `Le vent s’arrête.

Même les feuilles cessent de bouger.`,
          `Elyos sent une pression étrange contre ses tympans.

Comme si la forêt retenait son souffle.`,
          `Au-delà de l’arbre, l’asphalte disparaît dans une obscurité encore plus dense.

Aucune lumière rouge là-bas.

Aucun pas.

Seulement le noir.`
        ],
        next:'lou_goal'
      },
      lou_goal:{
        type:'dialogue',
        bg:'giantTree',
        audio:'giantTree',
        lines:[
          {speaker:'LOU',text:`Le psychopathe s’est enfui ce matin.

La ville veut le retrouver.

L’Inconnu veut que tu le rejoignes.

La fausse Lou voulait te tester.

Et moi…`},
          {speaker:'LOU',text:`Moi, je veux savoir pourquoi mon frère est mort en essayant d’atteindre cette route.`}
        ],
        next:'final_choice'
      },
      final_choice:{
        type:'choice',
        bg:'giantTree',
        audio:'giantTree',
        prompt:'Que fait Elyos ?',
        choices:[
          {key:'A',text:'Accepter de suivre Lou sur la Route forestière interdite.',next:'forbidden_road'},
          {key:'B',text:'Refuser d’avancer sans un plan clair.',next:'forbidden_road'},
          {key:'C',text:'Dire à Lou qu’il veut d’abord comprendre qui était vraiment son frère.',next:'forbidden_road'},
          {key:'D',text:'Regarder une dernière fois la population derrière les ronces.',next:'forbidden_road'}
        ]
      },
      forbidden_road:{
        type:'narrative',
        bg:'giantTree',
        audio:'silence',
        progress:'scene5_forbidden_road',
        lines:[
          `Quel que soit son choix, Elyos sait qu’il n’a plus de vraie échappatoire.

Derrière lui, la ville attend.

Devant lui, la route interdite s’enfonce vers Northgate.`,
          `Lou ramasse une vieille lampe tempête cachée entre les racines.

La flamme à l’intérieur n’est pas rouge.

Elle est blanche.

Faible. Tremblante. Mais réelle.`,
          `Elle la tend à Elyos.

“À partir d’ici, ton téléphone va mentir plus souvent que tes yeux.”`,
          `Elyos prend la lampe.

Au même moment, la foule derrière les ronces se met à murmurer.

“Elyos...”

“Elyos...”

“Elyos...”`,
          `Lou serre la mâchoire.

“Ne te retourne plus.”`,
          `Ils franchissent ensemble la limite de l’arbre géant.

Dès qu’Elyos pose le pied sur la Route forestière interdite, son téléphone s’éteint.

La sirène s’arrête.

Les murmures disparaissent.`,
          `Et dans le silence absolu qui suit, une voix d’homme résonne quelque part devant eux, très loin dans le noir.

“Enfin.”`
        ],
        next:'coming_scene_6'
      },
      coming_scene_6:{
        type:'coming',
        bg:'giantTree',
        audio:'silence',
        nextScene:6
      }
    }
  }
};
