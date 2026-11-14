# Roadmap

The channel **SylentExile** streams Path of Exile 2 in French, for three reasons: the fun of playing, building a community, and showcasing [Exile Market](https://exile-market.sylent.tools/) (v0.1.0, released on 2026-11-14) through game sessions.

- Platform: **Twitch only** for now (chosen on 2026-11-14). YouTube waits in [`backlog.md`](backlog.md).
- One pull request per step, in this order. Before the first live, every step serves that live.
- The OBS steps are written for Bazzite (KDE Plasma, Wayland) with an AMD graphics card, and each ends with a check the owner runs on their machine.

## Done

- [x] Set up the project conventions and the Claude Code settings (#1).

## First live

- [ ] **1. `docs/roadmap`**: this roadmap, `backlog.md` and `docs/lessons.md`.
- [ ] **2. `docs/hardware`**: `docs/hardware.md`, the inventory of the setup: the PC (processor, AMD graphics card, memory), the screens, the microphone, the headset, the webcam if any, and the upload speed of the connection, measured. Read from the system where possible, without serial numbers. Flags what would block the first live (no usable microphone, an upload too low for Twitch).
- [ ] **3. `docs/obs-install`**: `docs/obs-setup.md`, first part: OBS on Bazzite, installed from Flathub, its version, and the hardware encoder of the AMD card (VA-API) showing in its settings.
- [ ] **4. `docs/obs-output`**: the profile settings for Twitch: encoder, bitrate, resolution, frame rate and keyframe interval, chosen from Twitch's recommendations and the upload measured at step 2, plus the local recording.
- [ ] **5. `docs/obs-capture`**: the capture under Wayland: the game in windowed fullscreen and the Exile Market window (XWayland) both on screen, the method to compare (PipeWire screen capture, window capture); the audio sources (game, microphone, other sounds) kept separate.
- [ ] **6. `feat/first-scenes`**: the scenes of the first live (« Jeu », « Pause », « Fin »), their texts in `docs/texts/`, and the scene collection exported in `obs/`, without absolute paths.
- [ ] **7. `content/twitch-channel`**: in `docs/texts/`, the stream title, category and tags, the bio and the panels, including an Exile Market panel with its link and the Grinding Gear Games disclaimer.
- [ ] **8. `docs/stream-test`**: the guide of the stream test, with a blank table of results; its results fix the settings of steps 4 to 6 if needed.
- [ ] **9. `docs/live-checklists`**: the checklists of a live day (before, during, after), in French, with the exact names of the scenes and sources.
- [ ] **First live.**

## After the first live

- [ ] **10. `docs/hardware-purchases`**: the purchases that would improve the stream the most for their price, ranked, from the inventory, the results of the stream test and the first lives. A gap that blocks the first live is solved at step 2 instead.
- [ ] **11. Discord server**: its channels, roles, rules and welcome message (texts in French in `docs/texts/`), and its link in the Twitch panels. Split into several pull requests when the step starts.
