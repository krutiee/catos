import { createInitialTree } from "./filesystem.js";

export function createShellState(content) {
  return {
    cwd: "/home/hitanshu",
    user: "hitanshu",
    host: "catos",
    history: [],
    historyIndex: null,
    env: { HOME: "/home/hitanshu", PWD: "/home/hitanshu" },
    filesystem: createInitialTree(content),
    commandCount: 0,
    birthdayUnlocked: false,
    birthdayCompleted: false,
    inputLocked: false,
  };
}

export function promptParts(shell) {
  const home = shell.env.HOME;
  const cwd = shell.cwd === home ? "~" : shell.cwd.replace(home, "~");
  return { user: shell.user, host: shell.host, cwd };
}
