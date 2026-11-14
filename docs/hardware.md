# Hardware

The inventory of the streaming setup, read from the system on 2026-11-14 (Bazzite 45.20261111, KDE Plasma on Wayland, kernel 7.3.3). Serial numbers and network addresses are left out on purpose.

## Summary

Nothing blocks the first live: the graphics card encodes H.264, HEVC and AV1 in hardware, a microphone and a webcam are connected, and the upload is far above what a stream needs.

## Computer

| Part | Model | Read with |
|---|---|---|
| Processor | AMD Ryzen 7 9700X, 8 cores, 16 threads, up to 5.58 GHz | `lscpu` |
| Graphics card | AMD Radeon RX 9070 XT, 16 GB (RDNA 4, `gfx1201`), Mesa 26.2.6 | `glxinfo -B`, `vainfo` |
| Integrated graphics | AMD Radeon 610M, in the processor; no screen is plugged into it | `lspci` |
| Memory | 32 GB (31.9 GB usable) | `/proc/meminfo` |
| Motherboard | ASUS TUF GAMING X870E-PLUS WIFI7 | `/sys/class/dmi/id/` |
| Storage | 2 × Crucial P510 2 TB (NVMe SSD); 169 GB free in `/var/home`, where the recordings will go | `lsblk`, `df -h` |

### Hardware encoder

The hardware encoder is the part of the graphics card that compresses the video of the stream, so that the processor stays free for the game. On Linux, OBS reaches it through VA-API. `vainfo` lists an encoder (`VAEntrypointEncSlice`) for:

- H.264 (Constrained Baseline, Main, High): the codec every Twitch viewer can read;
- HEVC (Main, Main 10);
- AV1 (Profile 0).

Step 3 checks that OBS shows these encoders in its settings, and step 4 chooses one.

## Screens

Two iiyama screens, 27 inches (60 × 34 cm), model name `PL2770QS` in their EDID, both plugged into the RX 9070 XT by DisplayPort:

| Output | Position | Mode in use | KDE priority |
|---|---|---|---|
| `DP-2` | left | 2560 × 1440 at 165 Hz | 1 (primary) |
| `DP-3` | right | 2560 × 1440 at 165 Hz | 2 |

Scale 100 %, HDR and VRR off (read with `kscreen-doctor -o`). A stream is usually sent in 1920 × 1080 or less: OBS scales the 2560 × 1440 picture down (step 4).

## Audio

PipeWire handles the sound. The devices found by `pactl`:

| Device | Connection | Microphone | Output |
|---|---|---|---|
| HyperX Cloud III S Wireless (headset) | USB wireless receiver | mono, 48 kHz, 16 bits; the default input; its volume is set to 120 % in the system | stereo, 48 kHz; the default output |
| OBSBOT Meet 2 (webcam) | USB | stereo, 32 kHz | none |
| Ryzen HD Audio Controller (motherboard) | jacks | nothing plugged in seen | digital (S/PDIF) |
| Navi 48 HDMI/DP Audio (graphics card) | through the screens | none | the screens' sound |

The headset microphone is the one to use: it is close to the mouth and picks up less of the room and of the keyboard than the webcam's. The volume of 120 % amplifies the signal digitally: step 5 sets the level in OBS instead, and checks it does not clip (saturate).

## Webcam

OBSBOT Meet 2, USB, read with `v4l2-ctl --list-devices`:

- MJPEG (compressed): 3840 × 2160, 1920 × 1080, 1280 × 720;
- YUYV (uncompressed): 640 × 480 and 640 × 360 only.

1920 × 1080 in MJPEG is enough for a webcam shown in a corner of the stream. An « OBS Virtual Camera » device also exists: OBS creates it, it is not a camera.

## Network

| Item | Value | Read with |
|---|---|---|
| Connection | Ethernet, link at 1 Gbit/s; Wi-Fi off | `ip`, `nmcli` |
| Upload | 242, 359 and 272 Mbit/s over three tries | `curl` sending 50 MB to `speed.cloudflare.com/__up` |

A stream to Twitch uses a few Mbit/s: the upload measured leaves a very large margin, even with a recording and a game update at the same time. Step 4 picks the bitrate from Twitch's [Broadcasting Guidelines](https://help.twitch.tv/s/article/broadcasting-guidelines), which have to be opened in a browser: the help center did not load for an automated reading on 2026-11-14.

This measure goes to a Cloudflare server close by, at one moment of the day. The stream test (step 8) checks the real connection to Twitch, at the hour of a live.

## Software already installed

- OBS Studio 33.0.1, from Flathub (`com.obsproject.Studio`): documented at step 3.
- The `obs-vkcapture` hook libraries (1.5.6), shipped with Bazzite: they let OBS capture a Vulkan game directly; step 5 compares this method with the others.

## How to read it again

```sh
lscpu; free -h; lspci -nn | grep -Ei "vga|audio"
glxinfo -B; vainfo
kscreen-doctor -o
pactl list short sources; pactl list short sinks
v4l2-ctl --list-devices; v4l2-ctl -d /dev/video1 --list-formats-ext
ip -br link; nmcli device
flatpak list --app | grep -i obs
```
