# Roadmap

The channel **SylentExile** streams Path of Exile 2 in French, for three reasons: the fun of playing, building a community, and showcasing [Exile Market](https://exile-market.sylent.tools/) (v0.1.0, released on 2026-11-14) through game sessions.

- Platform: **Twitch only** for now (chosen on 2026-11-14). YouTube waits in [`backlog.md`](backlog.md).
- One pull request per step, in this order. Before the first live, every step serves that live.
- The OBS steps are written for Bazzite (KDE Plasma, Wayland) with an AMD graphics card, and each ends with a check the owner runs on their machine.

## Done

- [x] Set up the project conventions and the Claude Code settings (#1).
- [x] **1.** The roadmap, the backlog and the lessons (#2).
- [x] **2.** The inventory of the setup: [`docs/hardware.md`](docs/hardware.md); nothing blocks the first live (#3).
- [x] **3.** OBS 33.0.1 from Flathub and its VA-API encoders: [`docs/obs-setup.md`](docs/obs-setup.md) (#4).
- [x] **4.** The profile for Twitch (1600 × 900 at 60 fps, H.264 CBR 6000 kbps) and the recording (2560 × 1440, AV1): [`docs/obs-output.md`](docs/obs-output.md) (#5).

## First live

- [ ] **5. `docs/obs-capture`**: the capture under Wayland: the game in windowed fullscreen and the Exile Market window (XWayland) both on screen, the method to compare (PipeWire screen capture, window capture); the audio sources (game, microphone, other sounds) kept separate, on the recording tracks of step 4 (1: the whole mix, 2: the microphone, 3: the game). The microphone sounds poor to the owner (recording of 2026-11-15, whose mix reached 0 dBFS): its level without clipping, and the filters of OBS that fit it.
- [ ] **6. `feat/first-scenes`**: the scenes of the first live (« Jeu », « Pause », « Fin »), with the webcam in a corner of « Jeu » (now 640 × 360 at 20 fps, to raise to 1920 × 1080 in MJPEG, see [`docs/hardware.md`](docs/hardware.md#webcam)), their texts in `docs/texts/`, and the scene collection, still named « Untitled », renamed (**Scene Collection → Rename**) and exported in `obs/`, without absolute paths.
- [ ] **7. `content/twitch-channel`**: in `docs/texts/`, the stream title, category and tags, the bio and the panels, including an Exile Market panel with its link and the Grinding Gear Games disclaimer.
- [ ] **8. `docs/stream-test`**: the guide of the stream test, with a blank table of results; its results fix the settings of steps 4 to 6 if needed.
- [ ] **9. `docs/live-checklists`**: the checklists of a live day (before, during, after), in French, with the exact names of the scenes and sources.
- [ ] **First live.**

## After the first live

- [ ] **10. `docs/hardware-purchases`**: the purchases that would improve the stream the most for their price, ranked, from the inventory, the results of the stream test and the first lives; a dedicated microphone first, already planned by the owner. A gap that blocks the first live is solved at step 2 instead.
- [ ] **11. Discord server**: its channels, roles, rules and welcome message (texts in French in `docs/texts/`), and its link in the Twitch panels. Split into several pull requests when the step starts.
