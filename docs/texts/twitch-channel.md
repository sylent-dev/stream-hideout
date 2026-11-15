# Twitch channel

The texts of the channel **SylentExile** that the viewers read: the stream info (title, category, tags), the bio and the panels, written in French. Each text is in a block, ready to copy into Twitch's form.

The limits come from the documentation of Twitch's API, read on 2026-11-15: [Modify Channel Information](https://dev.twitch.tv/docs/api/reference/channels) for the title and the tags, [Update User](https://dev.twitch.tv/docs/api/reference/users) for the bio. Those of the panels come from the help article [Modifier les panneaux d’informations](https://help.twitch.tv/s/article/how-to-edit-info-panels?language=fr), copied by the owner on the same day, since the help center doesn't load for an automated reading.

The texts keep French typography: the spaces before `:`, `!`, `?`, `;` and inside « » are non-breaking spaces (U+00A0), and copying a block keeps them.

## Stream info

### Title

At most 140 characters. This one has 43, and stays the same from one live to the next.

```text
[FR] PoE2 – Still grinding | Chill et craft
```

### Category and language

- Category: **Path of Exile 2**.
- Stream language: **Français**.

### Tags

At most 10 tags, of 25 characters each, with no space nor special character. Twitch doesn't say which characters count as special: if it refuses the « ç » of `Français`, write `Francais`.

```text
Français
PathofExile2
PoE2
ARPG
HackAndSlash
Chill
Craft
PriceCheck
OpenSource
Linux
```

## Bio

At most 300 characters, with no line break: Twitch removes them. This one has 271.

```text
Joueur de Path of Exile 2 depuis le début de l’accès anticipé, je me lance dans le streaming pour la sortie de la 1.0. Développeur et joueur dans l’âme, je crée Exile Market, un price checker gratuit pour PoE2. Ici pour grind dans une ambiance chill, sauf quand je meurs.
```

The 1.0 of Path of Exile 2 comes out on 2026-12-11 ([RPG Site](https://www.rpgsite.net/news/21188-path-exile-2-reaches-its-10-full-release-on-december-11)): read the bio again after that date, since « je me lance pour la sortie de la 1.0 » will then speak of the past.

## Panels

Each panel has a title, an optional image, a link for the image, and a description written in Markdown (no HTML). An image weighs at most 1 MB and measures at most 320 × 600 px, or Twitch resizes it. The panels of the first live have no image: the link of the image field works only with an image, so the links are in the descriptions.

To edit them, on the page of the channel, click **Éditer les panneaux** at the bottom left of the video player, fill a panel, click **Envoyer**, and **+** for the next one. Click **Éditer les panneaux** again to see the result, and check that the lists and the links render.

Order: À propos, Exile Market, Règles du chat, Setup.

### À propos

Title:

```text
À propos
```

Description:

```markdown
Je joue aux hack and slash depuis toujours, et à Path of Exile 2 depuis le début de l’accès anticipé, en décembre 2024. Ce qui m’a accroché, c’est sa profondeur, rare dans le genre.

Sur la chaîne, on joue posé : on réfléchit au craft (même si je ne suis pas un expert), on rigole, et on ne crie pas… sauf quand je meurs.

Je suis aussi développeur : je crée **Exile Market**, le price checker que tu vois à l’écran. Tout est dans le panneau d’à côté.
```

### Exile Market

The description follows the [README of Exile Market](https://github.com/sylent-dev/rust-exile-market#readme) and states no feature it doesn't have. It keeps the warning on the risk for the account, which the README gives too, and the disclaimer of Grinding Gear Games, worded as on the scene `end` ([`overlays/screens/texts.js`](../../overlays/screens/texts.js)).

Title:

```text
Exile Market
```

Description:

```markdown
**Exile Market** est mon price checker pour Path of Exile 2, gratuit et open source (GPL-3.0).

- Copie un objet dans le jeu, ou fais Ctrl + D dessus : son prix s’affiche par-dessus le jeu.
- Monnaies et uniques : leur prix tout de suite. Objets rares, magiques et normaux : leurs stats à cocher, les offres semblables du site de trade et un prix estimé.
- Sous Windows et Linux, pour le jeu en français ou en anglais.

C’est une pré-alpha : attends-toi à des bugs, et signale-les avec l’icône de bug de sa barre de titre.

**Attention :** la recherche sur le site de trade passe par une interface que Grinding Gear Games ne documente pas, ce qui va contre la section 7i de leurs conditions d’utilisation. Tu l’utilises à tes risques ([détails, en anglais](https://github.com/sylent-dev/rust-exile-market#what-it-connects-to)).

[exile-market.sylent.tools](https://exile-market.sylent.tools/)

*Ce produit n’est ni affilié à Grinding Gear Games ni approuvé par ce studio, de quelque manière que ce soit.*
```

### Règles du chat

Title:

```text
Règles du chat
```

Description:

```markdown
Ici, on reste chill :

1. Bienveillance avec tout le monde, débutants compris.
2. Les conseils de craft et de build sont les bienvenus, les ordres un peu moins.
3. Pas de pub ni de liens sans qu’on te les demande.
4. Pas de politique ni de sujets qui fâchent.
5. On parle français, mais l’anglais est bienvenu aussi.
```

### Setup

The figures come from the inventory of [`docs/hardware.md`](../hardware.md) and the OBS setup of [`docs/obs-setup.md`](../obs-setup.md) and [`docs/obs-output.md`](../obs-output.md).

Title:

```text
Setup
```

Description:

```markdown
Je streame sous Linux, et toute la config du stream est publique : [stream-hideout](https://github.com/sylent-dev/stream-hideout).

- **PC :** AMD Ryzen 7 9700X, Radeon RX 9070 XT, 32 Go de RAM
- **Système :** Bazzite (KDE Plasma, Wayland)
- **Stream :** OBS Studio 33 (Flatpak), encodage matériel par la carte graphique
- **Écrans :** 2 × iiyama 27 pouces en 2560 × 1440
- **Webcam :** OBSBOT Meet 2
- **Casque et micro :** HyperX Cloud III S Wireless
```
