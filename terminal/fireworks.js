const FRAME_MS = 40;
const BLOOM_FRAMES = 6;
const LIGHT_HOLD_FRAMES = 2;
const GRAVITY = 0.045;
const FRICTION = 0.97;
const MAX_SPARKS = 260;
const DRAIN_CAP_MS = 5000;

// Monospace cells are much taller than wide, so vertical offsets are
// compressed to keep bursts reading as circular rather than oval.
const ASPECT = 0.5;

const SIZE_PARTICLES = { small: 14, medium: 24, large: 40 };
const SIZE_RADIUS = { small: 4, medium: 6, large: 9 };

const CORE_CHARS = ["@", "O", "#", "%", "✦"];
const MID_CHARS = ["*", "x", "X", "+", "✶", "✷"];
const EDGE_CHARS = [".", "'", "`", "✸"];
const TIERS = [CORE_CHARS, MID_CHARS, EDGE_CHARS];

const TRAIL_CHARS = ["|", "|", "|", "'"];
const TRAIL_CLASSES = ["fw-trail-white", "fw-trail-yellow", "fw-trail-orange", "fw-trail-orange-dim"];

const SPARK_CHARS_BY_LEVEL = [
  ["✦", "*"],
  ["*", "+"],
  ["'", "."],
  [".", "`"],
];

const PALETTES = {
  gold: ["fw-gold-1", "fw-gold-2", "fw-white"],
  blue: ["fw-blue-1", "fw-blue-2", "fw-white"],
  purple: ["fw-purple-1", "fw-purple-2", "fw-white"],
  red: ["fw-red-1", "fw-red-2", "fw-white"],
  green: ["fw-green-1", "fw-green-2", "fw-white"],
};
PALETTES.rainbow = Object.values(PALETTES).flat();

const PALETTE_POOL = ["gold", "gold", "blue", "blue", "purple", "purple", "red", "red", "green", "green", "rainbow"];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function pickPalette() {
  return PALETTE_POOL[Math.floor(Math.random() * PALETTE_POOL.length)];
}

function pickSize() {
  const r = Math.random();
  if (r < 0.5) return "small";
  if (r < 0.85) return "medium";
  return "large";
}

function paletteColor(paletteName) {
  const colors = PALETTES[paletteName];
  return colors[Math.floor(Math.random() * colors.length)];
}

function setCell(grid, row, col, ch, cls) {
  const line = grid[Math.round(row)];
  if (!line) return;
  const r = Math.round(col);
  if (r < 0 || r >= line.length) return;
  line[r] = { ch, cls };
}

function encodeRow(cells) {
  const segments = [];
  let i = 0;
  while (i < cells.length) {
    const cls = cells[i].cls;
    let text = "";
    let j = i;
    while (j < cells.length && cells[j].cls === cls) {
      text += cells[j].ch;
      j++;
    }
    segments.push(cls ? { text, colorClass: cls } : { text });
    i = j;
  }
  return segments;
}

export async function playFireworksShow(renderer, opts = {}) {
  const { rows, cols } = renderer.createFireworksCanvas();

  const activeRockets = [];
  const activeExplosions = [];
  const activeSparks = [];
  let lastLaunchCol = null;

  function pickLaunchCol() {
    let col = Math.floor(randomBetween(6, cols - 6));
    if (lastLaunchCol != null && Math.abs(col - lastLaunchCol) < 4) {
      col = ((col + Math.floor(cols / 2)) % (cols - 12)) + 6;
    }
    lastLaunchCol = col;
    return col;
  }

  function spawnRocket({ col, apexRow, size, palette }) {
    activeRockets.push({
      col,
      row: rows - 1,
      apexRow: Math.max(1, Math.min(rows - 6, apexRow)),
      speed: randomBetween(0.75, 1.05),
      size,
      palette,
    });
  }

  function createExplosion(rocket) {
    const maxRadius = SIZE_RADIUS[rocket.size];
    const count = SIZE_PARTICLES[rocket.size];
    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        // Bias sampling toward small radii so the burst is naturally
        // dense at the center and sparse toward the edge.
        targetRadius: maxRadius * Math.random() ** 1.6,
        colorClass: paletteColor(rocket.palette),
      });
    }
    return {
      col: Math.round(rocket.col),
      row: Math.round(rocket.row),
      frame: 0,
      maxRadius,
      palette: rocket.palette,
      particles,
    };
  }

  function spawnSparksFromExplosion(explosion) {
    for (const p of explosion.particles) {
      if (activeSparks.length >= MAX_SPARKS) break;
      const dCol = Math.cos(p.angle) * p.targetRadius;
      const dRow = Math.sin(p.angle) * p.targetRadius * ASPECT;
      activeSparks.push({
        col: explosion.col + dCol,
        row: explosion.row + dRow,
        vCol: Math.cos(p.angle) * 0.12 + (Math.random() - 0.5) * 0.02,
        vRow: Math.sin(p.angle) * 0.03 * ASPECT,
        colorClass: p.colorClass,
        brightness: 0,
        age: 0,
      });
    }
  }

  function stepRockets() {
    for (let i = activeRockets.length - 1; i >= 0; i--) {
      const r = activeRockets[i];
      r.row -= r.speed;
      if (r.row <= r.apexRow) {
        activeRockets.splice(i, 1);
        activeExplosions.push(createExplosion(r));
      }
    }
  }

  function stepExplosions() {
    for (let i = activeExplosions.length - 1; i >= 0; i--) {
      const e = activeExplosions[i];
      e.frame += 1;
      for (const p of e.particles) {
        if (Math.random() < 0.2) p.colorClass = paletteColor(e.palette);
      }
      if (e.frame >= BLOOM_FRAMES + LIGHT_HOLD_FRAMES) {
        spawnSparksFromExplosion(e);
        activeExplosions.splice(i, 1);
      }
    }
  }

  function stepSparks() {
    for (let i = activeSparks.length - 1; i >= 0; i--) {
      const s = activeSparks[i];
      s.vRow += GRAVITY;
      s.vCol = s.vCol * FRICTION + (Math.random() - 0.5) * 0.03;
      s.row += s.vRow;
      s.col += s.vCol;
      s.age += 1;
      if (s.age % 5 === 0) s.brightness = Math.min(3, s.brightness + 1);

      const offCanvas = s.row > rows + 1 || s.col < -2 || s.col > cols + 2;
      // Sparks fizzle out individually once fully dim rather than all
      // vanishing on the same tick.
      const fizzled = s.brightness >= 3 && Math.random() < 0.15;
      if (offCanvas || fizzled || s.age > 50) activeSparks.splice(i, 1);
    }
  }

  function buildGrid() {
    const grid = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({ ch: " ", cls: null })),
    );

    for (const s of activeSparks) {
      const chars = SPARK_CHARS_BY_LEVEL[s.brightness];
      setCell(grid, s.row, s.col, chars[Math.floor(Math.random() * chars.length)], s.colorClass);
    }

    for (const e of activeExplosions) {
      const progress = Math.min(1, e.frame / BLOOM_FRAMES);
      for (const p of e.particles) {
        if (progress * e.maxRadius < p.targetRadius) continue;
        const jitterRadius = Math.max(0, p.targetRadius + (Math.random() - 0.5) * 0.8);
        const jitterAngle = p.angle + (Math.random() - 0.5) * 0.1;
        const dCol = Math.cos(jitterAngle) * jitterRadius;
        const dRow = Math.sin(jitterAngle) * jitterRadius * ASPECT;
        const frac = e.maxRadius > 0 ? jitterRadius / e.maxRadius : 0;
        let tier = frac < 0.35 ? 0 : frac < 0.7 ? 1 : 2;
        if (Math.random() < 0.15) tier = Math.max(0, Math.min(2, tier + (Math.random() < 0.5 ? -1 : 1)));
        const tierChars = TIERS[tier];
        setCell(grid, e.row + dRow, e.col + dCol, tierChars[Math.floor(Math.random() * tierChars.length)], p.colorClass);
      }
    }

    for (const r of activeRockets) {
      const headRow = Math.round(r.row);
      for (let i = 0; i < TRAIL_CHARS.length; i++) {
        setCell(grid, headRow + i, r.col, TRAIL_CHARS[i], TRAIL_CLASSES[i]);
      }
    }

    return grid;
  }

  let phase = "A";
  let elapsed = 0;
  let nextLaunchAt = 0;
  let rocketsLaunchedA = 0;
  const phaseADuration = randomBetween(8000, 10000);
  const phaseARocketCap = Math.floor(randomBetween(6, 10));

  let finaleQueue = [];
  let finaleIndex = 0;
  let nextFinaleLaunchAt = 0;
  let phaseCStart = null;

  while (true) {
    if (phase === "A") {
      if (elapsed >= nextLaunchAt && rocketsLaunchedA < phaseARocketCap && activeSparks.length < MAX_SPARKS) {
        spawnRocket({
          col: pickLaunchCol(),
          apexRow: Math.round(randomBetween(1, rows * 0.4)),
          size: pickSize(),
          palette: pickPalette(),
        });
        rocketsLaunchedA++;
        nextLaunchAt = elapsed + randomBetween(500, 1100);
      }
      if (elapsed >= phaseADuration || rocketsLaunchedA >= phaseARocketCap) {
        phase = "B";
        const bandWidth = cols / 4;
        finaleQueue = Array.from({ length: 4 }, (_, i) => ({
          col: Math.max(3, Math.min(cols - 3, Math.round(i * bandWidth + randomBetween(bandWidth * 0.2, bandWidth * 0.8)))),
          apexRow: Math.round(randomBetween(1, rows * 0.35)),
          size: "large",
          palette: i < 2 ? "rainbow" : pickPalette(),
        }));
        nextFinaleLaunchAt = elapsed;
      }
    } else if (phase === "B") {
      if (finaleIndex < finaleQueue.length && elapsed >= nextFinaleLaunchAt) {
        spawnRocket(finaleQueue[finaleIndex]);
        finaleIndex++;
        nextFinaleLaunchAt = elapsed + randomBetween(80, 150);
      }
      if (finaleIndex >= finaleQueue.length) {
        phase = "C";
        phaseCStart = elapsed;
      }
    } else {
      const drained = activeRockets.length === 0 && activeExplosions.length === 0 && activeSparks.length === 0;
      if (drained || elapsed - phaseCStart >= DRAIN_CAP_MS) break;
    }

    stepRockets();
    stepExplosions();
    stepSparks();

    const lit = activeExplosions.some((e) => e.frame >= BLOOM_FRAMES && e.frame < BLOOM_FRAMES + LIGHT_HOLD_FRAMES);
    renderer.setFireworksLighting(lit);
    renderer.renderFireworksFrame(buildGrid().map(encodeRow));

    elapsed += FRAME_MS;
    await sleep(FRAME_MS);
  }

  renderer.setFireworksLighting(false);
  renderer.destroyFireworksCanvas();
}
