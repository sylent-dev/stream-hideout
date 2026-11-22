// Fills the HUD from the lines of the game's log, and counts the time live.
//
// The page reads LOG_FILE, next to it, every POLL_MS: OBS's Browser source serves the files of a
// local page from disk, with no cache of its own (browser-scheme.cpp of obs-browser), and the
// query string added to each request keeps Chromium from reusing an old copy. Until step 9b,
// LOG_FILE is an invented log; then it becomes the lines of the real log that the HUD needs.
//
// The mode played comes from the page: softcore.html shows the deaths, hardcore.html doesn't (a
// death ends a hardcore character; owner, 2026-11-22).

const LOG_FILE = "sample-client.txt";
const POLL_MS = 2000;

// The moment the live began, kept between two loads of the page. Every local page of OBS shares
// one origin (http://absolute), hence a key specific to this project.
const LIVE_START_KEY = "stream-hideout.hud.live-start";
const LIVE_START_MAX_AGE_MS = 24 * 60 * 60 * 1000;

const state = { character: null, className: null, level: null, area: null, areaId: null, areaLevel: null, deaths: 0 };
let liveStart = null;

// The lines of the log the HUD reads, as the French client writes them (checked in the owner's
// log on 2026-11-22, docs/obs-hud.md):
//   [INFO Client 320] : SylentFrost (Sorcière) a atteint le niveau 88.
//   [INFO Client 320] : SylentFrost vient de mourir.
//   [DEBUG Client 320] Generating level 79 area "MapSampleNest" with seed 1827364510
//   [INFO Client 320] [SCENE] Set Source [(null)]
//   [INFO Client 320] [SCENE] Set Source [Le Nid abominable]
// A death counts only for the character played: the log also announces the deaths of the ladder
// (« * (Dév.): <player> (Niveau 98) vient de mourir à la 27e place du classement. »). The world
// map and the Atlas write « Set Source [Acte 1] » or « [Atlas] » when they open: the area entered
// is the name right after « [(null)] ».
function readLog(text) {
  const read = { character: null, className: null, level: null, area: null, areaId: null, areaLevel: null, deaths: 0 };
  let entering = false;
  for (const line of text.split(/\r?\n/)) {
    let match;
    if ((match = line.match(/\] : (.+) \((.+)\) a atteint le niveau (\d+)\.$/))) {
      [, read.character, read.className, read.level] = match;
    } else if ((match = line.match(/\] : (\S+) vient de mourir\.$/))) {
      if (match[1] === read.character) read.deaths += 1;
    } else if ((match = line.match(/Generating level (\d+) area "([^"]+)"/))) {
      [, read.areaLevel, read.areaId] = match;
    } else if ((match = line.match(/\[SCENE\] Set Source \[(.*)\]$/))) {
      if (match[1] === "(null)") {
        entering = true;
      } else if (entering) {
        read.area = match[1];
        entering = false;
      }
    }
  }
  return read;
}

// A town or a hideout has a level in the log (15, 65) that means nothing to a viewer.
const isQuietArea = areaId => /^Hideout|_town$/i.test(areaId ?? "");

function formatDuration(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  return `${hours}:${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

const escapeHtml = text => String(text).replace(/[&<>"]/g, character => `&#${character.charCodeAt(0)};`);

function render() {
  const T = window.TEXTS.hud;
  const softcore = document.documentElement.dataset.mode !== "hardcore";
  const lines = [];
  if (state.character) lines.push(`<div class="ovl-line ovl-name">${escapeHtml(state.character)}</div>`);
  if (state.className) {
    lines.push(`<div class="ovl-line">${escapeHtml(state.className)} <span class="ovl-weak">${T.level} ${escapeHtml(state.level)}</span></div>`);
  }
  if (state.area) {
    const level = state.areaLevel && !isQuietArea(state.areaId) ? ` <span class="ovl-weak">${T.level} ${escapeHtml(state.areaLevel)}</span>` : "";
    lines.push(`<div class="ovl-line">${escapeHtml(state.area)}${level}</div>`);
  }
  const counters = [];
  if (softcore && state.character) counters.push(`<span class="ovl-label">${T.deaths}</span> <span class="ovl-deaths">${state.deaths}</span>`);
  if (liveStart) counters.push(`<span class="ovl-label">${T.live}</span> ${formatDuration(Date.now() - liveStart)}`);
  if (counters.length) lines.push(`<div class="ovl-line">${counters.join(`<span class="ovl-label">${T.separator}</span>`)}</div>`);
  const hud = document.getElementById("hud");
  const html = lines.join("");
  if (hud.innerHTML !== html) hud.innerHTML = html;
}

async function poll() {
  try {
    const response = await fetch(`${LOG_FILE}?t=${Date.now()}`, { cache: "no-store" });
    if (response.ok) Object.assign(state, readLog(await response.text()));
  } catch (error) {
    // The file may be missing for a moment (step 9b writes it): the HUD keeps what it shows.
  }
  render();
}

// localStorage may refuse access (a private profile): the time then counts from the load.
const storedStart = {
  read() {
    try {
      const value = Number(localStorage.getItem(LIVE_START_KEY));
      return value && Date.now() - value < LIVE_START_MAX_AGE_MS ? value : null;
    } catch {
      return null;
    }
  },
  write(value) {
    try {
      if (value) localStorage.setItem(LIVE_START_KEY, String(value));
      else localStorage.removeItem(LIVE_START_KEY);
    } catch {
      // Nothing to keep.
    }
  },
};

// OBS tells the page when the live starts and stops, but not when a running live began
// (README of obs-browser: getStatus gives booleans only). The page notes the moment itself, and
// a page loaded during a live takes the moment noted before, or now if there is none.
function watchLive() {
  if (!window.obsstudio) {
    liveStart = Date.now(); // In a browser, outside OBS, to see the time count.
    return;
  }
  window.addEventListener("obsStreamingStarted", () => {
    liveStart = Date.now();
    storedStart.write(liveStart);
    render();
  });
  window.addEventListener("obsStreamingStopped", () => {
    liveStart = null;
    storedStart.write(null);
    render();
  });
  // Needs the page permission « Read access to OBS status information », the default.
  window.obsstudio.getStatus(status => {
    if (status.streaming) {
      liveStart = storedStart.read() ?? Date.now();
      storedStart.write(liveStart);
    }
    render();
  });
}

watchLive();
poll();
setInterval(poll, POLL_MS);
setInterval(render, 1000);
