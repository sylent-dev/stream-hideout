# OBS setup

How OBS Studio is set up for the channel, on Bazzite (KDE Plasma, Wayland) with the AMD Radeon RX 9070 XT described in [`hardware.md`](hardware.md). Read from the system and from OBS's own log on 2026-11-14.

- Part 1, the installation and the hardware encoder: this page (step 3).
- Part 2, the profile settings for Twitch: step 4.
- Part 3, the capture of the game, of Exile Market and of the sound: step 5.

OBS runs in English here (the system language is `en_US`): the menu names below are OBS's English ones.

## Installation

OBS is installed as a Flatpak from Flathub, `com.obsproject.Studio`. It is one of the two official builds for Linux, the one recommended outside Ubuntu:

- « OBS Studio is officially distributed as a Flatpak on Flathub and a PPA for Ubuntu 26.04 and newer. » ([obsproject.com/download](https://obsproject.com/download), read on 2026-11-14)
- « The Flatpak distribution is recommended for non-Ubuntu distributions. » ([OBS wiki, Install Instructions](https://github.com/obsproject/obs-studio/wiki/Install-Instructions#linux))

On Bazzite, Flatpaks from Flathub are also the main way to install an application, through the Bazaar store or `flatpak install` ([Bazzite docs](https://docs.bazzite.gg/Installing_and_Managing_Software/Flatpak/)).

| Item | Installed | Role |
|---|---|---|
| `com.obsproject.Studio` | 33.0.1, built on 2026-10-29 | OBS itself |
| `org.freedesktop.Platform` | 26.08 | the runtime: the base libraries the Flatpak runs on |
| `org.freedesktop.Platform.GL.default` | Mesa 26.2.5 | the graphics drivers inside the Flatpak, used for the rendering and for VA-API; the system has its own Mesa (26.2.6) |
| `com.obsproject.Studio.Plugin.GStreamerVaapi` | 0.4.2 | a second set of VA-API encoders, through GStreamer (see below) |
| `com.obsproject.Studio.Plugin.Gstreamer` | 0.4.1 | GStreamer for OBS, needed by the plugin above |
| `com.obsproject.Studio.Plugin.OBSVkCapture` | 1.5.6 | the « Game Capture » source of obs-vkcapture, compared at step 5 |

The Flatpak's permissions give it every device (`devices=all`: the graphics card, the webcam), PipeWire (screen capture and sound), Wayland, and the whole file system (`filesystems=host`, to save recordings anywhere). They come from the Flathub package: no override is set (`flatpak override --show com.obsproject.Studio` is empty).

To install the same set on another machine:

```sh
flatpak install flathub com.obsproject.Studio
flatpak install flathub com.obsproject.Studio.Plugin.OBSVkCapture com.obsproject.Studio.Plugin.GStreamerVaapi
```

To read the version: **Help → About** in OBS, or `flatpak info com.obsproject.Studio`. Update OBS on a day without a live, then check it in a stream test: a new version can change a source or an encoder.

### What is already in OBS

OBS has been used before on this machine: it holds a profile « Untitled » (output mode Simple, encoder x264, 6000 kbps) and a scene collection « Untitled ». A **profile** keeps the output settings (encoder, bitrate, resolution, the stream key); a **scene collection** keeps the scenes and their sources. Step 4 sets the profile for Twitch, and step 6 builds the scenes of the first live.

The profile folder (`~/.var/app/com.obsproject.Studio/config/obs-studio/basic/profiles/`) holds the stream key in its `service.json`: it is never copied into this repository.

## Hardware encoder

An **encoder** compresses the picture of the stream before it is sent to Twitch. **x264** does it with the processor; a **hardware encoder** does it with a dedicated part of the graphics card, so the game keeps the processor. On Linux, OBS reaches the AMD encoder through **VA-API**.

OBS lists its encoders in its log at each start (**Help → Log Files → View Current Log**, section `Available Encoders`). The log of 2026-11-12 lists these video encoders:

| Name in OBS | Made by | Hardware |
|---|---|---|
| FFmpeg VAAPI H.264 | OBS (built in, `obs-ffmpeg`) | the card chosen in its « VAAPI Device » field |
| FFmpeg VAAPI HEVC | OBS (built in) | same |
| FFmpeg VAAPI AV1 | OBS (built in) | same |
| VAAPI H.264 on Navi 48 [Radeon RX 9070/9070 XT/9070 GRE] | the GStreamer VA-API plugin | RX 9070 XT |
| VAAPI H.265 on Navi 48 [Radeon RX 9070/9070 XT/9070 GRE] | the GStreamer VA-API plugin | RX 9070 XT |
| VAAPI AV1 on Navi 48 [Radeon RX 9070/9070 XT/9070 GRE] | the GStreamer VA-API plugin | RX 9070 XT |
| VAAPI H.264 on Granite Ridge [Radeon 610M] | the GStreamer VA-API plugin | the integrated graphics: not to be used |
| VAAPI H.265 on Granite Ridge [Radeon 610M] | the GStreamer VA-API plugin | the integrated graphics: not to be used |
| x264 | OBS (built in) | the processor (software) |
| SVT-AV1, AOM AV1 | OBS (built in) | the processor (software) |

Points to know:

- **The right card.** OBS draws the picture on the RX 9070 XT, the card the screens are plugged into, so the encoder must be the one of that card. The two cards are `/dev/dri/renderD128` (RX 9070 XT, PCI `03:00.0`) and `/dev/dri/renderD129` (Radeon 610M, PCI `7c:00.0`), read with `ls -l /dev/dri/by-path/`. The FFmpeg VAAPI encoders pick by default the first device from `renderD128` that supports the codec ([`vaapi-utils.c`](https://github.com/obsproject/obs-studio/blob/33.0.1/plugins/obs-ffmpeg/vaapi-utils.c)), here the RX 9070 XT, and their « VAAPI Device » field lists, by name, each card that supports the codec ([`obs-ffmpeg-vaapi.c`](https://github.com/obsproject/obs-studio/blob/33.0.1/plugins/obs-ffmpeg/obs-ffmpeg-vaapi.c)).
- **Advanced output mode only.** The Simple output mode offers x264, and a hardware encoder only from Intel (QSV), NVIDIA (NVENC), AMD through AMF, or Apple ([`OBSBasicSettings.cpp`](https://github.com/obsproject/obs-studio/blob/33.0.1/frontend/settings/OBSBasicSettings.cpp)): no VA-API entry. The VA-API encoders show only in **Output Mode: Advanced**, which step 4 uses.
- **No AMF.** The runtime extension `org.freedesktop.Platform.amd.amf` is installed, but OBS loads no AMF encoder (none in the log): the « Hardware (AMD, …) » entries of the Simple mode don't appear. VA-API is the way to the AMD encoder here.

Step 4 chooses the encoder, between the built-in FFmpeg VAAPI and the GStreamer plugin, and the codec: H.264 is the one every Twitch viewer can read.

## Check

The owner runs this check on the streaming machine, OBS closed at the start. It changes no setting: every window is closed with **Cancel**.

1. Start OBS from the applications menu.
2. **Help → About**. Expected: version 33.0.1 (or newer, if OBS was updated since: then write the new version in the table).
3. **Help → Log Files → View Current Log**, then find `Available Encoders`. Expected: the lines `FFmpeg VAAPI H.264`, `FFmpeg VAAPI HEVC`, `FFmpeg VAAPI AV1`, and `VAAPI H.264 on Navi 48 [Radeon RX 9070/9070 XT/9070 GRE]`.
4. **File → Settings → Output**, set **Output Mode** to **Advanced**, open the **Streaming** tab, then the **Video Encoder** list. Expected: the encoders of step 3 are in the list.
5. In that list, choose **FFmpeg VAAPI H.264**. Expected: the **VAAPI Device** field shows `Navi 48 [Radeon RX 9070/9070 XT/9070 GRE]` (or, if OBS doesn't find the name, the path `/dev/dri/by-path/pci-0000:03:00.0-render`), not the Radeon 610M, which may be the other entry of the list.
6. Click **Cancel**, and confirm if OBS asks. Expected: **File → Settings → Output** shows the Simple mode again, as before.
7. Free test: anything else worth looking at in these settings or in the log (an error, a warning, a plugin missing).

| Test | Result (OK / not OK) | Note |
|---|---|---|
| 2. Version | | |
| 3. Encoders in the log | | |
| 4. Encoders in the settings | | |
| 5. VAAPI device | | |
| 6. Settings unchanged | | |
| 7. Free test | | |

The results come back in the conversation; this table stays blank.
