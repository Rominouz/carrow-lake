window.CL_STORY_SCENES=window.CL_STORY_SCENES||{};

window.CL_STORY_SCENES[4]={
  title:'SCÈNE 4 — LA FORÊT NOIRE',
  backgrounds:{
    cemetery:'./assets/scenes/04/scene-04-cemetery.webp',
    forest:'./assets/scenes/04/scene-04-forest.webp',
    overlook:'./assets/scenes/04/scene-04-overlook.webp',
    cave:'./assets/scenes/04/scene-04-cave.webp'
  },
  intro:[
    `Le silence du cimetière n'est brisé que par le bruissement du vent dans les ifs. La brume s'enroule autour des chevilles d'Elyos.`,
    `Soudain, un sanglot étouffé attire son attention.\n\nÀ quelques mètres, une silhouette est agenouillée devant une vieille tombe.`,
    `C'est une jeune femme. Ses longs cheveux blonds cascadent sur une robe simple à motifs floraux qui tranche avec la froideur des lieux.`
  ],
  approach:{
    prompt:`Que décide Elyos ?`,
    choices:[
      {key:'A',text:`L'approcher doucement dans le noir pour ne pas l'effrayer davantage.`},
      {key:'B',text:`Braquer directement la lampe torche sur elle pour s'assurer que ce n'est pas un piège.`}
    ],
    A:{
      narrative:[
        `Elyos fait attention où il pose les pieds. Mais le sol du cimetière est traître.\n\nUne branche craque lourdement.`,
        `La femme sursaute et se retourne, les larmes aux yeux. Elle porte de petites lunettes rondes crème et or qui lui donnent un charme désuet.`
      ],
      lou:`Mon Dieu... Vous m'avez fait une peur bleue. Les vivants ne viennent jamais ici la nuit.`
    },
    B:{
      narrative:[
        `Le faisceau aveuglant frappe la jeune femme. Elle pousse un petit cri et lève les mains pour se protéger les yeux.`,
        `Dans le mouvement, Elyos aperçoit de petites lunettes rondes crème et or.`
      ],
      lou:`Éteignez ça, je vous en supplie ! Vous m'avez terrifiée... Qui êtes-vous pour rôder ici avec cette lumière ?`
    }
  },
  choice2:{
    prompt:`Que répond Elyos ?`,
    choices:[
      {key:'A',text:`Je m'appelle Elyos. Désolé. Je cherchais quelqu'un qui me harcèle depuis mon arrivée. Que faites-vous ici toute seule ?`},
      {key:'B',text:`C'est plutôt à moi de poser la question. Il y a un psychopathe en ville, ce n'est pas un endroit pour une femme seule.`}
    ],
    A:`Un harceleur ? À Carrow Lake, ce sont souvent les fantômes de notre propre esprit qui nous poursuivent... Je m'appelle Lou. Je venais voir mon petit frère. Le silence m'apaise.`,
    B:`Je n'ai pas besoin d'être sauvée, Monsieur. Je connais Carrow Lake mieux que personne. Je m'appelle Lou. Et mon frère est enterré ici.`
  },
  commonChoice:{
    prompt:`La conversation continue.`,
    text:`Je suis venu pour le trail. Pour me vider la tête. Mais cette ville me rend paranoïaque.`,
    lou:`Du trail ? Vous êtes courageux. Ou inconscient. Les sentiers d'ici sont vivants. Si vous y allez seul demain matin, la brume vous avalera.\n\nRetrouvez-moi à 8h devant le Café du Port. Je vous guiderai. Ne retournez pas à l'hôtel par la route... passez par la lisière du bois.`
  },
  morningExit:[
    `Elle se lève, époussette sa robe florale, et s'évanouit dans le brouillard avant qu'Elyos ne puisse ajouter un mot.`,
  ],
  morning:[
    `Le lendemain matin. 08:00. Devant le Café du Port.`,
    `Le ciel est bas, d'un gris métallique. Elyos s'étire.`,
    `Lou arrive ponctuelle, mais elle est méconnaissable. Adieu la robe florale. Elle porte un survêtement noir technique, une casquette sombre, et ses cheveux sont tirés en une queue de cheval serrée.`,
    `Elle a l'allure d'une athlète de haut niveau.`
  ],
  choice3:{
    prompt:`Que dit Elyos ?`,
    choices:[
      {key:'A',text:`Impressionnant le changement de tenue. Prête à me montrer ce que vous valez sur le terrain ?`},
      {key:'B',text:`Vous êtes sûre pour cette course ? Après la nuit dernière, s'enfoncer dans les bois me paraît être une mauvaise idée.`}
    ],
    A:`Ne me sous-estimez pas, Elyos. Le terrain de Carrow Lake ne pardonne pas les erreurs. Gardez votre souffle, vous en aurez besoin.`,
    B:`La forêt est plus sûre que les murs de cette ville, Elyos. Restez près de moi et tout ira bien.`
  },
  run:[
    `Le rythme est intense. Leurs foulées résonnent en chœur sur la terre humide. Elyos apprécie l'effort.`,
    `L'odeur d'humus et de pin emplit ses poumons. Ils croisent d'immenses fougères dont les spores s'élèvent en nuages dorés à leur passage.`,
    `L'observation de la nature le calme, son esprit de biologiste amateur analysant machinalement la flore étrangement préservée du sous-bois.`,
    `Puis, après quarante minutes d'ascension, la forêt s'assombrit.`,
    `Lou s'arrête net et tend le bras pour bloquer Elyos.\n\n« Chut. »`,
    `Une voix s'élève en contrebas. Une plainte féminine, tremblante et faible.\n\n« À l'aide... S'il vous plaît... Ma jambe est coincée... »`,
    `La voix provient du Gouffre des Murmures, une faille rocheuse sombre à flanc de ravin.`,
    `Lou saisit le poignet d'Elyos. Sa poigne est d'une force inattendue.`
  ],
  choice4:{
    prompt:`Lou veut repartir immédiatement.`,
    choices:[
      {key:'A',text:`Tu es complètement folle Lou ! C'est une femme blessée, je l'entends très bien !`},
      {key:'B',text:`Comment ça la forêt "imite" ? Sois rationnelle deux secondes, il faut aller vérifier !`}
    ],
    lou:`Si vous descendez, vous n'en remonterez jamais ! Je vous en supplie Elyos, courez avec moi !`
  },
  finalPrompt:[
    `La plainte résonne à nouveau, plus déchirante.`,
    `L'instinct d'Elyos est tiraillé entre l'empathie et le malaise profond que dégage cette forêt.`
  ],
  finalChoice:{
    prompt:`Que décide Elyos ?`,
    choices:[
      {key:'cave',text:`Ignorer Lou, s'écarter du chemin et descendre dans le gouffre pour sauver la victime.`},
      {key:'bag',text:`Ne prendre aucun risque, faire confiance à la terreur de Lou et reprendre la course à toute vitesse.`}
    ]
  },
  cave:{
    intro:[
      `"Désolé Lou, mais je ne laisse personne crever ici", lâche Elyos.`,
      `Il s'arrache à l'emprise de la jeune femme et s'élance dans la pente rocailleuse. Derrière lui, Lou pousse un cri de désespoir avant que le silence de la forêt ne reprenne ses droits.`,
      `La descente est technique. Elyos doit se fier à son expérience d'escalade. Il analyse la paroi, cherche des prises viables sur cette roche humide recouverte de mousse, calculant chaque point d'adhérence pour ne pas glisser dans les abysses.`,
      `Il pénètre dans l'étroite ouverture. L'obscurité est suffocante. L'air empeste la moisissure et un étrange parfum cuivré.`,
      `"Je suis là ! Continuez de me parler !" crie-t-il.`,
      `« Par ici... j'ai si froid... » répond la voix. Elle semble résonner de partout à la fois.`
    ],
    choice:{
      prompt:`Dans la grotte, Elyos décide de :`,
      choices:[
        {key:'A',text:`Allumer immédiatement la lampe torche de son téléphone pour y voir clair.`},
        {key:'B',text:`Garder son téléphone éteint pour préserver sa batterie et avancer à tâtons en suivant le son.`}
      ]
    },
    reveal:[
      `La lumière — ou une lueur blafarde venue d'une faille au plafond — révèle enfin la victime.`,
      `Elle est recroquevillée au fond du boyau, le visage caché par des cheveux sombres et poisseux, portant des haillons informes.`,
      `"Ne bougez plus, je vais vous soulever", murmure Elyos en s'agenouillant, le cœur battant.`,
      `Il pose sa main sur l'épaule de la femme. La chair sous le tissu est glaciale. Dure comme de la pierre.`,
      `Lentement, la tête se relève.\n\nLes cheveux glissent en arrière.`,
      `Elyos sent ses poumons se vider d'air.`,
      `Il n'y a pas de visage.\n\nJuste une étendue de peau blanche, maladivement lisse. Et au centre, un unique œil.`,
      `Le même œil qui le fixait à travers la vitre du restaurant.`,
      `La chose pousse un gloussement aigu, un bruit qui n'a rien d'humain. Elle se jette en avant, bloquant la sortie avec une agilité cauchemardesque.`,
      `Dans la poche d'Elyos, le téléphone vibre. Une notification s'affiche sur l'écran verrouillé :\n\nInconnu : "Je t'avais dit que tu finirais par la rejoindre, Elyos."`,
      `Les ténèbres engloutissent la grotte.`
    ],
    escape:[
      `La chose à un seul œil pousse un gloussement aigu, un bruit qui n'a rien d'humain. Elle se jette en avant.`,
      `L'instinct de survie prend le pas sur la terreur. L'expérience de grimpeur d'Elyos s'active machinalement.`,
      `Au lieu de reculer bêtement et de trébucher, il pivote, trouve une infime prise sur la paroi suintante et se propulse sur le côté.`,
      `La créature s'écrase contre la roche là où il se trouvait une fraction de seconde plus tôt.`,
      `Elyos ne réfléchit plus. Il s'engouffre plus profondément dans la grotte, cherchant une autre issue.`,
      `L'obscurité est totale. Il court à l'aveugle, les mains écorchées par les murs de pierre. Derrière lui, un frottement humide et rapide résonne sur les parois.`,
      `Il arrive dans un cul-de-sac. Mais au-dessus de lui, un mince filet de lumière grise filtre à travers un conduit naturel très étroit, bloqué par des racines entremêlées.`,
      `« Je te vois... » siffle la voix dans son dos, toute proche.`,
      `Elyos bondit. Il cale son dos contre une paroi, ses pieds contre l'autre, et commence une ascension fulgurante en opposition dans la cheminée de pierre.`,
      `Une main poisseuse lui effleure la cheville. Il donne un violent coup de pied vers le bas, arrache les racines à mains nues, et s'extirpe de la terre avec un cri d'effort.`,
      `Il roule dans la boue à la surface, se relève d'un bond et se met à courir à travers la forêt sans un regard en arrière.`
    ]
  },
  bag:{
    intro:[
      `Elyos jette un dernier regard vers le gouffre, les mâchoires serrées.`,
      `"Tu as raison", dit-il à Lou. "On s'arrache. Tout de suite."`,
      `Ils reprennent la course à un rythme effréné. L'adrénaline efface la fatigue. Elyos a l'impression que la plainte dans le gouffre s'est transformée en un hurlement de rage, avant de se perdre dans le vent.`,
      `Ils bifurquent sur un sentier abandonné, envahi par les ronces. Le brouillard s'épaissit de nouveau.`,
      `Soudain, Elyos trébuche et dérape dans la boue. Il se rattrape de justesse à un tronc d'arbre. Il regarde ce qui a accroché son pied.`,
      `Au milieu du sentier gît un énorme sac de randonnée kaki.`,
      `Sous le tissu, le sol est détrempé. Pas par l'eau. Une large tache de sang écarlate, encore fraîche, s'étale sur la terre retournée.`,
      `Lou s'est arrêtée un peu plus loin. Elle tourne le dos à Elyos, la tête baissée.`
    ],
    choice:{
      prompt:`Devant le sac, Elyos décide de :`,
      choices:[
        {key:'A',text:`Analyser le sol autour du sac à la recherche d'empreintes ou de signes de lutte.`},
        {key:'B',text:`Tirer immédiatement la fermeture éclair du sac pour voir ce qu'il contient.`}
      ]
    },
    reveal:[
      `Elyos s'agenouille. Ses mains tremblent lorsqu'il saisit la fermeture éclair du sac.`,
      `"Lou... il y a du sang partout. Il faut qu'on appelle la police. On doit redescendre en ville."`,
      `Il n'y a aucune réponse.`,
      `Le bruit mécanique de la fermeture éclair déchire le silence. Le sac s'ouvre.`,
      `À l'intérieur, par-dessus des vêtements lacérés, se trouve un téléphone portable de la même marque que celui d'Elyos. L'écran est allumé sur l'application Notes.`,
      `Un frisson glacial parcourt la colonne vertébrale d'Elyos lorsqu'il lit le texte écrit en lettres capitales :`,
      `IL Y A DEUX LOU.\nLA VRAIE PORTE TOUJOURS UNE ROBE À FLEURS.\nNE PARLE JAMAIS À CELLE QUI PORTE DU NOIR.`,
      `Elyos lâche le sac. Sa respiration se bloque.`,
      `Lentement, avec l'impression de bouger au ralenti, il relève la tête vers son accompagnatrice.`,
      `Lou s'est retournée. Elle a enlevé ses lunettes crème et or. Ses yeux bleus ont disparu, remplacés par des globes d'un noir d'encre.`,
      `Elle porte toujours son survêtement noir. Et sur son visage s'étire un sourire physiquement impossible, qui remonte presque jusqu'à ses oreilles.`,
      `"Tu aurais dû écouter la voix dans la grotte, Elyos", murmure la chose avec la voix de Lou.`
    ],
    escape:[
      `"Tu aurais dû écouter la voix dans la grotte, Elyos", murmure la fausse Lou, son sourire s'étirant de manière physiquement impossible.`,
      `Ses globes oculaires noirs d'encre fixent Elyos. Puis, sa mâchoire se décroche dans un craquement sinistre.`,
      `Elle s'élance. Elle ne court pas comme une humaine : ses mouvements sont saccadés, ses membres se plient à des angles contre-nature, mais sa vitesse est terrifiante.`,
      `D'un réflexe désespéré, Elyos attrape le lourd sac ensanglanté et le lance de toutes ses forces dans les jambes de la créature. La chose trébuche avec un feulement de bête.`,
      `Elyos ne demande pas son reste. Il fait demi-tour et sprinte. C'est une fuite aveugle hors des sentiers battus.`,
      `Il dévale les pentes recouvertes de feuilles mortes, sautant par-dessus des troncs pourris. Ses poumons brûlent. Derrière lui, le craquement des branches indique que la fausse Lou le rattrape inexorablement.`,
      `Il s'engouffre dans une ravine très dense, tapissée de fougères vivaces géantes. Les spores dorées se soulèvent en épais nuages à son passage, brouillant la vision.`,
      `Il se jette à plat ventre derrière un énorme tronc d'arbre abattu, retenant sa respiration jusqu'à ce que ses tempes palpitent douloureusement.`,
      `Les bruits de pas s'arrêtent juste de l'autre côté du tronc. Elyos ferme les yeux. Il entend un reniflement humide, tout proche.`,
      `Soudain, la chose pousse un hurlement strident de frustration, avant de reprendre sa course folle un peu plus loin, le perdant de vue dans les immenses herbes.`,
      `Elyos rampe hors de sa cachette et s'éloigne à pas de loup dans la direction opposée, le cœur au bord des lèvres.`
    ]
  },
  conclusion:[
    `Qu'il vienne de s'arracher in extremis au boyau de pierre ou d'échapper à la traque dans les fougères, Elyos est à bout de forces.`,
    `Il titube entre les derniers arbres et débouche brutalement à découvert.`,
    `Il se trouve sur une corniche rocheuse, à la lisière de la forêt. En contrebas, la ville de Carrow Lake s'étend, silencieuse, prisonnière du brouillard matinal.`,
    `Il s'effondre à genoux. Le vent glacial sèche la sueur sur son front.`,
    `Un craquement sinistre résonne juste derrière lui. La chose l'a retrouvé. Elle s'avance lentement vers lui pour l'achever. Elyos n'a plus nulle part où fuir. Le vide est devant lui.`,
    `Mais à la seconde exacte où l'entité s'apprête à bondir...`,
    `Un hurlement mécanique déchire l'air lourd de la forêt.`,
    `Une sirène.\n\nGrave, rouillée, assourdissante. Le son lugubre d'une vieille alarme municipale s'élève depuis le centre-ville, répercutant son écho macabre contre la montagne.`,
    `La réaction est immédiate. L'abomination s'immobilise instantanément, comme frappée par la foudre.`,
    `Son corps se désarticule, la tête penchée d'une manière absurde en direction de la vallée. Elle a totalement oublié Elyos.`,
    `Ses mouvements deviennent lents, presque robotiques. Elle tourne les talons et s'enfonce dans l'obscurité des bois, rappelée par le son de la sirène.`,
    `Le souffle court, les mains tremblantes, Elyos plonge dans sa poche et sort son téléphone.`,
    `L'écran est fêlé, couvert de terre, mais la batterie affiche curieusement 100 %.\n\nEt l'horloge indique une heure impossible : 00:00.`,
    `Une nouvelle notification apparaît. Ce n'est plus l'Inconnu.\n\nC'est un numéro qu'il ne connaît pas, enregistré sous un nom qui vient de s'ajouter tout seul dans son répertoire.`
  ],
  sms:{
    sender:'La Vraie Lou (?)',
    text:`Ne descends pas en ville Elyos.\nLa sirène ne sonne pas pour nous.\nElle sonne pour annoncer que la Chasse a commencé.\nCache-toi.`
  },
  afterSms:[
    `Elyos frissonne. Il lève les yeux de son écran pour observer la ville en contrebas.`,
    `Une à une, de manière parfaitement synchronisée, toutes les lumières des maisons et des lampadaires de Carrow Lake s'allument.`,
    `Mais elles ne sont pas jaunes.\n\nElles brillent toutes d'une lueur d'un rouge sang écarlate.`,
    `Et depuis le fond de la vallée, un bruit sourd commence à monter vers lui.`,
    `Le bruit d'une multitude de pas marchant au même rythme sur le goudron, se dirigeant droit vers la montagne.`,
    `La ville entière semble s'être réveillée.`
  ]
};
