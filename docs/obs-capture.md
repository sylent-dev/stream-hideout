# OBS capture

The capture of the game, of Exile Market and of the sound: part 3 of the OBS setup, after the installation in [`obs-setup.md`](obs-setup.md) and the profile in [`obs-output.md`](obs-output.md). Written on 2026-11-15 for OBS 33.0.1 (Flatpak) on Bazzite (KDE Plasma 6.8.2, Wayland), with the screens and the headset of [`hardware.md`](hardware.md).

## Summary

| What | Source in OBS | Name | Tracks |
|---|---|---|---|
| The game and the Exile Market window, as seen on the left screen (`DP-2`) | Screen Capture (PipeWire), cursor shown | `game-screen` | none (no sound) |
| The microphone of the HyperX headset | the global device Mic/Auxiliary Audio, with three filters | `microphone` | 1 and 2 |
| The sound of the game alone, at −2.5 dB | Application Audio Capture (PipeWire), from a plugin | `game-audio` | 1 and 3 |
| The rest of the computer's sound (browser, notifications, voice chat) | none: the global device Desktop Audio is disabled | | |

Track 1 is what Twitch receives; tracks 2 and 3 are for the editing of the recordings ([`obs-output.md`](obs-output.md#the-recording)).

## What was wrong on 2026-11-15

The recording of 2026-11-15 (49 seconds, before this step) was measured with `ffmpeg` (`volumedetect`, `ebur128`):

- its three sound tracks were identical: every source was sent to every track (`"mixers": 255` in the scene collection);
- the sound reached 0 dBFS, the maximum of a digital signal, on 1317 samples: it clipped (saturated), which sounds like a crackle;
- the microphone was captured **twice**: by the global device **Mic/Aux** (set to the default input, the headset) and by the source `hyperx-microphone` of the scene `screen`, both at full volume. Two copies of the same signal add up: the voice came out about 6 dB louder than its level, hence the clipping;
- **Desktop Audio** captured everything the headset plays: the game, but also a video in the browser or a notification.

## Why these choices

### The picture: Screen Capture

Exile Market shows the price of an item in its own small window, over the game ([README of Exile Market](https://github.com/sylent-dev/rust-exile-market#copy-an-item)): an X11 window, through XWayland, separate from the game's. The capture must show both, since the price is what the channel showcases.

| Method | Shows Exile Market | Note |
|---|---|---|
| **Screen Capture (PipeWire)** of `DP-2` | yes | the picture KDE composes: the game, Exile Market, and anything else on that screen |
| Window Capture (PipeWire) of the game | no | only the chosen window |
| Game Capture (obs-vkcapture) | no | the frames of the game alone, taken from Vulkan; the game must start with `OBS_VKCAPTURE=1 %command%` in its Steam launch options ([obs-vkcapture](https://github.com/nowrep/obs-vkcapture#usage)) |

Screen Capture is the only method that shows the price window, so it is the one used. Its cost: anything that opens on the left screen goes on air. To keep it safe:

- OBS, the chat and the browser stay on the right screen (`DP-3`);
- KDE turns on **Do Not Disturb** by itself while the screen is shared, so no notification pops up: `WhenScreenSharing` is on by default in Plasma 6.8.2 ([`donotdisturbsettings.kcfg`](https://github.com/KDE/plasma-workspace/blob/v6.8.2/libnotificationmanager/kcfg/donotdisturbsettings.kcfg)), and wasn't changed on this machine (no such line in `~/.config/plasmanotifyrc`). The check below confirms that a capture by OBS counts as a screen sharing;
- the scene `pause` of step 6 hides the screen when the owner leaves the game.

**Show Cursor** is checked (its default, [`screencast-portal.c`](https://github.com/obsproject/obs-studio/blob/33.0.1/plugins/linux-pipewire/screencast-portal.c)): the viewers see the pointer go over the item before Ctrl+D, which explains the price that shows.

The source remembers the chosen screen through a `RestoreToken` that the portal gives, saved in the scene collection: it is tied to this machine, and step 6 checks it when the collection is exported.

### The sound of the game: a plugin

OBS 33 on Linux has no capture of one application's sound: its log of 2026-11-15 loads `linux-pulseaudio`, whose sources capture a whole device, and `linux-pipewire`, whose sources are only video (Screen Capture, Window Capture, Video Capture Device, in its [locale file](https://github.com/obsproject/obs-studio/blob/33.0.1/plugins/linux-pipewire/data/locale/en-US.ini)). The **PipeWire Audio Capture** plugin (version 1.2.2, GPL-2.0, by `dimtpap`) adds **Application Audio Capture (PipeWire)**, which takes the sound of the chosen application only ([its README](https://github.com/dimtpap/obs-pipewire-audio-capture)). It is on Flathub as an extension of the OBS Flatpak, like obs-vkcapture, and the permission it needs (`xdg-run/pipewire-0`) is already in the Flatpak's.

With the game on its own track, its volume is set apart from the voice, and the browser, a voice chat or a notification never go on air. Music played in the browser could otherwise get the VOD muted by Twitch.

### The microphone: one source, three filters

The global device **Mic/Auxiliary Audio** stays: a global device plays in every scene, so the voice can't go missing from a scene of step 6. It is set to the headset by name, not to « Default »: the webcam has a microphone too, and the default input could change. The source `hyperx-microphone` is removed.

The system volume of the headset microphone is at 100 % (read with `pactl` on 2026-11-15; [`hardware.md`](hardware.md#audio) had noted 120 %): it stays there, and the level is set in OBS.

A **filter** changes the sound of one source, in the order of the list, from top to bottom:

1. **Noise Suppression**, method **RNNoise**: removes the steady noise (the computer's fans, the hiss of the microphone) and part of the keyboard. RNNoise is OBS's default when it is built in, which the method list shows ([`noise-suppress-filter.c`](https://github.com/obsproject/obs-studio/blob/33.0.1/plugins/obs-filters/noise-suppress-filter.c)).
2. **Compressor**: lowers the voice when it goes over a threshold, so a shout during a fight and a quiet comment end up closer in level. OBS's defaults are a ratio of 10:1, a threshold of −18 dB, an attack of 6 ms and a release of 60 ms ([`compressor-filter.c`](https://github.com/obsproject/obs-studio/blob/33.0.1/plugins/obs-filters/compressor-filter.c)); a ratio of 4:1 is used here, softer, so the voice keeps its life.
3. **Limiter**: a wall no peak goes through. At its default of −6 dB ([`limiter-filter.c`](https://github.com/obsproject/obs-studio/blob/33.0.1/plugins/obs-filters/limiter-filter.c)), the voice can't clip any more, even when the owner shouts.

If the voice is too low once the duplicate is gone, a **Gain** filter goes between 1 and 2 (procedure, step 24).

No noise gate for now: it cuts the microphone between sentences, and cuts the start of quiet words when it is badly set. RNNoise is enough to try first; the stream test decides.

### The levels

OBS's mixer colors its meters by level ([`VolumeMeter.cpp`](https://github.com/obsproject/obs-studio/blob/33.0.1/frontend/components/VolumeMeter.cpp), with the default **Sample Peak** meter of the profile): green below −20 dBFS, yellow from −20 to −9, red above −9. The voice at a normal level should peak in the yellow, never in the red; the game should stay well under the voice, about 10 dB lower, so the commentary stays clear over a fight.

## Procedure

Before starting: the game installed, Exile Market in its folder, OBS closed.

### The plugin

1. In a terminal, install the plugin in the system installation, like OBS and its other plugins, then answer `y`:

   ```sh
   flatpak install --system flathub com.obsproject.Studio.Plugin.PipeWireAudioCapture
   ```

2. Start Path of Exile 2 from Steam, in **windowed fullscreen**, on the left screen (`DP-2`); start Exile Market.
3. Start OBS from the applications menu.

### The global audio devices

4. **File → Settings → Audio**, section **Global Audio Devices**:
   - **Desktop Audio**: **Disabled**;
   - **Desktop Audio 2**: **Disabled**;
   - **Mic/Auxiliary Audio**: **HyperX Cloud III S Wireless Mono**;
   - **Mic/Auxiliary Audio 2**, **3** and **4**: **Disabled**.
5. Click **OK**.
6. In the **Audio Mixer** dock, click the name **Mic/Aux**, then **Rename...**: type `microphone`, then **OK**.

### The scene

7. In the **Scenes** dock, select the scene `screen`.
8. In the **Sources** dock, select `hyperx-microphone`, click the **trash** icon under the list, and confirm with **Yes**: the microphone is now only the global device.
9. In the **Sources** dock, right-click `screen-2`, then **Rename**: type `game-screen`, then **Enter**.
10. Double-click `game-screen`: its properties open.
11. Click **Select Monitor**: KDE's window opens. Choose the left screen (`DP-2`, where the game is), then confirm.
12. **Show Cursor**: checked. Click **OK**.
13. Look at the preview: the game fills it, with no black border, since the screen and the canvas are both 2560 × 1440. Leave the **lock** icon of `game-screen` closed, so it can't be moved by mistake. Only if a border shows: click the lock to open it, right-click `game-screen`, **Transform → Fit to screen** (greyed while the source is locked), then close the lock again.

### The sound of the game

14. In the **Sources** dock, click **+**, then **Application Audio Capture (PipeWire)**.
15. **Create new**, name `game-audio`, then **OK**.
16. **Capture Mode**: **Single application**; **Match Priority**: **Match by app name, fallback to executable name**; **Application**: `PathOfExileSteam.exe`. Click **OK**. The list holds only the applications playing a sound when the window opens: if the game is missing, close the properties and open them again with the game running.

Under Proton, the game's sound stream has two names in PipeWire (read with `pactl list sink-inputs` on 2026-11-15): the application name `PathOfExileSteam.exe`, and the executable name `wine64-preloader`, shared by every game started through Wine. The plugin lists the executable names by default ([`pipewire-audio-capture-app.c`](https://github.com/dimtpap/obs-pipewire-audio-capture/blob/1.2.2/src/pipewire-audio-capture-app.c)), so the game would show only as `wine64-preloader`. **Match Priority** changes only the names the list shows; the plugin then captures every stream whose application or executable name equals the chosen one (`node_is_targeted`). Choosing `PathOfExileSteam.exe` targets the game alone, where `wine64-preloader` would also take any other Wine game.

### The tracks

17. **Edit → Advanced Audio Properties**.
18. On the line `microphone`, column **Tracks**: **1** and **2** checked, **3** to **6** unchecked.
19. On the line `game-audio`: **1** and **3** checked, **2**, **4**, **5** and **6** unchecked.
20. If another line has a track checked (`webcam`): uncheck them all. Click **Close**.

### The filters of the microphone

21. In the **Audio Mixer** dock, click the name `microphone`, then **Filters**.
22. Under **Audio Filters**, click **+** for each filter, in this order, keeping its default name:
    - **Noise Suppression**: **Method**: **RNNoise (good quality, more CPU usage)**;
    - **Compressor**: **Ratio** `4`, **Threshold** `-18` dB, **Attack** `6` ms, **Release** `60` ms, **Output Gain** `0` dB, **Sidechain/Ducking Source**: **None**;
    - **Limiter**: **Threshold** `-6` dB, **Release** `60` ms.
23. Close the filters window.

### The levels

24. In the **Audio Mixer** dock, set the fader of `microphone` at **0 dB**. Speak as during a game, for ten seconds: the meter should reach the yellow. If it stays in the green, open its filters again, add a **Gain** filter, move it to the second place with the arrows under the list, and raise its **Gain** until a normal sentence reaches the yellow.
25. Shout once, as during a boss fight: the meter stops at −6 dB (the limiter) and never reaches the red end.
26. Set the fader of `game-audio` at **0 dB**. During a fight, its meter should stay about 10 dB under the voice's; lower the fader only if the game comes closer. In the check of 2026-11-15, the fader at −16 dB left the game 27 dB under the voice (loudness over 3 seconds, at its loudest: −43.7 LUFS for the game, −16.7 for the voice), almost inaudible: at 0 dB, it comes about 11 dB under. The owner kept **−2.5 dB** (about 13.5 dB under the voice).

The settings save themselves in the scene collection: nothing to export at this step (step 6 exports the collection).

## Check

The owner runs this check right after the procedure, with the game and Exile Market running.

1. **Sources** dock, **+**. Expected: the list holds **Application Audio Capture (PipeWire)**. Close the list with **Esc**.
2. Look at the preview. Expected: the game fills it, with the pointer, and nothing from the right screen.
3. In the game, put the pointer over an item and press **Ctrl+D**. Expected: the price window of Exile Market shows in the preview too.
4. In a terminal on the right screen, run `notify-send "Test" "Notification de test"`. Expected: no notification shows on the left screen nor in the preview.
5. Play a video with sound in the browser. Expected: no meter of the **Audio Mixer** moves for it.
6. Speak, then play. Expected: the **Audio Mixer** shows only `microphone` and `game-audio` as active sources; `microphone` moves only when you speak, `game-audio` only with the game.
7. **Start Recording**, then, for one minute: speak at a normal level, shout once, and fight with the game's sound. **Stop Recording**, then copy the file from `~/Videos/Streaming` into `inputs/`. Expected: Claude Code measures that track 2 holds only the voice, track 3 only the game, and that no track reaches 0 dBFS.
8. During the minute of recording, watch the game. Expected: no visible drop of frames per second compared to before the capture; **Docks → Stats** shows no frames missed due to rendering lag.
9. Free test: anything else to note (an echo, a voice that sounds metallic after RNNoise, a delay between the voice and the picture).

| Test | Result (OK / not OK) | Note |
|---|---|---|
| 1. Plugin installed | | |
| 2. Picture of the left screen | | |
| 3. Exile Market window | | |
| 4. No notification | | |
| 5. Browser not captured | | |
| 6. Two audio sources | | |
| 7. Recording measured | | |
| 8. Game performance | | |
| 9. Free test | | |

The results come back in the conversation; this table stays blank.
