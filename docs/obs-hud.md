# OBS HUD

The HUD of the scene `game`: the character, its class and level, the area and its level, the deaths and the time live, in a still block right of the webcam. Step 9a of [`roadmap.md`](../roadmap.md): the page, set up in OBS and fed by an invented log; step 9b feeds it from the game's real log. Written on 2026-11-22 for OBS 33.0.1 (Flatpak) on Bazzite (KDE Plasma, Wayland), after the scenes of [`obs-scenes.md`](obs-scenes.md).

## Summary

| Source | Page | What the viewers see |
|---|---|---|
| `hud-sc` | [`overlays/hud/softcore.html`](../overlays/hud/softcore.html) | « SylentFrost », « Sorcière niv. 89 », « Le Nid abominable niv. 79 », « Morts : 1 · En live : 1:24:07 », white on the game with a dark halo |
| `hud-hc` | [`overlays/hud/hardcore.html`](../overlays/hud/hardcore.html) | the same without the deaths: « En live : 1:24:07 » |

Both are **Browser** sources of 500 × 236 pixels at X `1160`, Y `1141` of the canvas, in the scene `game`, just above `game-screen`. Like the glow and the badge of the webcam, the owner shows the one of the mode played and hides the other.

## Why these choices

### The place

Chosen by the owner on 2026-11-22 in the wireframe of [`docs/mockups/hud.html`](mockups/hud.html), over screenshots of a boss fight, the hideout, the stash with the inventory, the world map and the Atlas (served with `python3 .claude/skills/html-mockups/assets/serve.py 8790`, then http://127.0.0.1:8790/docs/mockups/hud.html, **Style**: **Wireframe**, **Game zones**: **Shown**). The HUD sits at the bottom, 24 pixels right of the webcam (its text starts at X 1172 and ends at most at X 1632), its bottom at Y 1365, above the experience bar: it covers nothing of the game's interface on these screens.

It can cover one thing: the bottom of the price window of Exile Market, for an item of the inventory. That window opens left of the inventory, 420 pixels wide, its top level with the pointer ([`specs.md` of Exile Market](https://github.com/sylent-dev/rust-exile-market/blob/main/specs.md#window-over-the-game)), and the cells of the inventory are at the bottom of the screen. The fix belongs to Exile Market, which could keep its window above the HUD ([`backlog.md`](../backlog.md)).

Set aside: the top left under the buffs (over the stash), a thin band at the top (over the life bar of a boss and the titles of the maps), the right above the mana (over the inventory).

### The data: the game's log

The game writes its log to `logs/Client.txt` in its folder (`…/steamapps/common/Path of Exile 2/logs/Client.txt` for the Steam client). The French client writes these lines, checked in the owner's log on 2026-11-22:

| Line | The HUD takes |
|---|---|
| `[INFO Client 320] : SylentFrost (Sorcière) a atteint le niveau 88.` | the character, its class and its level |
| `[INFO Client 320] : SylentFrost vient de mourir.` | one death, when the name is the character's |
| `[DEBUG Client 320] Generating level 79 area "MapSampleNest" with seed …` | the level of the area, and its id |
| `[INFO Client 320] [SCENE] Set Source [(null)]`, then `[INFO Client 320] [SCENE] Set Source [Le Nid abominable]` | the name of the area entered |

Three traps, handled by `readLog` in [`overlays/hud/hud.js`](../overlays/hud/hud.js):

- The log also announces the deaths of the ladder: `* (Dév.): <player> (Niveau 98) vient de mourir à la 27e place du classement.`. Only a line `: <name> vient de mourir.` with the name of the character played counts.
- Opening the world map or the Atlas writes `Set Source [Acte 1]` or `Set Source [Atlas]`, without changing area: the area is the name written right after `Set Source [(null)]`.
- A town or a hideout has a level in the log (15 for `G1_town`, 65 for `HideoutDreadnought`) that means nothing to a viewer: the HUD shows the area without its level when its id starts with `Hideout` or ends with `_town`.

The level line gives the base class (« Sorcière »), not the ascendancy. The character's name is known only once the log holds a level line: until the first level of the session, step 9b takes it from the end of the log.

The log also holds the chat and the whispers, which the viewers must not see. Step 9b copies only the lines above into a small file the HUD reads.

### How the page reads its data

A local page of a Browser source can read the files next to it: OBS serves it at `http://absolute/<path>` through its own handler, which reads each file from disk at each request, with no cache (`browser-scheme.cpp` of [obs-browser](https://github.com/obsproject/obs-browser/blob/d4db73e7e5d5b51d853177c8cddc796715a8ac84/browser-scheme.cpp), the version of OBS 33.0.1). So the page reads a log every 2 seconds, with a query string that keeps Chromium from reusing an old copy, and no server is needed.

Until step 9b, that log is [`overlays/hud/sample-client.txt`](../overlays/hud/sample-client.txt): invented lines in the exact format of the game's log, its traps included, so that the same code reads the invented and the real log. Step 9b replaces it in `LOG_FILE` of `hud.js`.

### The time live

OBS tells a page when the live starts and stops (the events `obsStreamingStarted` and `obsStreamingStopped`), but not when a running live began: `getStatus()` gives only booleans, and the events carry no time ([README of obs-browser](https://github.com/obsproject/obs-browser/blob/d4db73e7e5d5b51d853177c8cddc796715a8ac84/README.md#get-obs-output-status), `handle_obs_frontend_event` in [`obs-browser-plugin.cpp`](https://github.com/obsproject/obs-browser/blob/d4db73e7e5d5b51d853177c8cddc796715a8ac84/obs-browser-plugin.cpp)). So the page notes the moment of `obsStreamingStarted` in its storage, and a page loaded during a live takes that moment back. Without a moment noted, it counts from its load.

- OBS sends these events to every page running, hidden or not (`DispatchJSEvent` without a source, sent to all browsers). **Shutdown source when not visible** stays unchecked, so that both HUDs run from the start of OBS and the hidden one keeps the moment too.
- `getStatus()` needs the page permission **Read access to OBS status information**, the default of a new Browser source (`DEFAULT_CONTROL_LEVEL = ControlLevel::ReadObs` in `browser-app.hpp`).
- Every local page of OBS shares one storage (one origin, `http://absolute`): the key is `stream-hideout.hud.live-start`, specific to this project. A moment older than 24 hours is ignored.
- Outside a live, the HUD shows no time. In a web browser, outside OBS, it counts from the load of the page, to be seen.

### One page per mode

In hardcore, a death ends the character: the HUD shows no deaths there (owner, 2026-11-22). A local page of a Browser source can't receive a parameter in its address, so each mode has its page: `softcore.html` and `hardcore.html` load the same `hud.css`, `hud.js` and `texts.js`, and differ only by `data-mode`. Each page uses a little memory even hidden, since both keep running.

### Design

Chosen by the owner on 2026-11-22 in [`docs/mockups/hud.html`](mockups/hud.html), in the art direction of [exile-market.sylent.tools](https://exile-market.sylent.tools/) (its `docs/branding.md`) and of the scenes `pause` and `end` ([`obs-scenes.md`](obs-scenes.md#design)): style 7, « On the game », without its red bar, every text 2 pixels smaller.

- **No card**: the text straight on the game, with the dark halo of the site's first screen (`0 1px 10px #000, 0 0 3px #000, 0 0 2px #000`).
- **Fonts**: Manrope 800 at 36 pixels with tight tracking (−0.045 em) for the name; Manrope 600 at 25 pixels for the other lines, the levels in Manrope 400.
- **Colors**: white, the levels and the labels in light gray `#d4d4d4`, the number of deaths in a red lighter than the one of Exile Market (`#ff5a5d`), so that it reads on a dark game.
- **Figures of one width**, so that the time doesn't shake as it counts.
- **A line too long ends with « … »**: a name of 23 letters or a long area doesn't overflow onto the skills.

The tokens are in [`overlays/hud/hud.css`](../overlays/hud/hud.css), the words in [`overlays/hud/texts.js`](../overlays/hud/texts.js). Set aside the same day: 5 « Sober » (a black card with a hairline border), 6 « Grid » (the grid of the site and a blood line on top), 8 « Blood and italics » (the name in Cormorant Garamond italic), and the red bar on the left of style 7. The mock-up keeps them to compare.

## Procedure

Before starting: OBS open on the right screen (`DP-3`), the scene collection `sylent-exile`, the repository on the branch of this step.

### The HUD in softcore

1. In the **Scenes** dock, select `game`. In the **Sources** dock, click **+**, then **Browser**.
2. **Create new**, name `hud-sc`, **Make source visible** checked, then **OK**.
3. In its properties:
   - **Local file**: checked; **Browse**, then `overlays/hud/softcore.html` in the repository;
   - **Width** `500`, **Height** `236`;
   - **Use custom frame rate**: checked and greyed on Linux; **FPS**: leave `30`;
   - **Custom CSS**: leave it as it is;
   - **Shutdown source when not visible**: unchecked;
   - **Refresh browser when scene becomes active**: unchecked;
   - **Page permissions**: **Read access to OBS status information**.
   Click **OK**.
4. Right-click `hud-sc`, then **Transform → Edit Transform**: **Position** **X** `1160`, **Y** `1141`; **Alignment**: **Top Left**; **Size**: **Width** `500`, **Height** `236`; **Bounds Type**: the first entry of the list. Click **Close**.
5. In the **Sources** dock, drag `hud-sc` just above `game-audio`, under `webcam-shadow-hc`.

### The HUD in hardcore

6. Do steps 1 to 5 again with the name `hud-hc` and the page `overlays/hud/hardcore.html`.
7. Before each live, show the HUD of the mode played with the **eye** icon of the **Sources** dock, and hide the other, with the glow and the badge of the webcam.

### The export

8. Once the check below is done, tell Claude Code: it exports the scene collection into [`obs/sylent-exile.json`](../obs/sylent-exile.json), with the absolute paths of the two pages replaced by `overlays/hud/softcore.html` and `overlays/hud/hardcore.html` ([`obs-scenes.md`](obs-scenes.md#the-export)).

## Check

The owner runs this check right after the procedure, with the game and Exile Market running, `hud-sc` shown and `hud-hc` hidden. Test 5 needs a live: run it with the stream test ([`stream-test.md`](stream-test.md)) or at the start of the next live.

1. Select `game` and look at the preview. Expected: right of the webcam, « SylentFrost » in large letters, then « Sorcière niv. 89 », « Le Nid abominable niv. 79 », « Morts : 1 », white with a dark halo; « niv. » and « Morts : » in light gray, « 1 » in red; no « En live », since no live is running. The text starts just right of the webcam and stays above the experience bar.
2. Hide `hud-sc` and show `hud-hc`. Expected: the same lines, without « Morts : 1 ». Then back to `hud-sc`.
3. Open `overlays/hud/sample-client.txt` in VS Code, copy its line « … : SylentFrost vient de mourir. » at the end of the file, and save. Expected: within 2 seconds, « Morts : 2 ». Undo the change and save: « Morts : 1 » again.
4. In the game, play a few minutes, open the stash and the inventory, then put the pointer over an item of the bottom row of the inventory and press **Ctrl+D**. Expected: the HUD hides nothing of the game; note whether it hides the bottom of the price window of Exile Market, and how much.
5. At the start of a live: Expected: « · En live : 0:00:00 » appears after « Morts : 1 » and counts every second; after a switch to `pause` and back to `game`, the time goes on; double-click `hud-sc`, click **Refresh cache of current page**, then **OK**: the time goes on from the start of the live, not from zero. At the end of the live, « En live » disappears.
6. With **Docks → Stats** open, play two minutes on `game`. Expected: no more frames missed due to rendering lag than without the HUD.
7. During the live of test 5, look at the stream on Twitch from a phone, then from a computer. Expected: the four lines are readable on the computer; on the phone, at least the name.
8. Free test: anything else to note (the size, the place, the halo on a light area of the game).

| Test | Result (OK / not OK) | Note |
|---|---|---|
| 1. HUD in softcore | | |
| 2. HUD in hardcore | | |
| 3. A death added to the log | | |
| 4. Game and price window | | |
| 5. Time live | | |
| 6. Performance | | |
| 7. Readable at the size of the stream | | |
| 8. Free test | | |

The results come back in the conversation; this table stays blank.
