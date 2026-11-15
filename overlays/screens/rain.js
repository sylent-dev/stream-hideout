// The rain behind the texts of « Pause » and « Fin »: rain 15 « Pluie de sang » of
// docs/mockups/screens.html, with the settings the owner chose on 2026-11-15. Drawn on the
// canvas .ovl-rain, at the size of the OBS canvas; OBS's browser runs it at the frame rate of
// the Browser source.

(() => {
  const SETTINGS = {
    count: 850 * 2,               // Rain density ×2.
    speed: [1200 * 0.6, 1800 * 0.6], // Pixels per second, rain speed ×0.6; the drops fall straight.
    length: [40, 76],
    width: [1.2, 2.4],
    alpha: [0.12, 0.46],
    red: 1 / 6,                   // One drop in six falls red.
    gridOpacity: 0.3,
    lightningEvery: [4, 9],       // Seconds between two strikes, at random.
    lightningColors: ["255, 255, 255", "229, 56, 59"], // White or red, at random; the screen stays still.
  };
  const W = 2560;
  const H = 1440;
  const HORIZON = 900; // Where the floor meets the sky, under the texts.
  const RED = "229, 56, 59";
  const WHITE = "210, 218, 228";

  const canvas = document.querySelector(".ovl-rain");
  const context = canvas.getContext("2d");
  const word = (() => {
    const key = canvas.dataset.word ?? "";
    return key.split(".").reduce((texts, part) => (texts ? texts[part] : undefined), window.TEXTS) ?? "";
  })();

  const between = ([low, high]) => low + Math.random() * (high - low);

  // A far drop lands near the horizon, a near one at the bottom of the screen.
  function makeDrop(fromTop) {
    const depth = 0.35 + Math.random() * 0.65;
    const ground = HORIZON + (H - HORIZON) * Math.pow((depth - 0.35) / 0.65, 1.6) + Math.random() * 30;
    return {
      x: Math.random() * W,
      y: fromTop ? -Math.random() * 200 : Math.random() * ground,
      depth,
      ground,
      speed: between(SETTINGS.speed) * depth,
      length: between(SETTINGS.length) * depth,
      width: between(SETTINGS.width) * depth,
      alpha: between(SETTINGS.alpha) * (0.5 + depth * 0.5),
      red: Math.random() < SETTINGS.red,
    };
  }
  const drops = Array.from({ length: SETTINGS.count }, () => makeDrop(false));
  const ripples = [];
  const splashes = [];

  let time = 0;
  let flash = 0;
  let color = SETTINGS.lightningColors[0];
  let bolt = null;
  let nextStrike = between(SETTINGS.lightningEvery);

  function strike() {
    flash = 1;
    color = SETTINGS.lightningColors[Math.floor(Math.random() * SETTINGS.lightningColors.length)];
    // A bolt: a broken line from the top to the horizon, with a few branches.
    const points = [[400 + Math.random() * (W - 800), -20]];
    while (points.at(-1)[1] < HORIZON) {
      const [x, y] = points.at(-1);
      points.push([x + (Math.random() - 0.5) * 160, y + 40 + Math.random() * 90]);
    }
    const branches = Array.from({ length: 3 }, () => {
      const branch = [points[2 + Math.floor(Math.random() * (points.length - 3))]];
      for (let step = 0; step < 5; step += 1) {
        branch.push([branch.at(-1)[0] + (Math.random() - 0.4) * 140, branch.at(-1)[1] + 30 + Math.random() * 60]);
      }
      return branch;
    });
    bolt = [points, ...branches];
    nextStrike = time + between(SETTINGS.lightningEvery);
  }

  function step(seconds) {
    time += seconds;
    if (time >= nextStrike) strike();
    flash = Math.max(0, flash - seconds * 1.6);
    for (const drop of drops) {
      drop.y += drop.speed * seconds;
      if (drop.y > drop.ground) {
        // On the floor, a drop leaves a flat ring, or two small splashes.
        if (ripples.length < 500 && Math.random() < 0.5) {
          ripples.push({ x: drop.x, y: drop.ground, size: 10 + 50 * drop.depth, life: 0.5, red: drop.red, alpha: drop.alpha });
        } else if (drop.depth > 0.55 && splashes.length < 600) {
          for (let piece = 0; piece < 2; piece += 1) {
            splashes.push({
              x: drop.x,
              y: drop.ground,
              vx: (Math.random() - 0.5) * 260 * drop.depth,
              vy: -(120 + Math.random() * 200) * drop.depth,
              life: 0.32,
              red: drop.red,
              alpha: drop.alpha,
            });
          }
        }
        Object.assign(drop, makeDrop(true));
      }
    }
    for (let index = splashes.length - 1; index >= 0; index -= 1) {
      const piece = splashes[index];
      piece.life -= seconds;
      piece.vy += 1400 * seconds;
      piece.x += piece.vx * seconds;
      piece.y += piece.vy * seconds;
      if (piece.life <= 0) splashes.splice(index, 1);
    }
    for (let index = ripples.length - 1; index >= 0; index -= 1) {
      ripples[index].life -= seconds;
      if (ripples[index].life <= 0) ripples.splice(index, 1);
    }
  }

  // The floor: a grid in perspective, its lines running to a vanishing point at the center of the horizon.
  // Depth z = 1 at the bottom of the screen; a line at depth z sits at HORIZON + (H - HORIZON) / z.
  function drawFloor(light) {
    const opacity = SETTINGS.gridOpacity;
    const fade = context.createLinearGradient(0, HORIZON, 0, H);
    fade.addColorStop(0, "rgba(255, 255, 255, 0)");
    fade.addColorStop(0.3, `rgba(255, 255, 255, ${(0.12 + light * 0.25) * opacity})`);
    fade.addColorStop(1, `rgba(255, 255, 255, ${(0.24 + light * 0.3) * opacity})`);
    context.strokeStyle = fade;
    context.lineWidth = 2;
    context.beginPath();
    for (let column = -40; column <= 40; column += 1) {
      context.moveTo(W / 2, HORIZON);
      context.lineTo(W / 2 + column * 180 * 2.2, H + (H - HORIZON) * 1.2);
    }
    for (let line = 0; line < 60; line += 1) {
      const y = HORIZON + (H - HORIZON) / (0.8 + line * 0.5);
      if (y > H + 4) continue;
      context.moveTo(0, y);
      context.lineTo(W, y);
    }
    context.stroke();
    // A faint red line where the floor meets the sky.
    const horizon = context.createLinearGradient(0, 0, W, 0);
    horizon.addColorStop(0, "rgba(229, 56, 59, 0)");
    horizon.addColorStop(0.5, `rgba(229, 56, 59, ${0.35 + light * 0.5})`);
    horizon.addColorStop(1, "rgba(229, 56, 59, 0)");
    context.fillStyle = horizon;
    context.fillRect(0, HORIZON - 1, W, 2);
  }

  // The flash, the giant word and the bolt, behind the rain.
  function drawLightning() {
    const light = flash > 0 ? flash * (0.6 + 0.4 * Math.sin(time * 60)) : 0;
    if (light <= 0) return 0;
    context.fillStyle = `rgba(${color}, ${light * 0.22})`;
    context.fillRect(0, 0, W, H);
    context.font = "800 760px Manrope";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = `rgba(255, 255, 255, ${light * 0.1})`;
    context.fillText(word, W / 2, HORIZON - 380);
    if (bolt && flash > 0.55) {
      context.save();
      context.strokeStyle = `rgba(${color}, ${light})`;
      context.shadowColor = `rgba(${color}, 1)`;
      context.shadowBlur = 30;
      bolt.forEach((line, index) => {
        context.lineWidth = index === 0 ? 5 : 2;
        context.beginPath();
        line.forEach(([x, y], point) => (point ? context.lineTo(x, y) : context.moveTo(x, y)));
        context.stroke();
      });
      context.restore();
    }
    return light;
  }

  function draw() {
    context.clearRect(0, 0, W, H);
    const light = drawLightning();
    drawFloor(light);
    for (const ring of ripples) {
      const grown = 1 - ring.life / 0.5;
      context.strokeStyle = `rgba(${ring.red ? RED : WHITE}, ${Math.min(1, ring.alpha * 1.8) * (1 - grown)})`;
      context.lineWidth = 1.5;
      context.beginPath();
      context.ellipse(ring.x, ring.y, ring.size * grown, ring.size * grown * 0.22, 0, 0, Math.PI * 2);
      context.stroke();
    }
    context.lineCap = "round";
    for (const drop of drops) {
      const brighten = 1 + light * 1.5;
      context.strokeStyle = `rgba(${drop.red ? RED : WHITE}, ${Math.min(1, drop.alpha * brighten * (drop.red ? 1.6 : 1))})`;
      context.lineWidth = drop.width;
      context.beginPath();
      context.moveTo(drop.x, drop.y);
      context.lineTo(drop.x, drop.y - drop.length);
      context.stroke();
    }
    for (const piece of splashes) {
      context.fillStyle = `rgba(${piece.red ? RED : WHITE}, ${Math.min(1, piece.alpha * 2) * (piece.life / 0.32)})`;
      context.fillRect(piece.x, piece.y, 3, 3);
    }
  }

  // The giant word of the lightning is drawn in Manrope: start once the font is loaded.
  document.fonts.load("800 100px Manrope").finally(() => {
    let last = performance.now();
    requestAnimationFrame(function frame(now) {
      step(Math.min(0.05, (now - last) / 1000));
      draw();
      last = now;
      requestAnimationFrame(frame);
    });
  });
})();
