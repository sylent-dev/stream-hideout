# Test de stream

Le guide du test de stream : un vrai live sur Twitch, d’au moins 30 minutes, pour vérifier ce que les spectateurs voient et entendent avant le premier live. Écrit le 2026-11-15 pour OBS 33.0.1 (Flatpak) sur Bazzite (KDE Plasma 6.8.2, Wayland), avec les réglages de [`obs-output.md`](obs-output.md), [`obs-capture.md`](obs-capture.md) et [`obs-scenes.md`](obs-scenes.md).

## Pourquoi en direct

Le test se fait en vrai direct, sans le mode test de bande passante (le suffixe `?bandwidthtest=true` ajouté à la clé de stream, qui envoie le stream à Twitch sans que la chaîne passe en direct, comme le fait OBS dans [`OAuth.cpp`](https://github.com/obsproject/obs-studio/blob/33.0.1/frontend/oauth/OAuth.cpp)) : la chaîne est nouvelle, personne ne la regarde encore (choix du propriétaire, 2026-11-15), et seul un vrai direct montre le lecteur de Twitch, le chat et les infos du stream.

Ce que ça implique : les followers reçoivent la notification de début de live, le live apparaît dans la catégorie Path of Exile 2, et il peut rester en VOD sur la chaîne.

## Ce que le test décide

| Question laissée par les étapes 4 à 6 | Tests | Si ce n’est pas bon |
|---|---|---|
| Le 900p60 à 6000 kbps tient en combat, et les prix d’Exile Market restent lisibles | 3, 4, 12 | repli en 720p60 à 4500 kbps ([`obs-output.md`](obs-output.md#1600--900-at-60-frames-per-second)) |
| La connexion à Twitch tient à l’heure d’un live | 1, 10 | Claude Code lit le log d’OBS (reconnexions, images perdues) |
| La voix passe au-dessus du jeu | 6 | le fader de `game-audio`, un filtre **Gain** sur `microphone` |
| RNNoise suffit, ou il faut une porte de bruit | 6 | un filtre **Noise Gate** sur `microphone` |
| La pluie de `pause` ne se change pas en blocs | 7 | moins de gouttes dans [`rain.js`](../overlays/screens/rain.js) (`count`) |
| Les pages à 30 ou à 60 images par seconde | 7 | le champ **FPS** de `pause-screen` et `end-screen` |
| La webcam devient verte souvent ou non | 5, 11 | à décider avec Claude Code |
| Le stream et l’enregistrement à la fois ne ralentissent pas le jeu | 10 | à décider avec Claude Code |

## Préparation

À l’heure habituelle de tes lives : le réseau n’est pas le même à toutes les heures.

1. Un téléphone avec l’application Twitch, le Wi-Fi coupé (en 4G ou 5G) : il regarde le stream comme un spectateur hors de ton réseau. Mets-y des écouteurs si tu en as, sinon le son au plus bas : le son du téléphone ne doit pas revenir dans le micro du casque.
2. Lance Path of Exile 2 depuis Steam, en plein écran fenêtré, sur l’écran de gauche (`DP-2`), puis Exile Market.
3. Lance OBS sur l’écran de droite (`DP-3`). Sa barre de titre montre `Profile: sylent` et `Scenes: sylent-exile`. Sélectionne la scène `game`.
4. **Docks → Stats** : la fenêtre des statistiques reste ouverte pendant tout le test.
5. Dans l’**Audio Mixer** : `microphone` pas en sourdine, fader à 0 dB ; `game-audio` à −2.5 dB.
6. Dans le navigateur, sur l’écran de droite, ouvre le Stream Manager de Twitch, pour le chat. Les infos du stream sont celles de [`texts/twitch-channel.md`](texts/twitch-channel.md) : le titre, la catégorie **Path of Exile 2**, la langue **Français**, les tags.
7. Note l’heure.
8. Dans OBS, clique **Start Streaming**, puis **Start Recording** : les deux à la fois, comme pendant un vrai live.

## Tests

1. **Connexion.** Dans la première minute, regarde la ligne **Stream** de **Stats**. Attendu : **Status** `LIVE`, **Bitrate** autour de 6000 kb/s, **Dropped Frames (Network)** à 0.
2. **Le live côté spectateur.** Sur le téléphone, ouvre la chaîne SylentExile. Attendu : le live s’affiche, avec le titre et la catégorie Path of Exile 2 ; dans les réglages de qualité du lecteur, la plus haute est en 900p à 60 images par seconde. Note les autres qualités proposées, s’il y en a. Tape dans tes mains devant la webcam et compte les secondes avant de le voir sur le téléphone : c’est le retard du stream.
3. **Image en combat.** Joue cinq minutes dans une zone chargée en effets, et regarde le téléphone en plein écran, à l’horizontale, dès que tu peux. Attendu : l’image est nette quand l’écran est calme ; pendant les explosions, des blocs peuvent apparaître un instant, mais le personnage, les monstres et le globe de vie restent lisibles.
4. **Prix d’Exile Market.** Ouvre le coffre et l’inventaire, survole un objet et appuie sur **Ctrl+D**. Attendu : sur le téléphone, la fenêtre de prix s’affiche, et son prix se lit.
5. **Webcam.** Regarde-la sur le téléphone. Attendu : un carré aux coins arrondis, avec son ombre ; tes lèvres suivent ta voix. Si elle devient verte ou se fige pendant le test, note l’heure, relance-la comme l’explique [`obs-scenes.md`](obs-scenes.md#the-webcam-v4l2-in-place-of-pipewire) (**Resolution** sur **1280x720**, **OK**, puis **1920x1080**, **OK**) et continue.
6. **Son.** Avec les écouteurs du téléphone, en combat, parle comme pendant un live. Attendu : la voix est claire au-dessus du jeu, sans grésillement, et le jeu s’entend encore. Puis tape sur le clavier dix secondes sans parler, et reste silencieux dix secondes. Attendu : le clavier et le souffle s’entendent à peine.
7. **Scène `pause`.** Clique `pause` et regarde une minute sur le téléphone. Attendu : « Petite pause » et son sous-titre se lisent ; la pluie tombe sans se changer en blocs, un éclair passe ; le son du jeu s’arrête, ta voix reste. Puis double-clique `pause-screen`, mets **FPS** à `60`, **OK**, et regarde encore une minute. Note laquelle des deux est la plus belle, puis remets `30` si tu ne vois pas de différence.
8. **Scène `end`.** Clique `end`. Attendu : sur le téléphone, « Merci d’avoir regardé ! », le lien d’Exile Market et la mention sur Grinding Gear Games se lisent.
9. **Chat.** Clique `game`. Depuis le téléphone, écris un message dans le chat. Attendu : il s’affiche dans le Stream Manager, sur l’écran de droite.
10. **Performances.** Joue jusqu’à 30 minutes au moins depuis le début du live, puis regarde **Stats**. Attendu : **Frames missed due to rendering lag** et **Skipped frames due to encoding lag** à 0 ou presque ; **Dropped Frames (Network)** à 0 ; le jeu n’a pas ralenti. Note les trois valeurs.
11. **Arrêt.** Clique **Stop Recording**, puis **Stop Streaming**. Attendu : un nouveau fichier `.mp4` dans `~/Videos/Streaming`. Laisse-le où il est : Claude Code le mesure sur place (le niveau de chaque piste, la saturation) et lit le log d’OBS de la session (reconnexions, images perdues, erreurs de la webcam).
12. **La VOD.** Si le live est resté en VOD sur la chaîne, regarde le passage du combat et celui du prix en plein écran, sur l’écran de droite. Attendu : comme aux tests 3 et 4, avec plus de détails qu’au téléphone. Si aucune VOD n’apparaît, note-le.
13. **Test libre** : tout ce qui t’a surpris (un écho, une voix métallique, un décalage entre le son et l’image, un texte trop petit, une notification à l’écran).

| Test | Résultat (OK / pas OK) | Note |
|---|---|---|
| 1. Connexion | | |
| 2. Le live côté spectateur | | |
| 3. Image en combat | | |
| 4. Prix d’Exile Market | | |
| 5. Webcam | | |
| 6. Son | | |
| 7. Scène `pause` | | |
| 8. Scène `end` | | |
| 9. Chat | | |
| 10. Performances | | |
| 11. Arrêt | | |
| 12. La VOD | | |
| 13. Test libre | | |

Les résultats reviennent dans la conversation ; ce tableau reste vide. Les réglages à corriger passent ensuite par une pull request à part, avant le premier live.
