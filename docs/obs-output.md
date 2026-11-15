# OBS output

The profile settings of OBS for Twitch and for the local recording: part 2 of the OBS setup, after the installation in [`obs-setup.md`](obs-setup.md). Written on 2026-11-15 for OBS 33.0.1 (Flatpak) on Bazzite (KDE Plasma, Wayland), with the AMD Radeon RX 9070 XT of [`hardware.md`](hardware.md).

## Summary

| Setting | Stream (Twitch) | Recording |
|---|---|---|
| Picture | 1600 × 900, 60 frames per second | 2560 × 1440, 60 frames per second |
| Video encoder | FFmpeg VAAPI H.264, on the RX 9070 XT | FFmpeg VAAPI AV1, on the RX 9070 XT |
| Rate control | CBR, 6000 kbps | CQP, QP 20 |
| Keyframe interval | 2 s | 2 s |
| Max B-frames | 2 | 0 |
| Sound | AAC, 160 kbps, stereo, 48 kHz, track 1 | AAC, 160 kbps per track, tracks 1, 2 and 3 |
| File | none | Hybrid MP4, in `~/Videos/Streaming` |

## Why these values

### What Twitch asks

Twitch's [Broadcasting Guidelines](https://help.twitch.tv/s/article/broadcasting-guidelines), read in French on 2026-11-15 from a copy the owner made (the help center doesn't load for an automated reading):

- **CBR** (constant bitrate): the encoder sends the same amount of data every second. Twitch recommends it to every streamer: a variable bitrate drops during calm moments and jumps back during fights, which makes some viewers' playback stutter.
- **Keyframe interval of 2 seconds**: a keyframe is a complete picture; between two of them, the encoder sends only what changed.
- For NVIDIA's NVENC, the only GPU encoder the article details: 1080p at 60 fps and 6000 kbps, 720p at 60 fps and 4500 kbps, **B-frames: 2**. The article has no settings for AMD or VA-API: the ones below follow NVENC's.
- Sound: AAC-LC, stereo or mono, **160 kbps at most**, any sample rate.

OBS knows Twitch's limits from its own list of services (`services.json`, version 295 on this machine): 6000 kbps of video at most, a keyframe every 2 s, CBR, H.264 only. It applies them to the stream encoder as long as **Ignore streaming service setting recommendations** stays unchecked ([`rtmp-common.c`](https://github.com/obsproject/obs-studio/blob/33.0.1/plugins/rtmp-services/rtmp-common.c)). OBS allows 320 kbps of sound for Twitch, more than the 160 kbps of Twitch's article: the article wins.

### 1600 × 900 at 60 frames per second

Path of Exile 2 fills the screen with particles, and 6000 kbps is the most Twitch accepts. At 1080p60, the picture breaks into blocks during fights; at 720p, the prices Exile Market shows become harder to read, and they are what the channel showcases. 900p60 sits between the two; the stream test (step 8) checks it on a real fight, and falls back to 720p60 at 4500 kbps if the picture still breaks.

The **canvas** (the picture OBS composes the scenes on) stays at 2560 × 1440, the size of the game's screen: the stream is scaled down to 1600 × 900 by the stream encoder alone (**Rescale Output**, done on the graphics card, [`AdvancedOutput.cpp`](https://github.com/obsproject/obs-studio/blob/33.0.1/frontend/utility/AdvancedOutput.cpp)), so the recording keeps the full 2560 × 1440. The **Lanczos** filter keeps the text sharper than the default when scaling down.

### B-frames

A B-frame is a picture built from the one before and the one after it: it saves data, so the picture is better at the same bitrate. The H.264 encoder of the RX 9070 XT supports them (`vainfo -a` gives `l1=1` for `VAProfileH264High`), so OBS shows its **Max B-frames** field ([`vaapi-utils.c`](https://github.com/obsproject/obs-studio/blob/33.0.1/plugins/obs-ffmpeg/vaapi-utils.c)). Its default is 0; 2 follows Twitch's article.

### The recording

The recordings are kept to make videos and clips later (see [`backlog.md`](../backlog.md)), so they are made by a second encoder, at the full size of the canvas and in a better quality than the stream:

- **AV1**: the codec of the RX 9070 XT that gives the smallest files for the same quality. The editing software isn't chosen yet: Kdenlive reads AV1; the free version of DaVinci Resolve is checked when the editor is chosen (backlog).
- **CQP** (constant quality): the encoder keeps the same quality and uses as much data as the picture needs, which suits a file but not a live stream. QP 20 is OBS's default; for AV1, OBS multiplies it by 5 on the encoder's scale ([`obs-ffmpeg-vaapi.c`](https://github.com/obsproject/obs-studio/blob/33.0.1/plugins/obs-ffmpeg/obs-ffmpeg-vaapi.c)). The size per hour depends on the game: the check of 2026-11-15 measured 18.7 Mbit/s on 49 seconds of Path of Exile 2 (`ffprobe`), about **8.4 GB per hour**.
- **Hybrid MP4**: an MP4 file that stays readable if OBS or the computer stops in the middle of a recording, unlike a plain MP4.
- **Three sound tracks**: track 1 holds the whole mix (what the stream sends), track 2 the microphone alone, track 3 the game alone, so a video can lower the game under the voice. Which source goes to which track is set at step 5.

The recordings go to `/var/home`, where 165 GB were free on 2026-11-15, about 19 hours of recording: delete or move the old ones as they pile up.

### The sound encoder

The profile named **libfdk_aac**, an AAC encoder that the Flatpak doesn't hold: its log lists only `ffmpeg_aac` (FFmpeg AAC) and `ffmpeg_opus`. Twitch needs AAC, so both outputs use **FFmpeg AAC**.

### Not used for now

- **Connect Account** for Twitch: OBS doesn't offer it under Wayland (`RegisterTwitchAuth` in [`TwitchAuth.cpp`](https://github.com/obsproject/obs-studio/blob/33.0.1/frontend/oauth/TwitchAuth.cpp) returns before registering it), so the chat and stats panels of Twitch aren't in OBS. The stream key is pasted instead, and the chat is read in Twitch's Stream Manager, in the browser on the right screen.
- **Enhanced Broadcasting**: the stream in several qualities encoded on the computer; not checked yet on Linux with an AMD card, so it stays off.
- **Twitch VOD Track**: a second sound track for the VODs, without the music; no music is planned for now.

## Secrets in the profile

The profile folder (`~/.var/app/com.obsproject.Studio/config/obs-studio/basic/profiles/<name>/`) holds two kinds of secrets, and is never copied into this repository:

- `service.json`: the stream key;
- `basic.ini`: the tokens of an account connected to OBS (a YouTube account was connected before 2026-11-15, in its `[YouTube]` section).

If the stream key leaks, reset it on Twitch's stream settings page (the **Get Stream Key** button of OBS opens it).

## Procedure

OBS open, not streaming nor recording: OBS doesn't change the video settings while an output is active.

### Profile

1. **Profile → Rename...**: give the profile a name (on 2026-11-15, the owner named it `sylent`).

### Stream

2. **File → Settings → Stream**.
3. **Service**: **Twitch**; **Server**: **Auto (Recommended)**.
4. **Enable Enhanced Broadcasting**: unchecked; **Ignore streaming service setting recommendations**: unchecked.
5. If the **Stream Key** line doesn't show under **Server** (it can stay hidden after a change of service, when an account was connected before): click **OK**, and open **File → Settings → Stream** again.
6. On the **Stream Key** line, click **Get Stream Key**: the browser opens Twitch's stream settings page. Copy the primary stream key, paste it into the **Stream Key** field of OBS, then click **Apply**.

### Video

7. **Video** in the left column:
   - **Base (Canvas) Resolution**: `2560x1440`;
   - **Output (Scaled) Resolution**: `2560x1440` (the **Downscale Filter** then shows `[Resolutions match, no downscaling required]`);
   - **Common FPS Values**: `60`.
8. Click **Apply**.

### Streaming encoder

9. **Output** in the left column; **Output Mode**: **Advanced**; tab **Streaming**:
   - **Audio Track**: `1`;
   - **Video Encoder**: **FFmpeg VAAPI H.264**;
   - **Audio Encoder**: **FFmpeg AAC**;
   - **Rescale Output**: **Lanczos (Sharpened scaling, 36 samples)**, then `1600x900` in the field next to it.
10. In **Encoder Settings**, under the encoder:
    - **VAAPI Device**: **Navi 48 [Radeon RX 9070/9070 XT/9070 GRE]** (not the Radeon 610M: see [`obs-setup.md`](obs-setup.md));
    - **Profile**: **High**;
    - **Rate Control**: **CBR**;
    - **Bitrate**: `6000`;
    - **Keyframe Interval (0=auto)**: `2`;
    - **Max B-frames**: `2`;
    - **Level**: unchanged.

### Recording encoder

11. Tab **Recording**:
    - **Type**: **Standard**;
    - **Recording Path**: the `Videos/Streaming` folder of the home folder (**Browse**; the owner created `Streaming` on 2026-11-15);
    - **Recording Format**: **Hybrid MP4 (.mp4)**;
    - **Audio Track**: `1`, `2` and `3` checked;
    - **Video Encoder**: **FFmpeg VAAPI AV1**;
    - **Audio Encoder**: **FFmpeg AAC**;
    - **Rescale Output**: **Disabled**.
12. In **Encoder Settings**: **VAAPI Device**: **Navi 48 [Radeon RX 9070/9070 XT/9070 GRE]**; **Rate Control**: **CQP**; **QP**: `20`; **Keyframe Interval (0=auto)**: `2`.

### Sound

13. Tab **Audio** (still in **Output**): **Audio Bitrate** `160` for **Track 1**, **Track 2** and **Track 3**.
14. **Audio** in the left column: **Sample Rate** `48 kHz`, **Channels** **Stereo**.
15. Click **Apply**, then **OK**.

## Check

The owner runs this check after the procedure, with Path of Exile 2 running. The stream itself is checked in the stream test (step 8): this check sends nothing to Twitch.

1. **File → Settings → Output**: the values of steps 9 to 13 are still there after closing and opening the window again.
2. **File → Settings → Video**: canvas and output in 2560 × 1440, 60 FPS.
3. In a scene that shows the game (step 5 adds the real capture; until then, any scene with a source), click **Start Recording**, play two minutes in a fight, then click **Stop Recording**. Expected: an `.mp4` file in `~/Videos/Streaming`.
4. Open that file with the video player of the system. Expected: the picture is sharp, in 2560 × 1440, and the sound plays.
5. Note the size of the file and its length (in its properties, or in the player): the size divided by the minutes, multiplied by 60, gives the size of one hour of recording.
6. **Help → Log Files → View Current Log**, then find `[FFmpeg VAAPI encoder: 'advanced_video_recording'] settings:`. Expected, in the lines under it: `device: /dev/dri/by-path/pci-0000:03:00.0-render`, `rate_control: CQP`, `qp: 20`, `keyint: 120`, `width: 2560`, `height: 1440`.
7. Free test: anything else worth looking at in these settings, in the file or in the log.

| Test | Result (OK / not OK) | Note |
|---|---|---|
| 1. Output settings kept | | |
| 2. Video settings | | |
| 3. File recorded | | |
| 4. File plays | | |
| 5. Size for one hour | | |
| 6. Log of the encoder | | |
| 7. Free test | | |

The results come back in the conversation; this table stays blank.
