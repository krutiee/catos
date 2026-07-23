import {
  TREAT_INTRO,
  TREAT_OUTRO,
  LASER_CAT_SPRITE,
  LASER_DOT,
  ZOOMIES_CAT_SPRITE,
  PAW_PRINT_CHAR,
  KISS_FRAMES,
} from "../content.js";

const WIDTH = 48;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Each invocation needs a fresh DOM line -- printAnimatedLine reuses whatever
// element already has the given id, so a fixed id would make re-running the
// command jump back and edit the previous run's (possibly scrolled-away) line
// instead of animating a new one at the current spot.
let animCounter = 0;
function nextAnimId(prefix) {
  animCounter += 1;
  return `${prefix}-${animCounter}`;
}

export async function treat(shell, ast, renderer) {
  renderer.print(TREAT_INTRO);
  renderer.resetProgress();
  for (let pct = 0; pct <= 100; pct += 10) {
    renderer.progress("Dispensing", pct);
    await sleep(90);
  }
  renderer.print(TREAT_OUTRO);
}

export async function laser(shell, ast, renderer) {
  const id = nextAnimId("laser-anim");
  const gap = 4;
  const spriteLen = LASER_CAT_SPRITE.length;

  for (let pos = 0; pos < WIDTH; pos += 2) {
    const row = new Array(WIDTH).fill(" ");
    const catPos = Math.max(0, pos - gap - spriteLen);
    for (let i = 0; i < spriteLen && catPos + i < WIDTH; i++) {
      row[catPos + i] = LASER_CAT_SPRITE[i];
    }
    row[pos] = LASER_DOT;
    renderer.printAnimatedLine(id, row.join(""));
    await sleep(80);
  }
}

export async function zoomies(shell, ast, renderer) {
  const id = nextAnimId("zoomies-anim");
  const trail = new Array(WIDTH).fill(" ");
  const spriteLen = ZOOMIES_CAT_SPRITE.length;
  const step = 3;
  const passes = 3;

  for (let pass = 0; pass < passes; pass++) {
    const leftToRight = pass % 2 === 0;
    for (let i = 0; i <= WIDTH - spriteLen; i += step) {
      const catPos = leftToRight ? i : WIDTH - spriteLen - i;
      const pawPos = leftToRight ? catPos - 1 : catPos + spriteLen;
      if (pawPos >= 0 && pawPos < WIDTH) trail[pawPos] = PAW_PRINT_CHAR;

      const row = trail.slice();
      for (let j = 0; j < spriteLen; j++) {
        if (catPos + j >= 0 && catPos + j < WIDTH) row[catPos + j] = ZOOMIES_CAT_SPRITE[j];
      }
      renderer.printAnimatedLine(id, row.join(""));
      await sleep(60);
    }
  }

  renderer.printAnimatedLine(id, trail.join(""));
}

export async function kiss(shell, ast, renderer) {
  for (const frame of KISS_FRAMES) {
    renderer.print(frame);
    await sleep(500);
  }
}
