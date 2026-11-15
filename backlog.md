# Backlog

Ideas that aren't part of a step of [`roadmap.md`](roadmap.md) yet. Read this file only when the next work is chosen.

| Idea | Depends on | Added |
|---|---|---|
| Stream to YouTube at the same time as Twitch (multistream), through a plugin such as obs-multi-rtmp or an online service; check Twitch's rules on its help center first. | A stable Twitch setup; enough upload for two streams. | 2026-11-14 |
| YouTube videos and Shorts that show Exile Market (copy an item, see its price), to be found through search. | The first lives; the local recording (step 4). | 2026-11-14 |
| A chat bot with commands such as `!exilemarket`. | The Twitch channel set up (step 7); a bot service chosen. | 2026-11-14 |
| Overlays: a « Starting soon » scene, an Exile Market banner. | The first scenes (step 6). | 2026-11-14 |
| Alerts for follows and subscriptions. | An alert service chosen; its widget URL in `.env`. | 2026-11-14 |
| A webcam mask and a creative way to fit the owner's face into the layout (the owner has ideas to describe). | The first scenes (step 6), with a plain webcam in a corner. | 2026-11-14 |
| Choose the video editing software, and check that it reads the recordings (AV1 and AAC in Hybrid MP4, step 4); the free version of DaVinci Resolve on Linux has limits on codecs to check in its documentation. | The first recordings. | 2026-11-15 |
| The Twitch chat and stats panels inside OBS: OBS offers « Connect Account » for Twitch only outside Wayland; check whether running OBS through XWayland is worth it, without breaking the capture of step 5. | The capture chosen (step 5). | 2026-11-15 |
| Twitch's Enhanced Broadcasting (several qualities encoded on the computer): check whether Twitch supports it on Linux with an AMD card. | The stream test (step 8). | 2026-11-15 |
| The hotkeys of OBS (scenes, mute) while the game has the focus: check in OBS's source whether they work under Wayland, and the « Wayland Hotkeys » plugin on Flathub if they don't. | The scenes (step 6); the live checklists (step 9). | 2026-11-15 |
| A quiet music during the scene `pause`, licensed for live streams and VODs (Twitch mutes or strikes copyrighted music). | The scenes of step 6; a music source chosen and listed in `assets/NOTICE.md`. | 2026-11-15 |
| A HUD overlay (a frame of information over the game), as some Path of Exile channels have: what changes during a session (the level, the deaths, the area, the time played), read automatically rather than typed by hand (the game's log `Client.txt` or Grinding Gear Games' API, both to check); it must hide no part of the game's interface (globes, skills, minimap, stash, the price window of Exile Market) and stay still, to cost no bitrate. | The first live; a reference from the owner (a channel or a screenshot). | 2026-11-15 |
| An animated offline image: the rain of the scenes falling in Twitch's player, as a GIF (Twitch accepts GIF, JPG or PNG up to 10 MB for the Video Player Banner); a short loop at a smaller size to stay under the limit. | The offline image (2026-11-15). | 2026-11-15 |
