export function pushHistory(shell, raw) {
  if (raw.trim().length > 0) {
    shell.history.push(raw);
  }
  shell.historyIndex = null;
}

export function navigateHistory(shell, renderer, direction) {
  if (shell.history.length === 0) return;

  if (direction === "up") {
    shell.historyIndex =
      shell.historyIndex === null
        ? shell.history.length - 1
        : Math.max(0, shell.historyIndex - 1);
    renderer.setInputValue(shell.history[shell.historyIndex]);
    return;
  }

  if (direction === "down") {
    if (shell.historyIndex === null) return;
    if (shell.historyIndex >= shell.history.length - 1) {
      shell.historyIndex = null;
      renderer.setInputValue("");
    } else {
      shell.historyIndex++;
      renderer.setInputValue(shell.history[shell.historyIndex]);
    }
  }
}
