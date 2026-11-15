# OBS scenes

The scenes of the first live, `game`, `pause` and `end`, and the export of the scene collection: part 4 of the OBS setup, after the capture in [`obs-capture.md`](obs-capture.md). Written on 2026-11-15 for OBS 33.0.1 (Flatpak) on Bazzite (KDE Plasma 6.8.2, Wayland), with the webcam of [`hardware.md`](hardware.md#webcam).

## Summary

The canvas is 2560 × 1440 ([`obs-output.md`](obs-output.md)); every position below is in pixels of the canvas. The scenes are named in English, like the sources (owner, 2026-11-15): the viewers never see these names.

| Scene | Sources, from front to back | What the viewers see and hear |
|---|---|---|
| `game` | `webcam-badge-sc`, `webcam-badge-ssf-sc`, `webcam-badge-hc`, `webcam-badge-ssf-hc`, `webcam`, `webcam-glow-hardcore`, `webcam-glow-softcore`, `game-audio`, `game-screen` | the left screen, the webcam in a 250 × 250 square with rounded corners, a red glow and badge in hardcore, blue in softcore; the game and the voice |
| `pause` | `pause-screen` | « Petite pause » over a dark rain, now and then a lightning; the voice only |
| `end` | `end-screen` | « Merci d’avoir regardé ! » over the same rain, the link of Exile Market and the Grinding Gear Games disclaimer; the voice only |

The microphone is a global device ([`obs-capture.md`](obs-capture.md#the-microphone-one-source-three-filters)): it plays in every scene, `pause` included. The owner mutes it in the **Audio Mixer** when leaving the desk. The game's sound stops by itself outside `game`, since `game-audio` is in that scene only.

The scene collection is named `sylent-exile` and exported to [`obs/sylent-exile.json`](../obs/sylent-exile.json).

## Why these choices

### The webcam: V4L2 in place of PipeWire

The webcam was a **Video Capture Device (PipeWire)** in 640 × 360 at 20 fps. That source lists only the uncompressed formats of a camera: in [`camera-portal.c`](https://github.com/obsproject/obs-studio/blob/33.0.1/plugins/linux-pipewire/camera-portal.c), any format other than `SPA_MEDIA_SUBTYPE_raw` is skipped. The OBSBOT Meet 2 sends 1920 × 1080 only in MJPEG (each picture compressed by the camera, like a JPEG photo, so that a large picture fits through the USB), and its uncompressed format stops at 640 × 480 ([`hardware.md`](hardware.md#webcam)).

**Video Capture Device (V4L2)** decodes MJPEG ([`v4l2-decoder.c`](https://github.com/obsproject/obs-studio/blob/33.0.1/plugins/linux-v4l2/v4l2-decoder.c)), and the Flatpak of OBS can open the camera (`devices=all` in its permissions). It is set to 1920 × 1080. A camera can be opened by one source at a time: the PipeWire source is removed first.

The frame rate stays the camera's own, 60 fps: in OBS 33.0.1, the list **Frame Rate** of this source can't set another one. It stores each entry in an `int` (`int pack = v4l2_pack_tuple(…)` in `v4l2_framerate_list`, [`v4l2-input.c`](https://github.com/obsproject/obs-studio/blob/33.0.1/plugins/linux-v4l2/v4l2-input.c)), which cuts the 64-bit value: « 30.00 » is saved as `30`, read back as 0/30 of a second, and the camera keeps its 60 fps (log of 2026-11-15: `Framerate: 60.00 fps` after choosing 30.00). The field stays on **Leave Unchanged**.

The V4L2 source remembers the camera by its device file (`/dev/video1` on 2026-11-15; `/dev/video0` is the OBS Virtual Camera). If that number changes after an update or a new USB device, the webcam turns black: open its properties and choose **OBSBOT Meet 2** again in **Device**.

If the camera sends one damaged picture, the source stops for good and shows a green or frozen picture: in OBS 33.0.1, a picture that fails to decode ends the capture (`failed to unpack jpeg or h264`, then `break`, in [`v4l2-input.c`](https://github.com/obsproject/obs-studio/blob/33.0.1/plugins/linux-v4l2/v4l2-input.c)). It happened on 2026-11-15 when the collection was renamed, which restarts every source; hiding and showing the source doesn't restart it. To bring it back, change a setting of its properties, which restarts the capture (for example **Resolution** to **1280x720**, **OK**, then back to **1920x1080**, **OK**). If it turns green again at once, the camera itself is stuck (the log shows `select timed out` again and again): unplug its USB cable, wait five seconds, plug it back, then restart the capture the same way. The stream test (step 8) checks how often it happens.

### The place and the look of the webcam

The owner chose the place on two screenshots of 2026-11-15: in a fight, and with the stash, the inventory and the price window of Exile Market open. The webcam sits at the bottom, just right of the stash panel and left of the character: it hides neither the life globe, the skills, the inventory, nor the price window, which opens beside the panel of the game ([README of Exile Market](https://github.com/sylent-dev/rust-exile-market#copy-an-item)).

It is 250 × 250 on the canvas, about 156 × 156 on the stream (1600 × 900): the owner wants it discreet, so the game stays in front. Its look follows a reference the owner gave, rounded corners and a soft shadow, with no plugin; the shadow became a glow in the color of the mode played (see [The mode played: glow and badge](#the-mode-played-glow-and-badge)):

- the **Crop/Pad** filter cuts the 1920 × 1080 picture into a 1080 × 1080 square;
- the **Image Mask/Blend** filter, type **Alpha Mask (Alpha Channel)**, keeps only the pixels under the opaque part of [`assets/webcam/webcam-mask.png`](../assets/webcam/webcam-mask.png): a white 1080 × 1080 square with corners of 108 pixels (25 once shown at 250);
- OBS has no shadow filter: an **Image** source sits behind the webcam, with a glow drawn in advance.

The mask and the glows were generated for this project with Python (Pillow). A webcam of another size needs new glows, drawn at that size.

### The mode played: glow and badge

The owner plays hardcore (a character that dies is lost for the league) or softcore, alone or in solo self-found (SSF: no trade with other players). The webcam tells the viewers which, by two images chosen on 2026-11-15 in the mock-up [`mockups/webcam.html`](mockups/webcam.html):

- **The glow** behind the webcam, in place of the black shadow, which hardly showed on the dark areas of the game: the red of Exile Market (`#e5383b`, the red of the scenes) for hardcore, an azure blue (`#3a86ff`) for softcore. A rounded square of the webcam's size, grown by its spread, centered (no offset), blurred over 20 pixels (Pillow's `GaussianBlur(20)`, a standard deviation, like a CSS `blur(20px)`), at 50 % opacity. Two spreads are made, so that the stream test settles which shows best: 5 pixels (`narrow`) and 10 pixels (`wide`). The four images are 390 × 390, drawn at their size at X `822`, Y `1091`, so that changing the file of a source needs no new position.
- **The badge** at the bottom left inside the webcam, one image per mode, whose texts are in [`texts/webcam-badges.js`](texts/webcam-badges.js): `SC`, `SSF SC`, `HC`, `SSF HC`. Letters lit by the color of the mode, with no ground (style 9 of the mock-up), in Rajdhani Bold at 32 pixels ([`assets/fonts/rajdhani-bold.ttf`](../assets/fonts/rajdhani-bold.ttf)), « SSF » in light gray. The four images are 199 × 112, the text at the same place in each, drawn at their size at X `864`, Y `1327`. They were rendered from section 9 of the mock-up with Playwright, on a transparent background; a new badge is rendered the same way.

| Mode | Glow (visible) | Badge (visible) |
|---|---|---|
| Softcore | `webcam-glow-softcore` | `webcam-badge-sc` |
| SSF softcore | `webcam-glow-softcore` | `webcam-badge-ssf-sc` |
| Hardcore | `webcam-glow-hardcore` | `webcam-badge-hc` |
| SSF hardcore | `webcam-glow-hardcore` | `webcam-badge-ssf-hc` |

Before each live, the owner shows the glow and the badge of the character played, with the **eye** icon of the **Sources** dock, and hides the others: the checklist of the live day holds this step. A color alone tells nothing to a new viewer: the badge, and the mode in the title of the live, say it in words.

Set aside in the mock-up: the other blues (glacier, royal, steel), the badges on a ground (pill, outline, two parts), the other fonts and places.

### `pause` and `end`: animated web pages

Each screen is a **Browser** source that shows a page of [`overlays/screens/`](../overlays/screens/): OBS's browser (Chromium) draws its texts and its animation at the size of the canvas, as sharp as the game's text. No image nor video file is needed.

A Browser source was chosen over Text sources: on Linux, the text source (**Text (FreeType 2)**) can't center several lines nor color one word ([`text-freetype2.c`](https://github.com/obsproject/obs-studio/blob/33.0.1/plugins/text-freetype2/text-freetype2.c) has no alignment setting), and the rain needs a page anyway. The texts live in [`overlays/screens/texts.js`](../overlays/screens/texts.js), apart from the layout: an English version can be added there later.

- **Shutdown source when not visible** stops the page's browser outside its scene, so it uses no processor during the game ([`obs-browser-source.cpp`](https://github.com/obsproject/obs-browser/blob/d4db73e7e5d5b51d853177c8cddc796715a8ac84/obs-browser-source.cpp), the version of OBS 33.0.1), and **Refresh browser when scene becomes active** reloads it, so a text changed in `texts.js` shows at the next switch.
- The animation runs at the frame rate of the source: on Linux, **Use custom frame rate** is always checked and greyed, and **FPS** is 30 by default, up to 60 ([`obs-browser-plugin.cpp`](https://github.com/obsproject/obs-browser/blob/d4db73e7e5d5b51d853177c8cddc796715a8ac84/obs-browser-plugin.cpp): the shared texture, which allows the other mode, is built for Windows and macOS only, in `cmake/os-windows.cmake` and `cmake/os-macos.cmake`). 30 is kept: the rain falls slowly, and the stream test (step 8) checks whether 60 looks better.
- A screen in motion costs bitrate, unlike a still one: thin drops all over the screen are the hardest case for the encoder at 6000 kbps. The stream test checks that the rain doesn't turn into blocks; if it does, the density goes down in [`rain.js`](../overlays/screens/rain.js) (`count`).
- The fonts are stored in [`assets/fonts/`](../assets/fonts/), listed in [`assets/NOTICE.md`](../assets/NOTICE.md), so that the screens never depend on the network during a live.

### Design

Chosen by the owner on 2026-11-15 in the mock-up [`docs/mockups/screens.html`](mockups/screens.html) (skill `html-mockups`, served with `python3 .claude/skills/html-mockups/assets/serve.py 8790`, then http://127.0.0.1:8790/docs/mockups/screens.html), in the art direction of [sylent.art](https://sylent.art/) and [exile-market.sylent.tools](https://exile-market.sylent.tools/):

- **Colors**: neutral black `#0a0a0a`, white, the weak gray `#a3a3a3` of the subtitles, the faint gray `#858585` of the disclaimer, and the red of Exile Market `#e5383b` as the only signal color, on the last word of each title and on the link.
- **Fonts**: Manrope 800 with tight tracking (−0.045 em) for the titles; Cormorant Garamond italic 500 for the subtitles, as on exile-market.sylent.tools; Manrope for the footer.
- **Layout**: the title and its subtitle centered on the screen; on `end`, the link in red just above the disclaimer, at the bottom, both over a dark shade.
- **Rain** (« Pluie de sang »): straight drops, density ×2 and speed ×0.6 of the mock-up's base, one drop in six red; they land on a floor drawn as a grid in perspective, its lines running to a vanishing point at the center of the horizon (opacity 0.3), and leave flat rings or small splashes. Far drops land near the horizon, near ones at the bottom.
- **Lightning**: every 4 to 9 seconds, white or red at random, without shaking the screen; it lights up a giant word behind the title (« PAUSE », « MERCI »).
- **Texts**: « Petite pause » with « La pluie bat fort, Sylent est parti s’abriter… » (changed on 2026-11-15 from « La pluie bat fort, attendons qu’elle se calme »); « Merci d’avoir regardé ! » with « À très bientôt ».

Set aside the same day: a plain dark card (the first version); four fantasy styles (embers, editorial, arcane runes, neon); eight styles in the art direction (faded word, blood, glass, shards, blade, giant outline, burst of shards, scrolling rows); the other rains (drizzle, shower, window, storm, scarlet deluge), slanted drops, a moving floor, a shaking screen; the subtitle « Le temps que la pluie se calme » and the titles « Restez au sec, Exilés », « Même Wraeclast a besoin de souffler », « le temps d’aller chercher une Orbe divine », « Pendant ce temps, vos objets ne valent toujours rien ». The mock-up keeps the other rains for comparison.

### The export

OBS saves a scene collection by itself, in its Flatpak folder. The export copies it into the repository, so the setup can be read and restored. Before the commit, Claude Code removes from the copy:

- the `RestoreToken` of `game-screen`: the permission KDE gave to OBS to capture the screen, tied to this machine. After an import, OBS asks for the screen once ([`obs-capture.md`](obs-capture.md#the-picture-screen-capture));
- the absolute paths, which hold the owner's user name: `overlays/screens/pause.html` replaces `/var/home/<user>/…/stream-hideout/overlays/screens/pause.html`.

After an import, **Scene Collection → Check for Missing Files** lists the pages and the images of the webcam, and **Search Directory...** finds them in the repository. The mask of the webcam isn't listed there (the filter doesn't declare its file to OBS): open the **Filters** of `webcam` and choose the mask again.

## Procedure

Before starting: the game and Exile Market running on the left screen (`DP-2`), OBS open on the right screen (`DP-3`), the repository up to date on the branch of this step.

### Remove what the first live doesn't use

1. In the **Scenes** dock, select the scene `camera`, click the **trash** icon under the list, and confirm with **Yes**.
2. Select the scene `screen`. In the **Sources** dock, select `webcam`, click the **trash** icon, and confirm with **Yes**: the PipeWire webcam is gone, and the camera is free.

### The scene `game`

3. In the **Scenes** dock, right-click `screen`, then **Rename**: type `game`, then **Enter**.

### The webcam

4. With `game` selected, in the **Sources** dock, click **+**, then **Video Capture Device (V4L2)**.
5. **Create new**, name `webcam`, **Make source visible** checked, then **OK**.
6. In its properties:
   - **Device**: **OBSBOT Meet 2: OBSBOT Meet 2 St (usb-…)**, not **OBS Virtual Camera**;
   - **Video Format**: **Motion-JPEG**;
   - **Resolution**: **1920x1080**;
   - **Frame Rate**: **Leave Unchanged** (see [The webcam](#the-webcam-v4l2-in-place-of-pipewire): OBS 33.0.1 can't set another rate on this camera, which stays at 60 fps);
   - leave the other fields as they are, and click **OK**.
7. In the **Sources** dock, right-click `webcam`, then **Filters**.
8. Under **Effect Filters**, click **+**, then **Crop/Pad**, keep the name, **OK**: **Relative** checked, **Left** `420`, **Right** `420`, **Top** `0`, **Bottom** `0`. The preview of the filter shows a square. If your face isn't centered, move the 840 pixels between the two sides (for example **Left** `300`, **Right** `540` moves the square to the left). The picture must stay square, or step 10 stretches it: what is cut on the sides must be 840 pixels more than what is cut at the top and the bottom (**Left** + **Right** = 840 + **Top** + **Bottom**). For example, to cut 200 pixels at the top, which zooms on the face: **Top** `200`, **Bottom** `0`, **Left** `520`, **Right** `520`, a square of 880 × 880.
9. Under **Effect Filters**, click **+**, then **Image Mask/Blend**, keep the name, **OK**:
   - **Type**: **Alpha Mask (Alpha Channel)**;
   - **Path**: **Browse**, then `assets/webcam/webcam-mask.png` in the repository;
   - **Stretch Image (discard image aspect ratio)**: unchecked.
   The corners of the square are now rounded. Check the order of the list: **Crop/Pad** first, **Image Mask/Blend** under it; if not, select one and use the arrows under the list. Close the filters window.
10. Right-click `webcam`, then **Transform → Edit Transform**:
    - **Position**: **X** `892`, **Y** `1161`;
    - **Alignment**: **Top Left**;
    - **Size**: **Width** `250`, **Height** `250`;
    - **Bounds Type**: leave the first entry of the list, the default (no bounding box);
    - every **Crop** field at `0` (the crop is done by the filter).
    Click **Close**.

### The glow and the badge of the webcam

In a collection that still has the black shadow, remove it first: select `webcam-shadow` in the **Sources** dock, click the **lock** icon to unlock it, then the **trash** icon, and confirm with **Yes**.

11. In the **Sources** dock, click **+**, then **Image**. **Create new**, name `webcam-glow-hardcore`, then **OK**. **Image File**: **Browse**, then `assets/webcam/webcam-glow-hardcore-wide.png` in the repository. Click **OK**.
12. Right-click `webcam-glow-hardcore`, then **Transform → Edit Transform**: **Position** **X** `822`, **Y** `1091`; **Alignment**: **Top Left**; **Size**: **Width** `390`, **Height** `390`. Click **Close**.
13. Do the same for `webcam-glow-softcore`, with `assets/webcam/webcam-glow-softcore-wide.png` and the same transform.
14. Add four **Image** sources the same way, each with the file of its name in `assets/webcam/`: `webcam-badge-sc`, `webcam-badge-ssf-sc`, `webcam-badge-hc`, `webcam-badge-ssf-hc` (e.g. `webcam-badge-sc.png`). Transform of each: **Position** **X** `864`, **Y** `1327`; **Alignment**: **Top Left**; **Size**: **Width** `199`, **Height** `112`.
15. Put the sources in this order in the **Sources** dock, from top to bottom, by dragging them: `webcam-badge-sc`, `webcam-badge-ssf-sc`, `webcam-badge-hc`, `webcam-badge-ssf-hc`, `webcam`, `webcam-glow-hardcore`, `webcam-glow-softcore`, `game-audio`, `game-screen`. The source at the top is drawn in front: the badges over the webcam, the glows behind it.
16. Click the **eye** icon of every glow and badge but `webcam-glow-softcore` and `webcam-badge-sc`, to hide them: one glow and one badge show at a time (see [the table of the modes](#the-mode-played-glow-and-badge)).
17. Click the **lock** icon of `webcam` and of the six images, so a click in the preview can't move them.

### The scene `pause`

18. In the **Scenes** dock, click **+**, type `pause`, then **OK**.
19. In the **Sources** dock, click **+**, then **Browser**. **Create new**, name `pause-screen`, then **OK**.
20. In its properties:
    - **Local file**: checked;
    - **Local file** (the path): **Browse**, then `overlays/screens/pause.html` in the repository;
    - **Width** `2560`, **Height** `1440`;
    - **FPS**: `30` (its default);
    - **Shutdown source when not visible**: checked;
    - **Refresh browser when scene becomes active**: checked;
    - leave **Custom CSS** as it is, and click **OK**.
21. The preview shows « Petite pause » over the rain, on the whole canvas. Click the **lock** icon of `pause-screen`.

### The scene `end`

22. In the **Scenes** dock, click **+**, type `end`, then **OK**.
23. Add a **Browser** source named `end-screen`, with the settings of step 20 and the file `overlays/screens/end.html`.
24. The preview shows « Merci d’avoir regardé ! », the link and the disclaimer over the rain. Click the **lock** icon of `end-screen`.

### The order of the scenes

25. In the **Scenes** dock, drag the scenes into this order: `game`, `pause`, `end`. Select `game`.

### The scene collection

26. **Scene Collection → Rename**: type `sylent-exile`, then **OK**.
27. **Scene Collection → Export**: open the folder `obs` of the repository, name the file `sylent-exile.json`, then **Save**.

Claude Code then cleans the exported file (see [The export](#the-export)) before the commit.

## Check

The owner runs this check right after the procedure, with the game and Exile Market running.

1. Look at the **Scenes** dock. Expected: exactly `game`, `pause` and `end`, in that order; the title bar of OBS ends with `Scenes: sylent-exile`.
2. Select `game` and look at the preview. Expected: the webcam is a square with rounded corners, at the bottom, left of the character, with a blue glow around it and « SC » at its bottom left; show `webcam-glow-hardcore` and `webcam-badge-ssf-hc` in place of the softcore ones: the glow turns red and the badge reads « SSF HC »; then back to softcore; the picture is sharp when the preview is enlarged (right-click the preview, **Preview Scaling → Canvas (2560x1440)**, then back to **Scale to Window**).
3. In the game, open the stash and the inventory, put the pointer over an item of the inventory and press **Ctrl+D**. Expected: the webcam hides no cell of the stash or the inventory, nor the price window.
4. Click `pause` and watch for thirty seconds. Expected: the game and the webcam disappear; the title and its subtitle show centered, « pause » in red, the subtitle in italics; the rain falls straight on the grid, and at least one lightning, white or red, lights up « PAUSE » behind the title; in the **Audio Mixer**, `game-audio` is gone and `microphone` still moves when you speak.
5. Click `end`. Expected: « Merci d’avoir regardé ! » with « regardé ! » in red, « À très bientôt » in italics, the link in red just above the disclaimer at the bottom, both readable over the rain.
6. Click `game` again. Expected: the game, the webcam and the game's sound come back after the fade.
7. Open `overlays/screens/texts.js` in VS Code, change a letter of the text of `pause`, save, then click `pause`. Expected: the changed text shows. Undo the change and save.
8. Play for two minutes on `game` with **Docks → Stats** open. Expected: no frames missed due to rendering lag, and no visible drop of the game's frames per second.
9. Free test: anything else to note (the webcam's colors, a delay between the voice and the lips, the size of the webcam).

| Test | Result (OK / not OK) | Note |
|---|---|---|
| 1. Three scenes, collection renamed | | |
| 2. Webcam: shape, place, sharpness, glow and badge | | |
| 3. Inventory and price not hidden | | |
| 4. `pause` and its rain | | |
| 5. `end` | | |
| 6. Back to `game` | | |
| 7. Text changed from the file | | |
| 8. Performance | | |
| 9. Free test | | |

The results come back in the conversation; this table stays blank.
