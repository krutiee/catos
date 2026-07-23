const outputEl = document.getElementById("output");
const scrollEl = document.querySelector(".terminal-body");
const inputLineEl = document.getElementById("input-line");
const promptEl = inputLineEl.querySelector(".prompt");
const inputTextEl = document.getElementById("input-text");
const cursorEl = inputLineEl.querySelector(".cursor");

let fireworksContainerEl = null;
let fireworksRowEls = [];

function scrollToBottom() {
  scrollEl.scrollTop = scrollEl.scrollHeight;
}

function appendLine(text, className) {
  const line = document.createElement("div");
  if (className) line.className = className;
  line.textContent = text;
  outputEl.appendChild(line);
  scrollToBottom();
  return line;
}

function print(text = "", opts = {}) {
  String(text)
    .split("\n")
    .forEach((row) => appendLine(row, opts.className));
}

function error(text) {
  print(text, { className: "stderr" });
}

function success(text) {
  print(text, { className: "stdout-success" });
}

function printListing(rows) {
  for (const segments of rows) {
    const line = document.createElement("div");
    for (const seg of segments) {
      const span = document.createElement("span");
      if (seg.kind) span.className = `kind-${seg.kind}`;
      span.textContent = seg.text;
      line.appendChild(span);
    }
    outputEl.appendChild(line);
  }
  scrollToBottom();
}

function buildPromptSegments({ user, host, cwd }) {
  const frag = document.createDocumentFragment();
  const seg = (text, cls) => {
    const span = document.createElement("span");
    span.className = cls;
    span.textContent = text;
    return span;
  };
  frag.append(
    seg(user, "seg-user"),
    seg("@", "seg-at"),
    seg(host, "seg-host"),
    seg(":", "seg-colon"),
    seg(cwd, "seg-cwd"),
    seg("$", "seg-dollar"),
  );
  return frag;
}

function printCommandLine({ user, host, cwd }, raw) {
  const line = document.createElement("div");
  line.className = "echoed-line";

  const promptWrap = document.createElement("span");
  promptWrap.className = "prompt";
  promptWrap.appendChild(buildPromptSegments({ user, host, cwd }));
  line.appendChild(promptWrap);

  const cmdSpan = document.createElement("span");
  cmdSpan.className = "echoed-command";
  cmdSpan.textContent = raw;
  line.appendChild(cmdSpan);

  outputEl.appendChild(line);
  scrollToBottom();
}

function printAnimatedLine(id, text, className) {
  let line = document.getElementById(id);
  if (!line) {
    line = document.createElement("div");
    line.id = id;
    if (className) line.className = className;
    outputEl.appendChild(line);
  }
  line.textContent = text;
  scrollToBottom();
  return line;
}

let progressEpoch = 0;

function resetProgress() {
  progressEpoch += 1;
}

function progress(label, pct) {
  const id = `progress-${progressEpoch}-${label.replace(/\s+/g, "-")}`;
  const filled = Math.round(pct / 5);
  const bar = "#".repeat(filled).padEnd(20, "-");
  printAnimatedLine(id, `${label} [${bar}] ${pct}%`, "progress-line");
}

function measureCharWidth() {
  const probe = document.createElement("span");
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  probe.style.whiteSpace = "pre";
  probe.textContent = "0".repeat(40);
  scrollEl.appendChild(probe);
  const width = probe.getBoundingClientRect().width / 40;
  scrollEl.removeChild(probe);
  return width;
}

function createFireworksCanvas() {
  const charWidth = measureCharWidth();
  const bodyStyle = getComputedStyle(scrollEl);
  const paddingX = parseFloat(bodyStyle.paddingLeft) + parseFloat(bodyStyle.paddingRight);
  const paddingY = parseFloat(bodyStyle.paddingTop) + parseFloat(bodyStyle.paddingBottom);
  const lineHeight = parseFloat(bodyStyle.lineHeight);
  const availableWidth = scrollEl.clientWidth - paddingX;
  const availableHeight = scrollEl.clientHeight - paddingY;

  const cols = Math.min(110, Math.max(40, Math.floor(availableWidth / charWidth) - 2));
  const rows = Math.min(22, Math.max(12, Math.min(18, Math.floor(availableHeight / lineHeight))));

  fireworksContainerEl = document.createElement("div");
  fireworksContainerEl.id = "fireworks-canvas";
  fireworksRowEls = [];
  for (let i = 0; i < rows; i++) {
    const row = document.createElement("div");
    fireworksContainerEl.appendChild(row);
    fireworksRowEls.push(row);
  }
  outputEl.appendChild(fireworksContainerEl);
  scrollToBottom();

  return { rows, cols };
}

function renderFireworksFrame(rowSegments) {
  rowSegments.forEach((segments, i) => {
    const rowEl = fireworksRowEls[i];
    if (!rowEl) return;
    const frag = document.createDocumentFragment();
    for (const seg of segments) {
      const span = document.createElement("span");
      if (seg.colorClass) span.className = seg.colorClass;
      span.textContent = seg.text;
      frag.appendChild(span);
    }
    rowEl.replaceChildren(frag);
  });
  scrollToBottom();
}

function setFireworksLighting(active) {
  scrollEl.classList.toggle("fw-lit", active);
}

function destroyFireworksCanvas() {
  if (fireworksContainerEl) fireworksContainerEl.remove();
  fireworksContainerEl = null;
  fireworksRowEls = [];
  scrollToBottom();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function typewriter(text, opts = {}) {
  const speedMs = opts.speedMs ?? 18;
  const blankLinePauseMs = opts.blankLinePauseMs ?? 0;
  const linePauses = opts.linePauses ?? {};
  const rows = String(text).split("\n");

  let cursorSpan = null;
  if (opts.showCursor) {
    cursorSpan = document.createElement("span");
    cursorSpan.className = "cursor";
    cursorSpan.textContent = "█";
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const line = appendLine("", opts.className);
    const textNode = document.createTextNode("");
    line.appendChild(textNode);
    if (cursorSpan) line.appendChild(cursorSpan);

    for (const ch of row) {
      textNode.data += ch;
      scrollToBottom();
      await sleep(speedMs);
    }

    const extraPause = linePauses[i];
    if (extraPause != null) {
      await sleep(extraPause);
    } else if (row === "" && blankLinePauseMs) {
      await sleep(blankLinePauseMs);
    }
  }

  if (cursorSpan) cursorSpan.remove();
}

function clearScreen() {
  outputEl.innerHTML = "";
}

function renderPromptLine({ user, host, cwd }) {
  promptEl.replaceChildren(buildPromptSegments({ user, host, cwd }));
  inputTextEl.textContent = "";
}

function setInputEnabled(enabled) {
  inputLineEl.classList.toggle("disabled", !enabled);
  cursorEl.classList.toggle("paused", !enabled);
}

function getInputValue() {
  return inputTextEl.textContent;
}

function setInputValue(str) {
  inputTextEl.textContent = str;
}

export const renderer = {
  print,
  error,
  success,
  printListing,
  printCommandLine,
  progress,
  resetProgress,
  printAnimatedLine,
  typewriter,
  clearScreen,
  renderPromptLine,
  setInputEnabled,
  getInputValue,
  setInputValue,
  createFireworksCanvas,
  renderFireworksFrame,
  setFireworksLighting,
  destroyFireworksCanvas,
};
