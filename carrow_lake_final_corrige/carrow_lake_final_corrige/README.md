# Carrow Lake

Ouvre `index.html` pour lancer le jeu.

Organisation :

- `index.html` : la page principale.
- `css/style.css` : l'apparence du jeu.
- `js/app.js` : le moteur du menu, des SMS et de la narration.
- `scenes/scene-02.js` : le texte et les fonds de la scene 2.
- `scenes/scene-03.js` : la scene 3 hybride, avec SMS, narration, choix et ambiance sonore.
- `scenes/_modele-scene.js` : un modele a copier pour creer une nouvelle scene.

Astuce de test : ouvre `index.html#scene3` pour demarrer directement a la scene 3.

La sauvegarde automatique fonctionne dans un navigateur normal avec `localStorage`.
La scene 1 utilise maintenant le meme telephone que la scene 3, et la scene 2 a une ambiance sonore de soiree.
Les statuts affichent `REMIS` sous les messages du joueur, sauf le choix special `[Vu]`.

Pour ajouter une nouvelle scene, copie `scenes/_modele-scene.js`, renomme-la par exemple `scene-03.js`, puis ajoute une ligne dans `index.html` avant `js/app.js` :

```html
<script src="scenes/scene-03.js"></script>
```

Dans le nouveau fichier, garde ou change le numero `window.CL_SCENES[3]` selon la scene.
