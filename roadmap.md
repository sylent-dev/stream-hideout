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
- [x] **5.** The capture: the left screen through PipeWire, with Exile Market; the game's sound alone through a plugin; the microphone once, filtered, without clipping: [`docs/obs-capture.md`](docs/obs-capture.md) (#6).
- [x] **6.** The scenes `game` (the webcam in 1920 × 1080, 250 × 250 with rounded corners), `pause` and `end` (animated rain pages in `overlays/screens/`, chosen in a mock-up), and the collection `sylent-exile` exported in `obs/`: [`docs/obs-scenes.md`](docs/obs-scenes.md) (#7).
- [x] **7.** The texts of the Twitch channel (title, tags, bio, three panels, with the Exile Market disclaimer): [`docs/texts/twitch-channel.md`](docs/texts/twitch-channel.md) (#8).
- [x] The images of the three panels, in the storm style of the scenes, with the owner's logos: [`docs/texts/twitch-channel.md`](docs/texts/twitch-channel.md#images) (#PR).

## First live

- [ ] **8. `docs/stream-test`**: the guide of the stream test, with a blank table of results; its results fix the settings of steps 4 to 6 if needed.
- [ ] **9. `docs/live-checklists`**: the checklists of a live day (before, during, after), in French, with the exact names of the scenes and sources.
- [ ] **First live.**

## After the first live

- [ ] **10. `docs/hardware-purchases`**: the purchases that would improve the stream the most for their price, ranked, from the inventory, the results of the stream test and the first lives; a dedicated microphone first, already planned by the owner. A gap that blocks the first live is solved at step 2 instead.
- [ ] **11. Discord server**: its channels, roles, rules and welcome message (texts in French in `docs/texts/`), and its link in the Twitch panels. Split into several pull requests when the step starts.
