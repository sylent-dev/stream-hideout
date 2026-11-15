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

Each panel has a title, an optional image, a link for the image, and a description written in Markdown (no HTML). An image weighs at most 1 MB and measures at most 320 × 600 px, or Twitch resizes it. The links stay in the descriptions too, so that they work whatever the image.

To edit them, on the page of the channel, click **Éditer les panneaux** at the bottom left of the video player, fill a panel, click **Envoyer**, and **+** for the next one. Click **Éditer les panneaux** again to see the result, and check that the lists and the links render.

Order: À propos, Exile Market, Règles du chat.

### Images

| Panel | Image | Link of the image |
|---|---|---|
| À propos | [`assets/panels/about.png`](../../assets/panels/about.png) | none |
| Exile Market | [`assets/panels/exile-market.png`](../../assets/panels/exile-market.png) | `https://exile-market.sylent.tools/` |
| Règles du chat | [`assets/panels/chat-rules.png`](../../assets/panels/chat-rules.png) | none |

Chosen by the owner on 2026-11-15 in the mock-up [`docs/mockups/panels.html`](../mockups/panels.html) (skill `html-mockups`, served with `python3 .claude/skills/html-mockups/assets/serve.py 8790`):

- **Style**: proposal 9 « Bulle foudroyée », the explosive one, for the three panels: the background of the scenes `pause` and `end` (black, a red glow from the top right, the floor in perspective at opacity 0.3, the red line of the horizon), a drawing in white lines in the middle.
- **Drawings**: a chat bubble struck by a red bolt (Règles du chat); the Sylent emblem in white (À propos) and the emblem of Exile Market in its red (Exile Market), at 0.55 of the bubble's size, without a bolt.
- **Size**: 320 × 120 px, the width Twitch shows; a wider image would only be shrunk by Twitch.
- **No title on the image, no rain**: the panel's title field carries the title.
- Set aside: the titles drawn in the images (1 to 8, 10), the rain, white or red, and the bolts over or around the logos (11 to 14).

To export them again after a change: open the page at real size (`?zoom=1`), with the address of the choices above, and take a screenshot of each frame (`.pnl-frame[data-number="9"]`, `15`, `16`) with Playwright at a device scale of 1, cropped to 320 × 120.

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

## Offline image and profile banner

| Image | File | Size |
|---|---|---|
| Offline image (what the video player shows when the channel isn't live) | [`assets/channel/offline-image.png`](../../assets/channel/offline-image.png) | 2560 × 1440 |
| Profile banner | [`assets/channel/profile-banner.png`](../../assets/channel/profile-banner.png) | 1200 × 480 |

Chosen by the owner on 2026-11-15 in the mock-up [`docs/mockups/channel-images.html`](../mockups/channel-images.html) (skill `html-mockups`, served with `python3 .claude/skills/html-mockups/assets/serve.py 8790`); their texts are in [`twitch-images.js`](twitch-images.js):

- **Offline image**: proposal 8, the layout of the scene `end` over a still « Pluie de sang », without lightning and without the rings where the drops land: « Sylent est hors ligne » (« ligne » in red), « Il farme dans l’ombre… », and at the bottom the link of Exile Market with the Grinding Gear Games disclaimer, taken from [`overlays/screens/texts.js`](../../overlays/screens/texts.js). The size of the OBS canvas, as the owner asked.
- **Profile banner**: proposal 9, the SYLENT logo of the owner in white ([`assets/logos/sylent-wordmark.png`](../../assets/logos/sylent-wordmark.png)), centered, with « Chill et craft » in italics, so that the channel isn't tied to one game; no emblem. The sizes Twitch asks for weren't read on its settings page (its help center doesn't load for an automated reading): check them when uploading.
- Set aside: the white and red lightning with a giant word (2, 3, 6), the name « SylentExile » in text (4 to 7), the Sylent emblem (5) and the Exile Market showcase on the banner (7).

To export them again after a change: open the page with `?only=8` (or `9`), with the address of the choices above, and take a screenshot with Playwright at the size of the image (`.claude/skills/html-mockups/scripts/screenshot.sh <url> <output.png> 2560 1440`, or `1200 480`).
