# Roadmap

The channel **SylentExile** streams Path of Exile 2 in French, for three reasons: the fun of playing, building a community, and showcasing [Exile Market](https://exile-market.sylent.tools/) (v0.1.0, released on 2026-11-14) through game sessions.

- Platform: **Twitch only** for now (chosen on 2026-11-14). YouTube waits in [`backlog.md`](backlog.md).
- One pull request per step, in this order. The first live took place on 2026-11-15; the next steps make the following ones better.
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
- [x] The images of the three panels, in the storm style of the scenes, with the owner's logos: [`docs/texts/twitch-channel.md`](docs/texts/twitch-channel.md#images) (#9).
- [x] **8.** The guide of the stream test, run as a real live: [`docs/stream-test.md`](docs/stream-test.md) (#11).
- [x] The offline image and the profile banner of the channel, in the style of the scenes, with the SYLENT logo: [`docs/texts/twitch-channel.md`](docs/texts/twitch-channel.md#offline-image-and-profile-banner) (#12).
- [x] The glow and the badge of the webcam, for the mode played (hardcore or softcore, SSF): [`docs/obs-scenes.md`](docs/obs-scenes.md#the-mode-played-glow-and-badge) (#13).

## First live

- [x] **First live** on 2026-11-15, one hour, without a recording: the connection to Twitch held, but 1.0 % of the frames lagged in rendering and 1.2 % were skipped by the encoder (OBS log), the likely cause of the « average bitrate unstable » shown by Twitch.

## Next

- [ ] **9. The lost frames**: let OBS keep up with the game, for instance by capping the game's frame rate (its setting in Path of Exile 2 and the reason checked in their documentation first); then, during a live with a recording, **Frames missed due to rendering lag** and **Skipped frames due to encoding lag** near 0 in **Stats**, along the tests of [`docs/stream-test.md`](docs/stream-test.md), whose results fix the settings of steps 4 to 6 if needed.
- [ ] **10. The HUD overlay**: the character, its class and level, the deaths during the live, the area and its level, the time live, in a still band that hides nothing of the game (globes, skills, minimap, quests, stash, the price window of Exile Market). A wireframe first, grey blocks with the real texts over screenshots of the game (a map with the large minimap, a boss, the Atlas, the stash), then a mock-up in the style of the scenes.
  - The data come from the game's log, `logs/Client.txt` in the game's folder (French client, checked on 2026-11-15): « <character> (<class>) a atteint le niveau N. », « <character> vient de mourir. », `[SCENE] Set Source [<area>]` and `Generating level N area`. The log also holds the chat and the whispers: a small local program reads only these lines and passes them to the overlay.
  - Grinding Gear Games allow tools that read the game's logs as long as the user knows what they do with the data; they forbid touching the game or its files, and automated actions ([developer docs](https://www.pathofexile.com/developer/docs), 2026-11-15). Their API gives no deaths, area nor time for Path of Exile 2, and takes no new application.
- [ ] **11. `docs/live-checklists`**: the checklists of a live day (before, during, after), in French, with the exact names of the scenes and sources; among them, show the glow and the badge of the mode played, start the recording, and keep the repository on `main` during a live, since OBS reads its files.

## Later

- [ ] **12. `docs/hardware-purchases`**: the purchases that would improve the stream the most for their price, ranked, from the inventory, the results of the stream test and the first lives; a dedicated microphone first, already planned by the owner.
- [ ] **13. Discord server**: its channels, roles, rules and welcome message (texts in French in `docs/texts/`), and its link in the Twitch panels. Split into several pull requests when the step starts.
