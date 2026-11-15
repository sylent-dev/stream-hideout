---
name: html-mockups
description: Build the interactive HTML mock-up of an overlay or a scene of the stream (a full-screen card such as the scenes `pause` and `end`, a banner, a frame for the webcam), in docs/mockups/, comparing 3 or 4 styles with tabs at the size of the OBS canvas, then iterate with the owner one decision at a time (one control per open decision) until the chosen style becomes the overlay in overlays/. Use it when the owner asks for an overlay, a style, a visual design, or to compare variants of a scene before setting it up in OBS.
---

# HTML mock-ups

Goal: choose the look of an overlay with its real texts, at the size viewers see it, before setting it up in OBS. The mock-up answers one question at a time.

This skill comes from the owner's application projects (`rust-desktop-template`, 2026-11-15), adapted on 2026-11-15 to the overlays of this stream: there is no wireframe step and no `specs.md`; the chosen style becomes the files of `overlays/`, which OBS shows through a **Browser** source.

## 1. Build the page

Before drawing the options of a design question:

- **Ask the owner for their own idea first**, or draw it alongside: they often have a reference (a screenshot of another channel in `inputs/`).
- **Look at the real content** the overlay will show: the texts of `overlays/<name>/texts.js`, the game's interface on a screenshot of `inputs/` (where the panels, the globes and the price window of Exile Market sit), the place of the webcam.

Start from `assets/mockup-template.html` (read its comments), copied to `docs/mockups/<name>.html`:

- **One page**: the CSS and the JavaScript inline; the texts loaded from the overlay's own `texts.js` (`<script src="../../overlays/<name>/texts.js">`), so that the mock-up and the overlay never differ in wording.
- **Every scene becomes a frame at the size of the canvas** (2560 × 1440, see `docs/obs-output.md`), drawn at its real size and scaled down in the page (`transform: scale(…)` in a box of the scaled size). Add every state in `SECTIONS`: each scene, a long text, the other language later. **A new section goes at the top** of `SECTIONS`.
- **A control for the viewing size**: the canvas, the stream (1600 × 900, 62.5 %), a phone (about 25 %). A detail that disappears at the phone's size is too small.
- **A frame over the game**: put a screenshot of `inputs/` behind it, never committed (a game screenshot is Grinding Gear Games' content, see `CLAUDE.md`, Third-party content); the page falls back to a dark background when the file is missing.
- **3 or 4 styles on the same page**, switched with the tabs at the top; the address keeps the choice (`?theme=…`) to share it. Each style only sets **tokens** (CSS variables under `:root[data-theme="…"]`): fonts, colors, radius, spacing, motion. The components use nothing else, so that a style is cheap to add or tweak.
- The styles explore **new directions** for a French Path of Exile 2 channel that showcases Exile Market, from sober to spectacular: the owner decides by seeing. Never imitate Grinding Gear Games' logos or official look ([developer guidelines](https://www.pathofexile.com/developer/docs)).
- **Fonts the stream may use**: SIL Open Font License (e.g. from Google Fonts), or the system fonts of the machine (Inter, Noto Sans). A Google font may be loaded online in the mock-up; once chosen, its files go in `assets/fonts/`, listed in `assets/NOTICE.md`, so that OBS doesn't depend on the network.
- **Icons as SVG lines** in the text color, not text symbols (⚙, ⌕, ✓), which render small and off-center.
- **Motion is chosen by seeing it play**, and kept slow and small: a whole-screen animation (a moving gradient, particles) costs bitrate on the stream and shows as blocks at 6000 kbps. A still screen costs almost nothing.
- **French typography** in every viewer text: a non-breaking space before `?`, `!`, `:`, `;`, the typographic apostrophe (’), accents on capitals.

Pitfalls met before:

- A class shared by two components (`top`, `online`) silently broke the layout twice: prefix the classes of the overlay (`ovl-`) and of the states (`is-`).
- A JavaScript function named like a browser global (`top`, `name`, `status`) breaks the page: give the components specific names.
- OBS injects a transparent `body` background in a Browser source (its default **Custom CSS**): a full-screen card paints its own background on an element, not on `body`.

## 2. Show it

Serve the repository root with `assets/serve.py` of this skill, so that the page reaches `overlays/` and `inputs/` even in a sandboxed browser (Flatpak, Snap) that only receives the HTML file, and a reload never mixes old and new files (it sends `Cache-Control: no-store`). This project uses the port **8790** (8765 is taken on the owner's machine; two projects on the same port took each other's server over). Keep the server running in the background:

```sh
python3 .claude/skills/html-mockups/assets/serve.py 8790
```

Each time the mock-up changes, check that the page answers with the change, then give the owner `http://127.0.0.1:8790/docs/mockups/<name>.html` with the section to look at; they reload after each change. If the page answers 404, check which project answers on the port before restarting.

Before asking for a review, check each change with a headless screenshot (`scripts/screenshot.sh <url> <output.png> [width] [height | full]`), kept in the scratchpad, and look at it. A frame at the size of the stream is checked at 1600 × 900, the size Twitch receives (`docs/obs-output.md`). To compare the styles at a glance, export one PNG per style to `outputs/`.

The script uses **Playwright** and its own Chromium when installed (it is, in `~/.local/share/mockup-tools`), otherwise Firefox (normal or Flatpak). Prefer Playwright: it waits for the scripts to settle, captures the whole page (`full`), prints the errors of the browser console (scripts, missing files) and fails on them, which a screenshot alone doesn't show. To install it again, outside the projects (about 150 MB):

```sh
mkdir -p ~/.local/share/mockup-tools && cd ~/.local/share/mockup-tools
npm init -y && npm install playwright && npx playwright install chromium
```

- A test that needs extra code (a delay, a simulated click) runs on a copy of the page (`docs/mockups/test-*.html`, deleted after), never on the file the owner has open: they reload it at any time. Stop the helper servers by their PID, never with `pkill -f` and a pattern that also matches the shell's own command.
- A headless browser renders without the GPU: a color or WebGL bug the owner reports doesn't show in a screenshot. Build a small test page of variants and ask the owner to name the wrong ones.
- `firefox --screenshot` shoots before the scripts settle: an animation is measured or shot with Playwright, driven by a small script of its own (see `scripts/screenshot.cjs`).
- OBS's browser (CEF, Chromium) is the one that matters in the end: the owner checks the chosen overlay in OBS itself, in the guide of its scene in `docs/`.

## 3. Iterate with the owner

1. The owner picks a style, or mixes two. Iterate on it alone, **one change at a time** (the main color, then the font, then a motion…).
2. **Give each open decision its own control** in `VARIANTS`, so that the owner compares on screen instead of imagining; once decided, remove it and keep the choice in the tokens. The control depends on the decision:
   - **A few distinct variants** (two layouts, three ornaments…): a group of tabs.
   - **Values that combine** (a font per role, colors, sizes): one list per role (`select: true`, with the CSS `variable` it sets), which changes the page at once.
   - **Values tuned by eye** (a size, a darkness, a speed): a slider (`range`, with the CSS `variable` it sets), whose value shows beside it. The owner tunes it on their own screen, then sends back the address, which holds the values.
   - **The address keeps every choice**, so that the owner can reload the page or send the exact combination.
   - **Number the proposals once**, from 1 upward across every series: letters, or a numbering that starts again in each series, get mixed up ("the B" of which series?). The owner often dictates by voice: a number is understood where a letter isn't.
3. When the owner points at something, change only that, and say what changed. **When their words leave a visible detail open**, ask for that detail by name instead of picking one and taking a short « yes » for it.

## 4. Finish: the overlay

- Write the chosen style into `overlays/<name>/` as CSS tokens (variables on `:root`), with the texts in its `texts.js`: the overlay uses exactly these tokens, so that a color or a size changes in one place.
- Write the decision in the guide of the scene in `docs/` (a « Design » section): the tokens kept, the options set aside, and why.
- Remove the styles that were not chosen from the mock-up page, or keep them in a section that says they were rejected.
- Every font, image or sound that isn't the owner's creation goes in `assets/` and in `assets/NOTICE.md`, in the commit that adds it.
