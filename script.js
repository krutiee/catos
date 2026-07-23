import { renderer } from "./terminal/renderer.js";
import * as content from "./terminal/content.js";
import { createShellState, promptParts } from "./terminal/shell.js";
import { parse } from "./terminal/parser.js";
import { dispatch } from "./terminal/commands.js";
import { pushHistory, navigateHistory } from "./terminal/history.js";
import { handleTab } from "./terminal/autocomplete.js";

const shell = createShellState(content);

async function submit(raw) {
  renderer.printCommandLine(promptParts(shell), raw);
  pushHistory(shell, raw);
  renderer.setInputValue("");

  const ast = parse(raw);
  await dispatch(shell, ast, renderer, content);

  renderer.renderPromptLine(promptParts(shell));
}

document.addEventListener("keydown", (e) => {
  if (shell.inputLocked) return;

  if (e.key === "Enter") {
    e.preventDefault();
    const raw = renderer.getInputValue();
    submit(raw);
    return;
  }

  if (e.key === "Backspace") {
    e.preventDefault();
    renderer.setInputValue(renderer.getInputValue().slice(0, -1));
    return;
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    navigateHistory(shell, renderer, "up");
    return;
  }

  if (e.key === "ArrowDown") {
    e.preventDefault();
    navigateHistory(shell, renderer, "down");
    return;
  }

  if (e.key === "Tab") {
    e.preventDefault();
    handleTab(shell, renderer);
    return;
  }

  if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
    e.preventDefault();
    renderer.clearScreen();
    return;
  }

  if (e.ctrlKey && (e.key === "c" || e.key === "C")) {
    e.preventDefault();
    renderer.setInputValue("");
    shell.historyIndex = null;
    return;
  }

  if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
    e.preventDefault();
    renderer.setInputValue(renderer.getInputValue() + e.key);
  }
});

function boot() {
  renderer.print(content.CATOS_BANNER);
  renderer.print("");
  renderer.print("CatOS v0.1 booting...");
  renderer.print("Type `help` if you get stuck. Or don't.");
  renderer.print("");
  renderer.renderPromptLine(promptParts(shell));
}

boot();
