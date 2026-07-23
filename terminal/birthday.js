import { createFile } from "./filesystem.js";
import { playFireworksShow } from "./fireworks.js";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function classForBootLine(line) {
  if (line.startsWith("[ OK ]") || line.startsWith("[PASS]")) return "stdout-success";
  if (line.startsWith("[WARN]")) return "warning";
  return undefined;
}

async function printBootLog(renderer, text) {
  for (const line of text.split("\n")) {
    renderer.print(line, { className: classForBootLine(line) });
    await sleep(180);
  }
}

function printLog(renderer, text) {
  for (const line of text.split("\n")) {
    renderer.print(line, { className: classForBootLine(line) });
  }
}

function computeSignaturePause(text, pauseMs) {
  const lines = text.split("\n");
  const signatureIndex = lines.findIndex((line) => line.startsWith("Love,"));
  return signatureIndex > 0 ? { [signatureIndex - 1]: pauseMs } : {};
}

export async function runSequence(shell, renderer, content) {
  shell.inputLocked = true;
  renderer.setInputEnabled(false);

  await printBootLog(renderer, content.BIRTHDAY_BOOT_LOG);

  renderer.resetProgress();
  for (const step of content.LOADING_STEPS) {
    for (let pct = 0; pct <= 100; pct += 20) {
      renderer.progress(step.label, pct);
      await sleep(320);
    }
  }
  await sleep(800);

  await printBootLog(renderer, content.BIRTHDAY_LAUNCH_LOG);
  await sleep(1000);

  printLog(renderer, content.MESSAGE_ACCESS_LOG);
  renderer.print("");
  await renderer.typewriter(content.HEARTFELT_MESSAGE, {
    speedMs: 70,
    blankLinePauseMs: 1000,
    linePauses: computeSignaturePause(content.HEARTFELT_MESSAGE, 1800),
    showCursor: true,
  });
  renderer.print("");
  printLog(renderer, content.MESSAGE_FOOTER_LOG);
  await sleep(4000);

  await playFireworksShow(renderer, {});

  createFile(shell, "/home/hitanshu/birthday_unlocked.flag", content.COMPLETION_FLAG_CONTENT);
  shell.birthdayCompleted = true;

  shell.inputLocked = false;
  renderer.setInputEnabled(true);
}
